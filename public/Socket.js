// 연동하는 코드 작성
import { CLIENT_VERSION } from './Constants.js';
import { loadhighScore } from './highsocre.js';

let userId = localStorage.getItem('uuid');

// 소켓에 http://localhost:3000 주소로 연결을 하겠다.
// io 같은 경우에는 <script src="https://cdn.socket.io/socket.io-3.0.1.min.js"></script> 라이브러리를 바로 사용할 수 있는 방법입니다.
const socket = io('http://localhost:3000', {
  // event 일 때는 버전 확인이 가능하지만 connection 일 때는 버전 확인이 불가능하다.
  // 최소한 connection 맺을 때도 버전이 뭔지 알아야 합니다.
  // 그래서 query 를 통해서 clientVersion 을 보내줘야 한다.
  // helper.js 파일의 handleConnection 함수에 뭔가 내용을 추가해 줄 수가 있다!
  query: {
    clientVersion: CLIENT_VERSION,
    uuid: userId,
  },
});

// 로직이 끝났을 때 response 라는 이름으로 반환해주는 거, 메시지 전달해주는 거
// 그래서 어떠한 메시지든 다 response 를 통해서 받게 된다.
socket.on('response', (data) => {
  console.log(data);
  if (data.highScore !== undefined) {
    loadhighScore(data.highScore);
  }
});

// 서버로부터 받은 uuid 를 userId 에 담을 거다
socket.on('connection', (data) => {
  console.log('connection: ', data);
  if (!userId) {
    localStorage.setItem('uuid', data.uuid);
    userId = data.uuid;
  }
  loadhighScore(data.highScore);
});

// event 라는 이름으로 메시지를 보내고
// handlerId를 통해서 어떤 핸들러에서 처리가 될지 결정이 된다.
// 어떤 이벤트든지 clientVersion과 같이 보내는 것
const sendEvent = (handlerId, payload) => {
  socket.emit('event', {
    userId,
    clientVersion: CLIENT_VERSION,
    handlerId,
    payload,
  });
};

export { sendEvent };

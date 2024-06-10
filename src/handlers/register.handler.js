// 유저 관리
// 유저를 서버에 등록한다.

/*
io.on 을 하면 우리 서버에 접속하는 모든 유저를 대상으로 일어나는 이벤트 입니다.
socket.on 을 하면 하나의 유저를 대상으로 한 이벤트가 처리됩니다.
*/

// uuid 를 생성하는 모듈 uuid , npm i uuid
import { v4 as uuidv4 } from 'uuid';
import { addUser } from '../models/user.model.js';
import { handleDisconnect, handleConnection } from './helper.js';
import { createStage } from '../models/stage.model.js';

const registerHandler = (io) => {
  // connection 이라는 이벤트가 발생되면 io.on 의 콜백함수가 실행된다.
  // io.on 을 하면 connection 이라는 이벤트가 발생될 때까지 대기를 하겠다는 뜻
  io.on('connection', (socket) => {
    // 최초 커넥션을 맺은 이후 발생하는 각종 이벤트를 처리하는 곳

    // 유저를 등록한다. , 유저가 서버에 접속한 경우
    // uuid 의 v4 로 uuid 생성
    const userUUID = uuidv4();
    // socket.id 인자로 들어오는 socket 이 id를 가지고 있습니다.
    addUser({ uuid: userUUID, socketId: socket.id });

    createStage(uuerUUID);

    // 접속시 유저 정보 생성 이벤트 처리
    handleConnection(socket, userUUID);

    // 접속 해제시 이벤트 처리, 유저가 접속을 끊었을 경우
    socket.on('disconnect', () => {
      handleDisconnect(socket, userUUID);
    });
  });
};

export default registerHandler;

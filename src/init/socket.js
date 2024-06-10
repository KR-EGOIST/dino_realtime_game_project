// init 이라는 폴더를 만든 이유
// 서버가 실행될 때 이 안에 있는 친구들이 항상 호출돼서 실행이 같이 된다 라는 뜻으로 init 이라는 폴더를 생성

import { Server as SocketIO } from 'socket.io';

// 매개변수로 들어오는 서버(인자로 받는 서버)는 app.js에 만든 서버가 될 겁니다.
const initSocket = (server) => {
  // 소켓IO 서버를 생성
  const io = new SocketIO();
  // io.attach 라는 메서드를 통해서 서버에 연결을 해줍니다.
  io.attach(server);
};

export default initSocket;

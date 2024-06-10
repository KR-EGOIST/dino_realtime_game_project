import { Server as SocketIO } from 'socket.io';

// 매개변수로 들어오는 서버(인자로 받는 서버)는 app.js에 만든 서버가 될 겁니다.
const initSocket = (server) => {
  // 소켓IO 서버를 생성
  const io = new SocketIO();
  // io.attach 라는 메서드를 통해서 서버에 연결을 해줍니다.
  io.attach(server);
};

export default initSocket;

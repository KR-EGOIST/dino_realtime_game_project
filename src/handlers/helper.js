// helper 란?
// 어떤 특정한 기능을 하는 건 아니지만 꼭 필요한 우리에게 도움을 주는 함수
// 컨텐츠 외에 필수 이벤트 처리 핸들러들이 선언될 파일입니다.

import { createStage } from '../models/stage.model.js';
import { removeUser, getUsers } from '../models/user.model.js';
import { CLIENT_VERSION } from '../constants.js';
import handlerMappings from './handlerMapping.js';
import { getHighScore } from '../models/highscore.model.js';

export const handleDisconnect = async (socket, uuid) => {
  await removeUser(uuid); // 사용자 삭제
  console.log(`User disconnected: ${uuid}`);
  // 현재 접속중인 유저의 수 출력
  const users = await getUsers();
  console.log('Current users: ', users);
};

// 기획 리마인드
// 스테이지에 따라서 더 높은 점수 획득
// 1스테이지, 0점 -> 1점씩
// 2스테이지, 1000점 -> 2점씩

export const handleConnection = async (socket, userUUID) => {
  console.log(`New user connected: ${userUUID} with socket ID ${socket.id}`);
  // 현재 접속중인 유저의 수 출력
  const users = await getUsers();
  console.log('Current users: ', users);
  const highScore = await getHighScore();
  console.log(highScore);
  createStage(userUUID);
  // emit 메서드로 해당 유저에게 메시지를 전달할 수 있다.
  // 현재의 경우 접속하고 나서 생성된 uuid를 바로 전달해주고 있다 (response).
  socket.emit('connection', { uuid: userUUID, highScore: highScore || 0 });
};

// 핸들러를 맵핑하는 객체를 생성했으니 사용을 할 곳이 있어야합니다.
// 유저의 모든 메세지를 받아 적절한 핸들러로 보내주는 이벤트 핸들러를 만들어봅시다.
// 여기서 data 는 payload 가 됩니다.
export const handleEvent = (io, socket, data) => {
  // 서버에 저장된 클라이언트 배열에서 메세지로 받은 clientVersion을 확인합니다.
  if (!CLIENT_VERSION.includes(data.clientVersion)) {
    // 만약 일치하는 버전이 없다면 response 이벤트로 fail 결과를 전송합니다.
    socket.emit('response', { status: 'fail', message: 'Client version mismatch' });
    return;
  }

  // 메세지로 오는 handlerId에 따라 handlerMappings 객체에서 적절한 핸들러를 찾습니다.
  const handler = handlerMappings[data.handlerId];
  // 적절한 핸들러가 없다면 실패처리합니다.
  if (!handler) {
    socket.emit('response', { status: 'fail', message: 'Handler not found' });
    return;
  }

  // 적절한 핸들러에 userID 와 payload를 전달하고 결과를 받습니다.
  const response = handler(data.userId, data.payload);
  // 만약 결과에 broadcast (모든 유저에게 전달)이 있다면 broadcast 합니다.
  if (response.broadcast) {
    io.emit('response', 'broadcast');
    return;
  }
  // 해당 유저에게 적절한 response를 전달합니다.
  socket.emit('response', response);
};

// helper 란?
// 어떤 특정한 기능을 하는 건 아니지만 꼭 필요한 우리에게 도움을 주는 함수
// 컨텐츠 외에 필수 이벤트 처리 핸들러들이 선언될 파일입니다.

import { removeUser, getUsers } from '../models/user.model.js';

export const handleDisconnect = (socket, uuid) => {
  removeUser(socket.id); // 사용자 삭제
  console.log(`User disconnected: ${socket.id}`);
  // 현재 접속중인 유저의 수 출력
  console.log('Current users: ', getUsers());
};

// 기획 리마인드
// 스테이지에 따라서 더 높은 점수 획득
// 1스테이지, 0점 -> 1점씩
// 2스테이지, 1000점 -> 2점씩

export const handleConnection = (socket, userUUID) => {
  console.log(`New user connected: ${userUUID} with socket ID ${socket.id}`);
  // 현재 접속중인 유저의 수 출력
  console.log('Current users: ', getUsers());

  // 서버 메모리에 있는 게임 에셋에서 stage 정보를 가지고 온다.
  const { stages } = getGameAssets();
  // stages 배열에서 0번째 = 첫번째스테이지 의 ID를 해당 유저의 stage에 저장한다.
  setStage(userUUID, stages.data[0].id);
  // 로그를 찍어 확인.
  console.log('Stage:', getStage(userUUID));

  // emit 메서드로 해당 유저에게 메시지를 전달할 수 있다.
  // 현재의 경우 접속하고 나서 생성된 uuid를 바로 전달해주고 있다 (response).
  socket.emit('connection', { uuid: userUUID });
};

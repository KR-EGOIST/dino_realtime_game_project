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

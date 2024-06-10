const users = []; // 유저 정보를 저장할 전역 변수

// 유저 추가, 유저가 서버에 연결을 할 경우
// 서버 메모리에 유저의 세션(소켓ID)을 저장
// 이때 유저는 객체 형태로 저장
// { uuid: string; socketId: string; };
export const addUser = (user) => {
  users.push(user);
};

// 유저 삭제 , 유저가 서버에 연결을 해제할 경우
// uuid 말고 현재 연결된 상태에서 데이터 통신을 하기 위해서 발급된 ID 이기 때문에 socketId 를 사용
export const removeUser = (socketId) => {
  const index = users.findIndex((user) => user.socketId === socketId);
  if (index !== -1) {
    return users.splice(index, 1)[0];
  }
};

// 전체 유저 조회
export const getUsers = () => {
  return users;
};

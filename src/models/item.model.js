// 아이템 정보를 객체에 {key: uuid, value: array}의 형태로 uuid를 Key로 저장합니다.
// value:array 에는 stageId를 가진 객체가 들어갑니다.
const items = {};

// 아이템 초기화
export const createItem = (uuid) => {
  items[uuid] = []; // 초기 아이템 배열 생성
};

// 현재 유저가 어느 아이템을 획득했는지 items[uuid] 해서 유저의 아이템 획득 목록 조회
export const getItem = (uuid) => {
  return items[uuid];
};

// 유저가 어떤 아이템을 획득했는지 items[uuid] 에 아이템 ID를 객체별로 push
export const setItem = (uuid, item, timestamp) => {
  return items[uuid].push({ item, timestamp });
};

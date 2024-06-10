// 스테이지 정보를 객체에 {key: uuid, value: array}의 형태로 uuid를 Key로 저장합니다.
// value:array 에는 stageId를 가진 객체가 들어갑니다.
const stages = {};

// 스테이지 초기화
export const createStage = (uuid) => {
  stages[uuid] = []; // 초기 스테이지 배열 생성
};

// 현재 유저가 어느 정도까지 왔는지 stages[uuid] 해서 유저의 배열을 조회
export const getStage = (uuid) => {
  return stages[uuid];
};

// 유저가 어떤 스테이지에 도착했는지 stages[uuid] 에 스테이지 ID를 객체별로 push
export const setStage = (uuid, id, timestamp) => {
  return stages[uuid].push({ id, timestamp });
};

// 게임이 새로 시작되면 이전에 있던 데이터들은 필요 없는 데이터라 stages[uuid]를 초기화 해준다.
export const clearStage = (uuid) => {
  return (stages[uuid] = []);
};

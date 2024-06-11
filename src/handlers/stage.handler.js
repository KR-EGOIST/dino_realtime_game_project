// 유저는 스테이지를 하나씩 올라갈 수 있다. (1스테이지 -> 2, 2 -> 3)
// 유저는 일정 점수가 되면 다음 스테이지로 이동한다.

import { getStage, setStage, clearStage } from '../models/stage.model.js';
import { getGameAssets } from '../init/assets.js';

export const moveStageHandler = (userId, payload) => {
  // currentStage (유저의 현재 스테이지)
  // targetStage (앞으로 이동할 스테이지)
  // 이 두 가지 값을 클라이언트는 서버에게 보내주게 됩니다.

  // 유저의 현재 스테이지 배열을 가져오고, 최대 스테이지 ID를 찾는다.
  let currentStages = getStage(userId);
  if (!currentStages.length) {
    return { status: 'fail', message: 'No stages found for user' };
  }

  // 오름차순 정렬 후 가장 큰 스테이지 ID 확인 <- 유저의 현재 스테이지
  // 만약 1, 2, 3, 4, 5 순으로 스테이지가 저장되어 있다면 가장 마지막에 있는 숫자가 현재 유저의 스테이지
  currentStages.sort((a, b) => a.id - b.id);
  const currentStage = currentStages[currentStages.length - 1];

  // payload 의 currentStage 와 비교
  // 클라이언트와 서버와 비교
  if (currentStage.id !== payload.currentStage) {
    return { status: 'fail', message: 'Current stage mismatch' };
  }

  // targetStage 대한 검증 <- 게임 에셋에 존재하는가?
  // 게임 에셋에서 다음 스테이지의 존재 여부 확인
  const { stages } = getGameAssets();
  if (!stages.data.some((stage) => stage.id === payload.targetStage)) {
    return { status: 'fail', message: 'Target Stage not found' };
  }

  // 점수 검증
  const serverTime = Date.now(); // 현재 타임스탬프
  // 경과 시간 elapsedTime
  // 타임스탬프는 ms 로 되어있습니다.
  // 우리는 1초당 1점이다. 즉, ms 이니까 1/1000초 이므로
  // (서버시간 - 현재 유저가 있는 스테이지의 타임스탬프) / 1000
  const elapsedTime = (serverTime - currentStage.timestamp) / 1000;

  const stageIndex = stages.data.findIndex((stage) => stage.id === payload.targetStage);
  // console.log('핸들러 : ', stageIndex, ' 서버 점수 : ', elapsedTime);
  const checkScore =
    stages.data[stageIndex].socre -
    stages.data[stageIndex - 1].socre * stages.data[stageIndex - 1].stageScore;
  if (elapsedTime < checkScore * 0.95 || elapsedTime > checkScore * 1.05) {
    return { status: 'fail', message: 'Invalid elapsed time' };
  }

  // 유저의 스테이지 정보 업데이트
  setStage(userId, payload.targetStage, serverTime);
  // 스테이지 정상 변경되었는지 서버 로그 체크
  console.log('Stage:', getStage(userId));

  return { status: 'success' };
};

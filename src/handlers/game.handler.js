import { getGameAssets } from '../init/assets.js';
import { setStage, getStage, clearStage } from '../models/stage.model.js';
import { createItem, getItem } from '../models/item.model.js';
import { setHighScore, getHighScore } from '../models/highscore.model.js';

export const gameStart = (uuid, payload) => {
  const { stages } = getGameAssets();

  // 스테이지 배열을 초기화하는 함수
  clearStage(uuid);

  // 게임 시작시 아이템 배열 초기화
  createItem(uuid);

  setStage(uuid, stages.data[0].id, payload.timestamp);
  console.log('Stage:', getStage(uuid));

  return { status: 'success' };
};
export const gameEnd = async (uuid, payload, io) => {
  const { stages: stageJson, items: itemJson } = getGameAssets();
  const { timestamp: gameEndTime, score } = payload;
  const stages = getStage(uuid);
  const items = getItem(uuid);

  if (!stages.length) {
    return { status: 'fail', message: 'No stages found for user' };
  }

  // 각 스테이지의 지속 시간을 계산하여 총 점수 계산
  let totalScore = 0;
  // 스테이지의 지속 시간을 계산하여 총 점수 계산
  stages.forEach((stage, index) => {
    let stageEndTime;
    if (index === stages.length - 1) {
      // 마지막 스테이지의 경우 종료 시간이 게임의 종료 시간
      stageEndTime = gameEndTime;
    } else {
      // 마지막 스테이지가 아닌 경우
      // 다음 스테이지의 시작 시간을 현재 스테이지의 종료 시간으로 사용
      stageEndTime = stages[index + 1].timestamp;
    }
    // 스테이지 지속 시간 (초 단위)
    const stageDuration =
      ((stageEndTime - stage.timestamp) / 1000) * stageJson.data[index].stageScore;
    // 1초당 1점
    totalScore += stageDuration;
  });
  // 먹은 아이템을 계산하여 총 점수 계산
  for (const { item, timestamp } of items) {
    totalScore += itemJson.data[item - 1].score;
  }

  console.log('총점 : ', totalScore);
  // 점수와 타임스탬프 검증 (예: 클라이언트가 보낸 총점과 계산된 총점 비교)
  // 오차범위 5
  // 여기서 score 는 클라이언트의 값
  if (Math.abs(score - totalScore) > 5) {
    return { status: 'fail', message: 'Score verification failed' };
  }

  const highScore = Math.floor(totalScore);
  const lastScore = await getHighScore();
  console.log(lastScore, highScore);
  if (lastScore < highScore) {
    await setHighScore(highScore);

    io.emit('response', { highScore: highScore });
  }

  return { status: 'success', message: 'Game ended successfully', score };
};

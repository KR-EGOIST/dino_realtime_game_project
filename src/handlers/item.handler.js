import { getGameAssets } from '../init/assets.js';
import { getItem, setItem } from '../models/item.model.js';
import { getStage } from '../models/stage.model.js';

export const dropItemHandler = (userId, payload) => {
  const { items: itemJson, itemUnlocks: itemUnlockJson } = getGameAssets();
  const { itemId, itemScore } = payload;
  const serverTime = Date.now();

  // 아이템 검증
  const itemCheck = itemJson.data.find((item) => item.id === itemId);
  if (itemCheck === undefined) {
    return { status: 'fail', message: 'Item not found' };
  }

  // 아이템 점수 검증
  if (itemScore !== itemCheck.score) {
    return { status: 'fail', message: 'Item score mismatch' };
  }

  // 유저 검증
  const stages = getStage(userId);
  if (!stages.length) {
    return { status: 'fail', message: 'No stages found for user' };
  }
  // 스테이지별 출현하는 아이템인지 검증
  const { id: stageId, timestamp } = stages[stages.length - 1];
  const itemUnlockIdx = itemUnlockJson.data.findIndex((data) => data.stage_id === stageId);
  const itemUnlockArr = itemUnlockJson.data[itemUnlockIdx].item_id;
  if (!itemUnlockArr.includes(itemId)) {
    return { status: 'fail', message: 'Item not for that stage' };
  }

  // 아이템 획득 시간간격 검증
  // 처음 아이템 획득시 undefined 이므로 if 문으로 묶어줌
  const dropItems = getItem(userId);
  const lastItem = dropItems[dropItems.length - 1];
  if (lastItem) {
    const spawnTime = serverTime - lastItem.timestamp;
    if (spawnTime < itemCheck.spawntime * 0.95) {
      return { status: 'fail', message: 'Item spawn time too short' };
    }
  }

  setItem(userId, itemId, serverTime);
  return { status: 'success', message: 'Item Verification complete' };
};

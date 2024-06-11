import { getGameAssets } from '../init/assets.js';
import { setItem } from '../models/item.model.js';
import { getStage } from '../models/stage.model.js';

export const dropItemHandler = (userId, payload) => {
  const { items: itemJson, itemUnlocks: itemUnlockJson } = getGameAssets();
  const { itemId } = payload;

  // 아이템 검증
  const itemCheck = itemJson.data.findIndex((item) => item.id === itemId);
  if (itemCheck === -1) {
    return { status: 'fail', message: 'Item not found' };
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

  setItem(userId, itemId);
  return { status: 'success', message: 'Item Verification complete' };
};

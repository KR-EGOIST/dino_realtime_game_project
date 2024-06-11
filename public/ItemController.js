import Item from './Item.js';

class ItemController {
  INTERVAL_MIN = 0;
  INTERVAL_MAX = 12000;
  myStage = 1000;
  nextInterval = null;
  items = [];

  constructor(ctx, itemImages, scaleRatio, speed, itemUnlockJson) {
    this.ctx = ctx;
    this.canvas = ctx.canvas;
    this.itemImages = itemImages;
    this.scaleRatio = scaleRatio;
    this.speed = speed;
    this.itemUnlockJson = itemUnlockJson;

    this.setNextItemTime();
  }

  setNextItemTime() {
    this.nextInterval = this.getRandomNumber(this.INTERVAL_MIN, this.INTERVAL_MAX);
  }

  getRandomNumber(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
  }

  createItem() {
    const itemUnlockIndex = this.itemUnlockJson.findIndex((data) => data.stage_id === this.myStage);
    if (itemUnlockIndex !== -1) {
      const index = this.getRandomNumber(
        0,
        this.itemUnlockJson[itemUnlockIndex].item_id.length - 1,
      );
      const itemInfo = this.itemImages[index];
      const x = this.canvas.width * 1.5;
      const y = this.getRandomNumber(10, this.canvas.height - itemInfo.height);

      const item = new Item(
        this.ctx,
        itemInfo.id,
        x,
        y,
        itemInfo.width,
        itemInfo.height,
        itemInfo.image,
      );

      this.items.push(item);
    }
  }

  updateMyStage(stageId) {
    this.myStage = stageId;
  }

  update(gameSpeed, deltaTime) {
    if (this.nextInterval <= 0) {
      this.createItem();
      this.setNextItemTime();
    }

    this.nextInterval -= deltaTime;

    this.items.forEach((item) => {
      item.update(this.speed, gameSpeed, deltaTime, this.scaleRatio);
    });

    this.items = this.items.filter((item) => item.x > -item.width);
  }

  draw() {
    this.items.forEach((item) => item.draw());
  }

  collideWith(sprite) {
    const collidedItem = this.items.find((item) => item.collideWith(sprite));
    if (collidedItem) {
      this.ctx.clearRect(collidedItem.x, collidedItem.y, collidedItem.width, collidedItem.height);
      return {
        itemId: collidedItem.id,
      };
    }
  }

  reset() {
    this.items = [];
  }
}

export default ItemController;

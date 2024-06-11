import { sendEvent } from './Socket.js';

class Score {
  score = 0;
  HIGH_SCORE_KEY = 'highScore';
  stageChangeArr = []; // 스테이지 변경 트리거 역할 배열
  myStage = 1000; // 현재 스테이지

  constructor(ctx, scaleRatio, stageJson, itemJson, itemController) {
    this.ctx = ctx;
    this.canvas = ctx.canvas;
    this.scaleRatio = scaleRatio;
    this.stageJson = stageJson;
    this.itemJson = itemJson;
    this.itemController = itemController;

    this.stageChangeArr = new Array(stageJson.length);
    this.stageChangeArr = this.stageChangeArr.fill(false);
  }

  update(deltaTime) {
    const stageIndex = this.stageJson.findIndex((stage) => stage.id === this.myStage);
    const nextStageScore = this.stageJson[stageIndex].score;
    const stageScore = this.stageJson[stageIndex].stageScore;

    // 점수 누적
    this.score += deltaTime * 0.001 * stageScore;
    // 점수가 다음 스테이지 목표 점수보다 크거나 같으면 스테이지 변경
    if (this.score >= nextStageScore) {
      this.stageChange();
    }
  }

  stageChange() {
    for (let i = 1; i < this.stageJson.length; i++) {
      const stage = this.stageJson[i];

      if (Math.floor(this.score) >= stage.score && !this.stageChange[i]) {
        this.stageChange[i] = true;
        const currentStage = this.myStage; // 현재 스테이지 임시 저장
        this.myStage = stage.id; // 바뀌는 스테이지가 이제는 내 스테이지

        sendEvent(11, { currentStage: currentStage, targetStage: this.myStage, score: this.score });

        this.itemController.updateMyStage(this.myStage);

        break;
      }
    }
  }

  getItem(itemId) {
    const itemIndex = this.itemJson.findIndex((item) => item.id === itemId);
    this.score += this.itemJson[itemIndex].score;
    sendEvent(12, { itemId });
  }

  reset() {
    this.score = 0;
    this.myStage = this.stageJson[0].id;
    this.stageChangeArr = this.stageChangeArr.fill(false);
    this.itemController.updateMyStage(this.myStage);
  }

  setHighScore() {
    const highScore = Number(localStorage.getItem(this.HIGH_SCORE_KEY));
    if (this.score > highScore) {
      localStorage.setItem(this.HIGH_SCORE_KEY, Math.floor(this.score));
    }
  }

  getScore() {
    return this.score;
  }

  draw() {
    const highScore = Number(localStorage.getItem(this.HIGH_SCORE_KEY));
    const y = 20 * this.scaleRatio;

    const fontSize = 20 * this.scaleRatio;
    this.ctx.font = `${fontSize}px serif`;
    this.ctx.fillStyle = '#525250';

    const scoreX = this.canvas.width - 75 * this.scaleRatio;
    const highScoreX = scoreX - 125 * this.scaleRatio;

    const scorePadded = Math.floor(this.score).toString().padStart(6, 0);
    const highScorePadded = highScore.toString().padStart(6, 0);

    this.ctx.fillText(scorePadded, scoreX, y);
    this.ctx.fillText(`HI ${highScorePadded}`, highScoreX, y);

    // 스테이지 구분
    const stageY = 45 * this.scaleRatio;
    const stageX = this.canvas.width / 2 - 50;
    const stageText = `스테이지 ${this.myStage - 999}`;
    this.ctx.fillText(stageText, stageX, stageY);
  }
}

export default Score;

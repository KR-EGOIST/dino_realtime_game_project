import redisClient from '../init/redis.js';

// 기본 redisClient 객체는 콜백기반인데 v4버젼은 프로미스 기반이라 사용
const redisCli = redisClient.v4;

const HIGH_SCORE_KEY = 'highscore';

export const setHighScore = async (score) => {
  const lastScore = await getHighScore();
  if (score === undefined || score > lastScore) {
    await redisCli.set(`${HIGH_SCORE_KEY}`, score);
  }
};

export const getHighScore = async () => {
  const highScore = await redisCli.get(`${HIGH_SCORE_KEY}`);
  return highScore || 0;
};

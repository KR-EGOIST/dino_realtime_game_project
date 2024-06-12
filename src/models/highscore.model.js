import redisClient from '../init/redis.js';

const redisCli = redisClient.v4;

export const setHighScore = async (score) => {
  const lastScore = await getHighScore();
  if (score === undefined || score > lastScore) {
    await redisCli.set('highscore', score);
  }
};

export const getHighScore = async () => {
  const highScore = await redisCli.get('highscore');
  return highScore;
};

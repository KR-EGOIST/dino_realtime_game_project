let gameHighScore = 0;

export const loadhighScore = (highScore) => {
  gameHighScore = highScore;
  return gameHighScore;
};

export const getHighScore = () => {
  return gameHighScore;
};

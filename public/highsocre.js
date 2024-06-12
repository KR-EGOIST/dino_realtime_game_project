let gameHighScore = '';

export const loadhighScore = (highScore) => {
  gameHighScore = highScore;
  return gameHighScore;
};

export const getHighScore = () => {
  return gameHighScore;
};

import redisClient from '../init/redis.js';

const redisCli = redisClient.v4;

const USER_KEY = 'user';

// 유저 추가, 유저가 서버에 연결을 할 경우
export const addUser = async (user) => {
  await redisCli.set(`${USER_KEY}:${user.uuid}`, JSON.stringify(user));
};

// 유저 삭제 , 유저가 서버에 연결을 해제할 경우
export const removeUser = async (uuid) => {
  const userKey = `${USER_KEY}:${uuid}`;
  const user = await redisCli.get(userKey);
  if (user) {
    await redisCli.del(userKey);
    return JSON.parse(user);
  } else {
    return null;
  }
};

// 전체 유저 조회
export const getUsers = async () => {
  const users = [];

  // keys * # 모든 키 검색
  const keys = await redisCli.keys(`${USER_KEY}:*`);

  for (const key of keys) {
    const user = await redisCli.get(key);
    users.push(JSON.parse(user));
  }
  return users;
};

// 사용자 조회
export const getUserById = async (uuid) => {
  const user = await redisClient.get(`${USER_KEY}:${uuid}`);
  return user ? JSON.parse(user) : null;
};

// 유저 데이터 청소
export const clearUsers = async () => {
  const keys = await redisCli.keys(`${USER_KEY}:*`);

  for (const key of keys) {
    await redisCli.del(key);
  }
};

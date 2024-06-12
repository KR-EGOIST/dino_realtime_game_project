import dotenv from 'dotenv';
import redis from 'redis';

dotenv.config();

const redisClient = redis.createClient({
  url: `redis://${process.env.REDIS_USERNAME}:${process.env.REDIS_PASSWORD}@${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`,
  legacyMode: true,
});

export default redisClient;

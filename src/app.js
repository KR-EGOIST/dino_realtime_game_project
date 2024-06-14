import express from 'express';
import dotenv from 'dotenv';
// socket.io 라이브러리 사용을 위해 http 모듈 사용 , Node.js 기본 라이브러리
import { createServer } from 'http';
import initSocket from './init/socket.js';
import { loadGameAssets } from './init/assets.js';
import redisClient from './init/redis.js';
import { clearUsers } from './models/user.model.js';

dotenv.config();

const app = express();
const server = createServer(app);

const PORT = 3000;
// const PORT = process.env.PORT;

app.use(express.json());
// bodyParser 라는 친구 , url 인코딩 해주는 함수
// 라이브러리 쓸 때는 true이고 아니면 false 이다.
// payload 를 자동으로 파싱 해준다는 의미이다.
app.use(express.urlencoded({ extended: false }));

// express 의 static 메서드를 사용해서 정적파일 (html, css, js)을 서빙하는 것을 설정합니다.
// 경로는 ‘public’ 폴더로 지정합니다.
app.use(express.static('public'));

// 서버를 매개변수로 함수 호출
initSocket(server);

// 테스트 코드
app.get('/', (req, res) => {
  res.send('<h1>Hello World!</h1>');
});

server.listen(PORT, async () => {
  console.log(`Server is running on port ${PORT}`);

  // 이 곳에서 파일 읽음
  try {
    const assets = await loadGameAssets();
    console.log(`Assets loaded successfully`);
    await redisClient.connect().then(); // redis v4 연결 (비동기)
    await clearUsers();
  } catch (err) {
    console.log('Failed to load game assets: ', err);
  }
});

import express from 'express';
import dotenv from 'dotenv';
import { createServer } from 'http';
import initSocket from './init/socket.js';

dotenv.config();

const app = express();
const server = createServer(app);

const PORT = process.env.PORT;

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
// 서버를 매개변수로 함수 호출
initSocket(server);

// 테스트 코드
app.get('/', (req, res) => {
  res.send('<h1>Hello World!</h1>');
});

server.listen(PORT, async () => {
  console.log(`Server is running on port ${PORT}`);
});

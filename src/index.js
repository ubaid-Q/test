import express from 'express';
import cors from 'cors';
import { route } from './route.js';
import { Server as SocketIOServer } from 'socket.io';
import { sockets } from './handler.js';

const app = express();
const port = 4000;

app.use(cors());
app.use(express.json());
app.use('/order', route);

const server = app.listen(port, () => console.log(`Server is running on ${port}`));
const io = new SocketIOServer(server);

io.on('connection', (socket) => {
  console.log('Socket Connected ::', socket.id);
  sockets.push(socket);
});

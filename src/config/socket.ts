import { Server } from 'socket.io';

let io: Server;

function configureSocket(server: any) {
  io = new Server(server);

  io.on('connection', (socket) => {
    socket.on('joinRoom', (roomName) => {
      socket.join(roomName);
    })
  });

  return io;
}

function getIO() {
  if (!io) {
    throw new Error('Socket.io has not been initialized');
  }
  return io;
}

export { configureSocket, getIO };
import { Server } from 'socket.io';

export let io: Server;

export function initWebSocket(server: any) {
  io = new Server(server, {
    cors: {
      origin: '*',
      methods: ['GET', 'POST']
    }
  });

  io.on('connection', (socket) => {
    console.log('Socket connected:', socket.id);

    socket.on('register', (userId: string) => {
      console.log(`User ${userId} registered`);
      socket.join(userId); 
    });

    socket.on('disconnect', () => {
      console.log('Socket disconnected:', socket.id);
    });
  });
}

import express from 'express';
import cors from 'cors';
import http from 'http';
import notificationRoutes from './routes/notifications';
import { initWebSocket } from './websocket';

const app = express();

app.use(cors());
app.use(express.json());

app.use('/notify', notificationRoutes);

const server = http.createServer(app);
initWebSocket(server);

const PORT = 4000;
server.listen(PORT, () => {
  console.log(`Notification service running on port ${PORT}`);
});

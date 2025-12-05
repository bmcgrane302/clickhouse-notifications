import express from 'express';
import cors from 'cors';

import authRoutes from './routes/auth';
import orgRoutes from './routes/org';
import serviceRoutes from './routes/services';

const app = express();

app.use(cors());
app.use(express.json());

app.use('/auth', authRoutes);
app.use('/org', orgRoutes);
app.use('/services', serviceRoutes);

app.listen(5000, () => {
  console.log('Mock ClickHouse API running on port 5000');
});

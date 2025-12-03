import { Router } from 'express';
import { NotificationService } from '../services/notification.service';
import { NotificationStore } from '../store/inMemoryStore';
import { ServiceChangeEvent } from '../types';

const router = Router();

router.post('/service-change', async (req, res) => {
  const event = req.body as ServiceChangeEvent;

  if (!event.orgId || !event.serviceId || !event.changeType || !event.changedBy) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  await NotificationService.notifyServiceChange(event);
  res.json({ status: 'ok' });
});

router.get('/user/:userId', (req, res) => {
  const notifications = NotificationStore.getByUser(req.params.userId);
  res.json(notifications);
});

export default router;

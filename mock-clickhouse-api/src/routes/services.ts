import { Router } from 'express';
import { SERVICES } from '../../../shared/mockClickhouseData';

const router = Router();

router.get('/:orgId', (req, res) => {
  const services = SERVICES.filter(s => s.orgId === req.params.orgId);
  res.json(services);
});

router.get('/by-id/:serviceId', (req, res) => {
  const svc = SERVICES.find(s => s.id === req.params.serviceId);

  if (!svc) {
    return res.status(404).json({ error: 'Service not found' });
  }

  res.json(svc);
});

router.post('/:serviceId/toggle', (req, res) => {
  const svc = SERVICES.find(s => s.id === req.params.serviceId);

  if (!svc) {
    return res.status(404).json({ error: 'Service not found' });
  }

  svc.status = svc.status === 'running' ? 'stopped' : 'running';
  res.json(svc);
});

export default router;

import { Router } from 'express';
import { SERVICES } from '../../../shared/mockClickhouseData';

const router = Router();

// GET /services/:orgId
router.get('/:orgId', (req, res) => {
  console.log('Fetching services for orgId:');
  const services = SERVICES.filter(s => s.orgId === req.params.orgId);
  res.json(services);
});

// GET /services/by-id/:serviceId ✅ For notification-service enrichment
router.get('/by-id/:serviceId', (req, res) => {
  const svc = SERVICES.find(s => s.id === req.params.serviceId);

  if (!svc) {
    return res.status(404).json({ error: 'Service not found' });
  }

  res.json(svc);
});


// POST /services/:serviceId/toggle
router.post('/:serviceId/toggle', (req, res) => {
  const svc = SERVICES.find(s => s.id === req.params.serviceId);

  if (!svc) {
    return res.status(404).json({ error: 'Service not found' });
  }

  svc.status = svc.status === 'running' ? 'stopped' : 'running';
  res.json(svc);
});

export default router;

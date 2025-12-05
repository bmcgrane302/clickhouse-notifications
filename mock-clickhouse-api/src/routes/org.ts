import { Router } from 'express';
import { ORGANIZATIONS, ORG_USERS } from '../../shared/mockClickhouseData';


const router = Router();

router.get('/:orgId', (req, res) => {
  const org = ORGANIZATIONS.find(o => o.id === req.params.orgId);

  if (!org) {
    return res.status(404).json({ error: 'Organization not found' });
  }

  res.json(org);
});

router.get('/:orgId/users', (req, res) => {
  const users = ORG_USERS.filter(u => u.orgId === req.params.orgId);
  res.json(users);
});


export default router;

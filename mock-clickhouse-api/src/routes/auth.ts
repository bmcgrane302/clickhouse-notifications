import { Router } from 'express';
import { ORG_USERS, ORGANIZATIONS } from '../../../shared/mockClickhouseData';

const router = Router();

// POST /auth/login
router.post('/login', (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ error: 'Email is required' });
  }

  const user = ORG_USERS.find(u => u.email === email);
  if (!user) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  const org = ORGANIZATIONS.find(o => o.id === user.orgId);

  res.json({
    user,
    organization: org ?? null
  });
});

export default router;

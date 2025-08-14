import { Router } from 'express';

const router = Router();

// Basic placeholder to build full Salla OAuth later
router.get('/salla', (req, res) => {
  const clientId = process.env.SALLA_CLIENT_ID || '';
  const redirectUri = encodeURIComponent((process.env.APP_BASE_URL || '') + '/api/auth/salla/callback');
  const url = `https://accounts.salla.sa/oauth2/auth?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=code&scope=offline_access%20read`;
  res.json({ auth_url: url });
});

router.get('/salla/callback', (req, res) => {
  res.send('Callback received (placeholder). Implement token exchange.');
});

export default router;

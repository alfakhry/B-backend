export default function verifyWebhook(req, res, next) {
  const token = req.header('x-webhook-token');
  if (!token || token !== process.env.WEBHOOK_TOKEN) {
    return res.status(401).json({ error: 'Invalid webhook token' });
  }
  next();
}

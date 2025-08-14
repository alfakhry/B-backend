import { Router } from 'express';
import prisma from '../lib/prisma.js';
import verifyWebhook from '../middleware/verifyWebhook.js';

const router = Router();

// POST /api/webhooks/orders/create
router.post('/orders/create', verifyWebhook, async (req, res) => {
  try {
    const storeId = parseInt((req.query.storeId || req.body.storeId || '1'), 10);
    await prisma.analyticsEvent.create({
      data: { storeId, type: 'orders', count: 1 }
    });
    res.json({ ok: true });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Webhook error' });
  }
});

export default router;

import { Router } from 'express';
import prisma from '../lib/prisma.js';

const router = Router();

// GET /api/analytics?storeId=1&range=30d
router.get('/', async (req, res) => {
  try {
    const storeId = parseInt(req.query.storeId || '1', 10);
    const range = req.query.range || '30d';
    const days = parseInt(range.replace('d', ''), 10) || 30;
    const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000);

    const [visitors, orders, widgetOpen] = await Promise.all([
      prisma.analyticsEvent.aggregate({ _sum: { count: true }, where: { storeId, type: 'visitors', createdAt: { gte: since } } }),
      prisma.analyticsEvent.aggregate({ _sum: { count: true }, where: { storeId, type: 'orders', createdAt: { gte: since } } }),
      prisma.analyticsEvent.aggregate({ _sum: { count: true }, where: { storeId, type: 'widget_open', createdAt: { gte: since } } })
    ]);

    res.json({
      storeId,
      range: days,
      metrics: {
        visitors: visitors._sum.count || 0,
        orders: orders._sum.count || 0,
        widget_open: widgetOpen._sum.count || 0
      }
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Analytics error' });
  }
});

export default router;

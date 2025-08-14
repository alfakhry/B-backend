import { Router } from 'express';
import prisma from '../lib/prisma.js';

const router = Router();

// GET /api/offers?storeId=1
router.get('/', async (req, res) => {
  try {
    const storeId = parseInt(req.query.storeId || '1', 10);
    const offers = await prisma.offer.findMany({
      where: { storeId, active: true },
      orderBy: { id: 'asc' }
    });
    res.json({ storeId, offers });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Failed to get offers' });
  }
});

// POST /api/offers
// body: { storeId, name, type, data, active }
router.post('/', async (req, res) => {
  try {
    const { storeId, name, type, data, active = true } = req.body;
    if (!storeId || !name || !type) {
      return res.status(400).json({ error: 'storeId, name, type are required' });
    }

    // ensure store exists
    await prisma.store.upsert({
      where: { id: storeId },
      update: {},
      create: { id: storeId }
    });

    const offer = await prisma.offer.create({
      data: { storeId, name, type, data, active }
    });

    res.json({ ok: true, offer });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Failed to create offer' });
  }
});

export default router;

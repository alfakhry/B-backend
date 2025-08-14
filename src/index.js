import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';

import analyticsRoutes from './routes/analytics.js';
import offersRoutes from './routes/offers.js';
import widgetRoutes from './routes/widget.js';
import webhooksRoutes from './routes/webhooks.js';
import sallaRoutes from './routes/salla.js';
import authRoutes from './routes/auth.js';

const app = express();
const PORT = process.env.PORT || 8080;

app.use(helmet());
app.use(cors());
app.use(express.json({ limit: '1mb' }));
app.use(morgan('tiny'));

app.get('/', (req, res) => res.json({ ok: true, name: 'Baqat Backend OK' }));

app.use('/api/analytics', analyticsRoutes);
app.use('/api/offers', offersRoutes);
app.use('/api/widget', widgetRoutes);
app.use('/api/webhooks', webhooksRoutes);
app.use('/api/salla', sallaRoutes);
app.use('/api/auth', authRoutes);

// 404
app.use((req, res) => res.status(404).json({ error: 'Not Found' }));

app.listen(PORT, () => {
  console.log(`Baqat backend listening on :${PORT}`);
});

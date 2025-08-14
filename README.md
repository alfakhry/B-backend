# Baqat Backend (Express + Prisma)

Backend for offers bundles & analytics. Ready for Railway + Neon.

## Setup (local)

```bash
cp .env.example .env   # put your values
npm install
npm run prisma:generate
npx prisma db push     # create tables
npm run dev
```

## Deploy (Railway)

- Root Directory: project root (this folder).
- Build Command: `npm ci && npx prisma generate`
- Start Command: `npm start`
- Variables: fill values from `.env.example` (without quotes).
- One-time DB init (Console): `npx prisma db push`

## Endpoints

- `GET /` → health check
- `GET /api/analytics?storeId=1&range=30d`
- `GET /api/offers?storeId=1`
- `POST /api/offers` body: `{ storeId, name, type, data, active }`
- `GET /api/widget/script`
- `GET /api/widget?storeId=1&productId=123`
- `POST /api/webhooks/orders/create`  header: `x-webhook-token: <WEBHOOK_TOKEN>`
- `GET /api/auth/salla` (placeholder)

# Product Ops Dashboard

A Next.js product operations dashboard for tracking products, owners, inventory health, and price-focused metrics.

## Stack

- Next.js 16
- React 19
- TypeScript
- Tailwind CSS 4
- Prisma
- PostgreSQL

## Prerequisites

- Node.js 20+
- npm
- PostgreSQL running locally or remotely (see Docker option below)

## Setup

1. Install dependencies:

```bash
npm install
```

2. Create your environment file:

```bash
# macOS / Linux
cp .env.example .env

# Windows
copy .env.example .env
```

3. Update `DATABASE_URL` in `.env`.

Example from `.env.example`:

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/product"
```

### Option A — Docker (recommended for local dev)

A `docker-compose.yaml` is included that spins up a PostgreSQL 14 container matching the default `DATABASE_URL`:

```bash
docker compose up -d
```

This starts a `postgres` container on port `5432` with user `postgres`, password `postgres`, and database `product`.

### Option B — Existing PostgreSQL instance

Point `DATABASE_URL` in `.env` at your own instance.

4. Apply the database migrations:

```bash
npm run db:push
```

5. Generate the Prisma client:

```bash
npm run db:generate
```

6. (Optional) Seed the database with sample data:

```bash
npm run db:seed
```

## Run the project

Start the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Useful scripts

```bash
npm run dev          # Start development server
npm run build        # Generate Prisma client + production build
npm run start        # Start production server
npm run typecheck    # TypeScript type check (no emit)
npm run lint         # ESLint (requires pnpm)
npm run db:generate  # Generate Prisma client
npm run db:push      # Apply migrations via prisma migrate deploy
npm run db:seed      # Seed the database
```

> **Note:** The `lint` script uses `pnpm exec eslint`. If you don't have `pnpm`, install it with `npm i -g pnpm` or run `npx eslint .` directly.

## Notes for new developers

- The app uses `next-themes` for light and dark mode.
- Prisma schema lives in [prisma/schema.prisma](prisma/schema.prisma).
- Main dashboard data loaders live in [lib/dashboard.ts](lib/dashboard.ts).
- Core shell and navigation components live in:
  - [components/app-shell.tsx](components/app-shell.tsx)
  - [components/sidebar.tsx](components/sidebar.tsx)
- Product listing UI lives in:
  - [app/products/products-content.tsx](app/products/products-content.tsx)
  - [components/products-table.tsx](components/products-table.tsx)

## Verification

Before opening a PR, run:

```bash
npm run typecheck
npm run build
```

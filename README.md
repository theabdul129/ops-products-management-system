# Ops Products Management System (Healf)

Full-stack **Operations Products Management System** with:

- **Frontend:** React + TypeScript (Vite)
- **Backend:** Node.js (Express) + TypeScript
- **Database:** PostgreSQL (relational schema with FK)
- **ORM:** Prisma (schema + migration SQL included)

## Features

### Product Management
- Full CRUD: create, list, details, update, delete
- Search/filter by: **name/SKU**, owner, status
- Sorting by: name, price, inventory, createdAt
- Pagination (server-side)
- Price + inventory validation (non-negative)
- Image URL + preview

### Product Owners
- Owners are constant (seeded/hardcoded: 4)
- View owners list
- Each product must belong to an owner

## Project Structure

```
ops-products-management-system/
  client/
  server/
  docker-compose.yml
  README.md
```

## Local Setup

### 1) Start Postgres

```bash
docker compose up -d
```

This creates:
- DB: `ops_products`
- User: `postgres`
- Password: `postgres`

### 2) Backend (Express + Prisma)

```bash
cd server
cp .env.example .env
npm install
npm run prisma:generate
npm run prisma:migrate
npm run seed
npm run dev
```

Backend runs on:
- `http://localhost:4000`
- Health check: `http://localhost:4000/health`

### 3) Frontend (React)

```bash
cd client
cp .env.example .env
npm install
npm run dev
```

Frontend runs on:
- `http://localhost:5173`

## API Endpoints

### Owners
- `GET /api/owners`

### Products
- `GET /api/products?ownerId=&status=&q=&sortBy=&sortOrder=&page=&pageSize=`
- `GET /api/products/:id`
- `POST /api/products`
- `PUT /api/products/:id`
- `DELETE /api/products/:id`

## Assumptions
- Product owners are seeded and remain constant (as per assignment)
- Product image is stored as **imageUrl** (no file upload required)
- No authentication required

## Notes for Reviewers
- Input validation via **Zod** in backend + frontend forms
- Proper HTTP status codes + structured errors
- Relational integrity enforced in Postgres via FK + constraints


-- Initial schema for Ops Products Management System

-- Enable pgcrypto for gen_random_uuid if not present
CREATE EXTENSION IF NOT EXISTS pgcrypto;

DO $$ BEGIN
  CREATE TYPE "ProductStatus" AS ENUM ('ACTIVE','INACTIVE','DISCONTINUED');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

CREATE TABLE IF NOT EXISTS "ProductOwner" (
  "id" TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  "name" TEXT NOT NULL,
  "email" TEXT NULL,
  "createdAt" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS "Product" (
  "id" TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  "name" TEXT NOT NULL,
  "sku" TEXT NOT NULL UNIQUE,
  "price" NUMERIC(12,2) NOT NULL,
  "inventory" INT NOT NULL DEFAULT 0,
  "status" "ProductStatus" NOT NULL DEFAULT 'ACTIVE',
  "imageUrl" TEXT NULL,
  "ownerId" TEXT NOT NULL,
  "createdAt" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT "Product_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "ProductOwner"("id") ON DELETE RESTRICT,
  CONSTRAINT "Product_price_non_negative" CHECK ("price" >= 0),
  CONSTRAINT "Product_inventory_non_negative" CHECK ("inventory" >= 0)
);

CREATE INDEX IF NOT EXISTS "ProductOwner_name_idx" ON "ProductOwner"("name");
CREATE INDEX IF NOT EXISTS "Product_name_idx" ON "Product"("name");
CREATE INDEX IF NOT EXISTS "Product_ownerId_idx" ON "Product"("ownerId");
CREATE INDEX IF NOT EXISTS "Product_status_idx" ON "Product"("status");

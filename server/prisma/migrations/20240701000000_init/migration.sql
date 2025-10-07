-- CreateEnum
CREATE TYPE "Role" AS ENUM ('USER', 'ADMIN');

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL UNIQUE,
    "password_hash" TEXT NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'USER',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE "Category" (
    "id" SERIAL PRIMARY KEY,
    "name" TEXT NOT NULL
);

CREATE TABLE "Product" (
    "id" SERIAL PRIMARY KEY,
    "category_id" INTEGER NOT NULL REFERENCES "Category"("id") ON DELETE CASCADE,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "price_cents" INTEGER NOT NULL,
    "image_path" TEXT NOT NULL,
    "stock" INTEGER NOT NULL,
    "rating" DOUBLE PRECISION NOT NULL DEFAULT 4.5,
    "form" TEXT,
    "brand" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE "Order" (
    "id" SERIAL PRIMARY KEY,
    "user_id" INTEGER NOT NULL REFERENCES "User"("id") ON DELETE CASCADE,
    "total_cents" INTEGER NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE "OrderItem" (
    "order_id" INTEGER NOT NULL REFERENCES "Order"("id") ON DELETE CASCADE,
    "product_id" INTEGER NOT NULL REFERENCES "Product"("id") ON DELETE RESTRICT,
    "qty" INTEGER NOT NULL,
    "unit_price_cents" INTEGER NOT NULL,
    PRIMARY KEY ("order_id", "product_id")
);

-- Indexes
CREATE INDEX "Product_category_id_idx" ON "Product"("category_id");
CREATE INDEX "Order_user_id_idx" ON "Order"("user_id");

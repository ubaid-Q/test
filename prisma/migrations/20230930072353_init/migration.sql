-- CreateEnum
CREATE TYPE "orderSide" AS ENUM ('BUY', 'SELL');

-- CreateTable
CREATE TABLE "Order" (
    "id" SERIAL NOT NULL,
    "side" "orderSide" NOT NULL,
    "price" DECIMAL(65,30) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Order_pkey" PRIMARY KEY ("id")
);

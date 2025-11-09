/*
  Warnings:

  - A unique constraint covering the columns `[onvoPaymentId]` on the table `Pedido` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Pedido" ADD COLUMN     "estadoPago" TEXT NOT NULL DEFAULT 'pendiente',
ADD COLUMN     "metodoPago" TEXT,
ADD COLUMN     "montoTotal" DOUBLE PRECISION NOT NULL DEFAULT 0,
ADD COLUMN     "onvoCheckoutUrl" TEXT,
ADD COLUMN     "onvoPaymentId" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Pedido_onvoPaymentId_key" ON "Pedido"("onvoPaymentId");

-- CreateIndex
CREATE INDEX "Pedido_estadoPago_idx" ON "Pedido"("estadoPago");

-- CreateIndex
CREATE INDEX "Pedido_onvoPaymentId_idx" ON "Pedido"("onvoPaymentId");

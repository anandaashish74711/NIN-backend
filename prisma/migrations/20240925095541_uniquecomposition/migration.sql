/*
  Warnings:

  - A unique constraint covering the columns `[compositionId]` on the table `Patient` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[compositionId]` on the table `Visit` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Patient_compositionId_key" ON "Patient"("compositionId");

-- CreateIndex
CREATE UNIQUE INDEX "Visit_compositionId_key" ON "Visit"("compositionId");

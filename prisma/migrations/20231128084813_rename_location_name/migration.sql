/*
  Warnings:

  - You are about to drop the column `locationDetail` on the `Appointment` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Appointment" DROP COLUMN "locationDetail",
ADD COLUMN     "locationName" VARCHAR(255);

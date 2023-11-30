/*
  Warnings:

  - You are about to drop the column `reviewClientRating` on the `Appointment` table. All the data in the column will be lost.
  - You are about to drop the column `reviewInterpreterRating` on the `Appointment` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Appointment" DROP COLUMN "reviewClientRating",
DROP COLUMN "reviewInterpreterRating",
ADD COLUMN     "locationAddress" VARCHAR(255),
ADD COLUMN     "reviewClientThumb" BOOLEAN,
ADD COLUMN     "reviewInterpreterThumb" BOOLEAN;

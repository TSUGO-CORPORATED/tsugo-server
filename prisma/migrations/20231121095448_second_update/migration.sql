/*
  Warnings:

  - You are about to drop the column `reviewNote` on the `Appointment` table. All the data in the column will be lost.
  - You are about to drop the column `reviewRating` on the `Appointment` table. All the data in the column will be lost.
  - Added the required column `uid` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Appointment" DROP COLUMN "reviewNote",
DROP COLUMN "reviewRating",
ADD COLUMN     "reviewClientNote" TEXT,
ADD COLUMN     "reviewClientRating" SMALLINT,
ADD COLUMN     "reviewTranslatorNote" TEXT,
ADD COLUMN     "reviewTranslatorRating" SMALLINT;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "about" TEXT,
ADD COLUMN     "uid" VARCHAR(255) NOT NULL;

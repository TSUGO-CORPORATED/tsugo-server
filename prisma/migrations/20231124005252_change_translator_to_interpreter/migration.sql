/*
  Warnings:

  - You are about to drop the column `reviewTranslatorNote` on the `Appointment` table. All the data in the column will be lost.
  - You are about to drop the column `reviewTranslatorRating` on the `Appointment` table. All the data in the column will be lost.
  - You are about to drop the column `translatorSpokenLanguage` on the `Appointment` table. All the data in the column will be lost.
  - You are about to drop the column `translatorUserId` on the `Appointment` table. All the data in the column will be lost.
  - Added the required column `interpreterSpokenLanguage` to the `Appointment` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Appointment" DROP CONSTRAINT "Appointment_translatorUserId_fkey";

-- AlterTable
ALTER TABLE "Appointment" DROP COLUMN "reviewTranslatorNote",
DROP COLUMN "reviewTranslatorRating",
DROP COLUMN "translatorSpokenLanguage",
DROP COLUMN "translatorUserId",
ADD COLUMN     "interpreterSpokenLanguage" VARCHAR(50) NOT NULL,
ADD COLUMN     "interpreterUserId" INTEGER,
ADD COLUMN     "reviewInterpreterNote" TEXT,
ADD COLUMN     "reviewInterpreterRating" SMALLINT;

-- AddForeignKey
ALTER TABLE "Appointment" ADD CONSTRAINT "Appointment_interpreterUserId_fkey" FOREIGN KEY ("interpreterUserId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

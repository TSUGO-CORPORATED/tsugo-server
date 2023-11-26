/*
  Warnings:

  - Added the required column `appointmentTitle` to the `Appointment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `appointmentType` to the `Appointment` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Appointment" ADD COLUMN     "appointmentTitle" VARCHAR(255) NOT NULL,
ADD COLUMN     "appointmentType" VARCHAR(50) NOT NULL,
ADD COLUMN     "locationDetail" TEXT,
ALTER COLUMN "locationLatitude" DROP NOT NULL,
ALTER COLUMN "locationLongitude" DROP NOT NULL;

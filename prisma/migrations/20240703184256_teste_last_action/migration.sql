/*
  Warnings:

  - Made the column `ordem` on table `Action` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Action" ALTER COLUMN "ordem" SET NOT NULL;

-- CreateTable
CREATE TABLE "LastAction" (
    "id" SERIAL NOT NULL,
    "func" TEXT NOT NULL,
    "action" TEXT NOT NULL,

    CONSTRAINT "LastAction_pkey" PRIMARY KEY ("id")
);

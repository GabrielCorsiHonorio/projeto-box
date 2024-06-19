/*
  Warnings:

  - You are about to drop the column `data` on the `Action` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Action" DROP COLUMN "data",
ADD COLUMN     "date" TIMESTAMP(3);

/*
  Warnings:

  - You are about to drop the column `actionId` on the `ExecutedAction` table. All the data in the column will be lost.
  - Made the column `date` on table `ExecutedAction` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "ExecutedAction" DROP CONSTRAINT "ExecutedAction_actionId_fkey";

-- AlterTable
ALTER TABLE "ExecutedAction" DROP COLUMN "actionId",
ALTER COLUMN "date" SET NOT NULL;

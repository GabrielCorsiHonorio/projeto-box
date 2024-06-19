-- DropForeignKey
ALTER TABLE "ExecutedAction" DROP CONSTRAINT "ExecutedAction_actionId_fkey";

-- AddForeignKey
ALTER TABLE "ExecutedAction" ADD CONSTRAINT "ExecutedAction_actionId_fkey" FOREIGN KEY ("actionId") REFERENCES "Action"("id") ON DELETE SET NULL ON UPDATE CASCADE;

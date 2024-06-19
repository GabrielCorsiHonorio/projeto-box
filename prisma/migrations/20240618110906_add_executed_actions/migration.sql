-- CreateTable
CREATE TABLE "ExecutedAction" (
    "id" SERIAL NOT NULL,
    "actionId" INTEGER NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ExecutedAction_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ExecutedAction" ADD CONSTRAINT "ExecutedAction_actionId_fkey" FOREIGN KEY ("actionId") REFERENCES "Action"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

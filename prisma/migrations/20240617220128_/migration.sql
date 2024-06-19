-- CreateTable
CREATE TABLE "Action" (
    "id" SERIAL NOT NULL,
    "acao" TEXT NOT NULL,
    "ordem" INTEGER NOT NULL,
    "data" TIMESTAMP(3),

    CONSTRAINT "Action_pkey" PRIMARY KEY ("id")
);

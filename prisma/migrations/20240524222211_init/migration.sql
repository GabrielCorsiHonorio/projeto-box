-- CreateTable
CREATE TABLE "Outputs" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "board" INTEGER NOT NULL,
    "gpio" INTEGER NOT NULL,
    "state" INTEGER NOT NULL,

    CONSTRAINT "Outputs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Boards" (
    "id" SERIAL NOT NULL,
    "board" INTEGER NOT NULL,
    "last_request" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Boards_pkey" PRIMARY KEY ("id")
);

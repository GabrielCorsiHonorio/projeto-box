-- CreateTable
CREATE TABLE "Briga" (
    "id" SERIAL NOT NULL,
    "tema" TEXT NOT NULL,
    "contexto" TEXT NOT NULL,
    "date" TIMESTAMP(3),
    "comentario" TEXT,

    CONSTRAINT "Briga_pkey" PRIMARY KEY ("id")
);

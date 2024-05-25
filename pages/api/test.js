import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req, res) {
  try {
    const outputs = await prisma.outputs.findMany();
    const boards = await prisma.boards.findMany();
    res.status(200).json({ outputs, boards });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
}

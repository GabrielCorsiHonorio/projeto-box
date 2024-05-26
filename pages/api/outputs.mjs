// api/outputs.mjs
import express from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const router = express.Router();

// Fetch outputs and boards data
router.get('/', async (req, res) => {
  try {
    const outputs = await prisma.outputs.findMany();
    const boards = await prisma.boards.findMany();
    res.status(200).json({ outputs, boards });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;

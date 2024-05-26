import express from 'express';
import { PrismaClient } from '@prisma/client';


const prisma = new PrismaClient();
const router = express.Router();

// GET /api/outputs
router.get('/', async (req, res) => {
  try {
    const outputs = await prisma.outputs.findMany();
    const boards = await prisma.boards.findMany();
    res.status(200).json({ outputs, boards });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch outputs and boards' });
  }
});

// POST /api/outputs
router.post('/', async (req, res) => {
  const { name, board, gpio, state } = req.body;

  try {
    const newOutput = await prisma.outputs.create({
      data: {
        name,
        board: parseInt(board),
        gpio: parseInt(gpio),
        state: parseInt(state),
      },
    });

    res.status(201).json({ message: 'Output created successfully', output: newOutput });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to create output' });
  }
});

// DELETE /api/outputs/:id
router.delete('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    await prisma.outputs.delete({
      where: {
        id: parseInt(id),
      },
    });

    res.status(200).json({ message: 'Output deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to delete output' });
  }
});

export default router

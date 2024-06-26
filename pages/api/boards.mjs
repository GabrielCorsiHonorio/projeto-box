// api/boards.mjs
import express from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const boards = await prisma.boards.findMany();
    res.status(200).json(boards);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const { board } = req.body;
    const newBoard = await prisma.boards.create({
      data: { board },
    });
    res.status(201).json(newBoard);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put('/', async (req, res) => {
  try {
    const { id, last_request } = req.body;
    const updatedBoard = await prisma.boards.update({
      where: { id: Number(id) },
      data: { last_request: new Date(last_request) },
    });
    res.status(200).json(updatedBoard);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete('/', async (req, res) => {
  try {
    const { board } = req.body;
    await prisma.boards.delete({ where: { board: Number(board) } });
    res.status(204).end();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;

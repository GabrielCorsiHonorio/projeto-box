import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const discussoes = await prisma.briga.findMany();
      res.json(discussoes);
      await prisma.$disconnect();
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch discussoes" });
    }
  } else if (req.method === 'POST') {
    const { tema, contexto, date, comentario } = req.body;
    console.log('Received body:', req.body);
    if (!tema) {
      return res.status(400).json({ error: "Tema é obrigatório" });
    }
    let formattedDate = null;
    if (date) {
      try {
        formattedDate = new Date(date);
        if (isNaN(formattedDate.getTime())) {
          throw new Error("Invalid date format");
        }
      } catch (error) {
        return res.status(400).json({ error: "Invalid date format" });
      }
    }
    try {
      const newAction = await prisma.action.create({
        data: {
          tema,
          contexto,
          date: formattedDate,
          comentario: comentario !== null && comentario !== undefined ? comentario : null,
        },
      });
      console.log('Valor da acao ',{newAction});
      res.status(201).json(newAction);
      await prisma.$disconnect();
    } catch (error) {
      res.status(500).json({ error: "Failed to create action" });
    }
  } else if (req.method === 'PUT') {
    const { id, tema, contexto, date, comentario } = req.body;
    console.log('Received update body:', req.body);
    if (!tema) {
      return res.status(400).json({ error: "Tema é obrigatório" });
    }
    let formattedDate = null;
    if (date) {
      try {
        formattedDate = new Date(date);
        if (isNaN(formattedDate.getTime())) {
          throw new Error("Invalid date format");
        }
      } catch (error) {
        return res.status(400).json({ error: "Invalid date format" });
      }
    }
    try {
      const updatedAction = await prisma.action.update({
        where: { id: parseInt(id) },
        data: {
          tema,
          contexto,
          date: formattedDate,
          comentario: comentario !== null && comentario !== undefined ? comentario : null,
        },
      });
      res.status(200).json(updatedAction);
      await prisma.$disconnect();
    } catch (error) {
      res.status(500).json({ error: "Failed to update action" });
    }
  } else if (req.method === 'DELETE') {
    const { id } = req.body;
    try {
      await prisma.action.delete({
        where: { id: parseInt(id) }
      });
      res.status(204).end();
      await prisma.$disconnect();
    } catch (error) {
      res.status(500).json({ error: "Failed to delete action" });
    }
  }else {
    res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
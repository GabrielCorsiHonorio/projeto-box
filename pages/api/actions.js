import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const actions = await prisma.action.findMany();
      res.json(actions);
      await prisma.$disconnect();
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch actions" });
    }
  } else if (req.method === 'POST') {
    const { acao, ordem, date } = req.body;
    console.log('Received body:', req.body);
    if (!acao) {
      return res.status(400).json({ error: "Ação é obrigatória" });
    }
    if (!ordem && !date) {
      return res.status(400).json({ error: "Pelo menos uma ordem ou uma data deve ser fornecida" });
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
          acao,
          ordem: ordem !== null && ordem !== undefined ? parseInt(ordem) : null,
          date: formattedDate,
        },
      });
      console.log('Valor da acao ',{newAction});
      res.status(201).json(newAction);
      await prisma.$disconnect();
    } catch (error) {
      res.status(500).json({ error: "Failed to create action" });
    }
  } else if (req.method === 'PUT') {
    const { id, acao, ordem, date } = req.body;
    console.log('Received update body:', req.body);
    if (!acao) {
      return res.status(400).json({ error: "Ação é obrigatória" });
    }
    if (!ordem && !date) {
      return res.status(400).json({ error: "Pelo menos uma ordem ou uma data deve ser fornecida" });
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
          acao,
          ordem: ordem !== null && ordem !== undefined ? parseInt(ordem) : null,
          date: formattedDate,
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

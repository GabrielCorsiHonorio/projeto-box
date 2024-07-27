import { PrismaClient } from '@prisma/client';
import moment from 'moment-timezone';

const prisma = new PrismaClient();

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  try {

  const hoje = moment.tz('America/Sao_Paulo').format('YYYY-MM-DD');
  const hojeTeste = '2024-06-21';
  // const hojeFormat = moment.tz(hoje,'America/Sao_Paulo').toISOString();
  // console.log('Valor do dia no formato', hojeFormat);

  // Buscar a execução mais recente
  const lastExecution = await prisma.executedAction.findFirst({
    orderBy: { id: 'desc' },
  });
  if (lastExecution) {
    // console.log('valor da execucao',lastExecution);
    const lastExecutionDate = moment(lastExecution.date).format('YYYY-MM-DD');
    // console.log('execucoes:', lastExecutionDate);

    if (lastExecutionDate === hoje) {
      console.log('Ação diária já executada');
      return res.status(400).json({ error: 'Ação diária já executada' });
    }

    const actions = await prisma.action.findMany();

    // Verificar se há uma ação com a data de hoje
    const acaoHoje = actions.find(action => {
      const actionDate = action.date ? moment(action.date).format('YYYY-MM-DD') : null;
      return actionDate === hoje;
    });

    if (acaoHoje) {
      await prisma.$disconnect();
      return res.status(200).json(acaoHoje);
    } else {
      // Se não houver ação com a data de hoje, buscar a ação com a menor ordem
      await prisma.$disconnect();
      const menorOrdemAction = actions.reduce((min, action) => (action.ordem < min.ordem ? action : min), actions[0]);
      return res.status(200).json(menorOrdemAction);
    }

    

  }
  } catch (error) {
    console.error('Erro ao obter ações:', error);
    return res.status(500).json({ error: 'Erro ao obter ações' });
  }
}

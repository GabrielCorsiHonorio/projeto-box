import { PrismaClient } from '@prisma/client';
import moment from 'moment-timezone';

const prisma = new PrismaClient();

let acaoGlobal = null;
let estadoGlobal = null;
let execucaoGlobal = null;
let idGlobal = null;

async function apagarAcao (id){


    const hoje = moment.tz('America/Sao_Paulo').format('YYYY-MM-DD');
     const hojeFormat = moment.tz(hoje,'America/Sao_Paulo').toISOString();
     console.log('Valor do dia no formato', hojeFormat);
     console.log('Id que será apagado',id);

   // Buscar a execução mais recente
   const lastExecution = await prisma.executedAction.findFirst({
     orderBy: { id: 'desc' },
   });
   console.log('Data da ultima execucao',lastExecution);

   // Atualizar a data de execução
   await prisma.executedAction.update({
       where: { id: lastExecution.id },
       data: { date: hojeFormat },
     });
     console.log('Date que está sendo salva', hojeFormat);

   // Excluir a ação do banco de dados
   await prisma.action.delete({
     where: { id: parseInt(id) },
   });

   await prisma.$disconnect();

   console.log('Ação original excluída:', id);
   idGlobal = null;
   res.status(201).json({ message: 'Ação executada e excluída com sucesso' });

}

export default async function handler(req, res) {
    try {
        const { action } = req.query;
        console.log(`Received ${req.method} request with action: ${action}`);

        if (!action) {
            return res.status(400).json({ error: 'Action is required' });
        }

        if (req.method === 'POST') {
            const { id, acao, estado, execucao } = req.body;
            switch (action) {
                case 'acao':
                    idGlobal = id;
                    console.log('Id que será recebiudo',id);
                    acaoGlobal = acao;
                    console.log('Acao recebida do post', acao);
                    res.status(201).json(acao);
                    break;
                case 'estado':
                    estadoGlobal = estado;
                    console.log('Estado recebido do post', estado);
                    res.status(201).json(estado);
                    // Configure um timeout para mudar a variável global para null após 2 minutos
                    setTimeout(() => {
                    estadoGlobal = null;
                    console.log('Variável global estadoGlobal configurada para null após 2 minutos.');
                    }, 2 * 60 * 1000); // 2 minutos em milissegundos
                    break;
                case 'execucao':
                    execucaoGlobal = execucao;
                    console.log('Execucao recebida do post', execucao);
                    if (execucao === 'executado'){
                        apagarAcao(idGlobal);
                    }
                    res.status(201).json(execucao);
                    break;
                default:
                    res.status(400).json({ error: 'Invalid action for POST request.' });
            }
        } else if (req.method === 'GET') {
            switch (action) {
                case 'acao':
                    console.log('Acao enviada ao get', acaoGlobal);
                    res.status(200).json(acaoGlobal);
                    break;
                case 'estado':
                    console.log('Estado enviado ao get', estadoGlobal);
                    res.status(200).json(estadoGlobal);
                    break;
                default:
                    res.status(400).json({ error: 'Invalid action for GET request.' });
            }
        } else {
          res.setHeader('Allow', ['POST', 'GET']);
          res.status(405).end(`Method ${req.method} Not Allowed`);
        }
    } catch (error) {
        console.error('Internal server error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}

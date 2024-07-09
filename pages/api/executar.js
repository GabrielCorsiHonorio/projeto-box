import { PrismaClient } from '@prisma/client';
import moment from 'moment-timezone';

const prisma = new PrismaClient();



let acaoGlobal = null;
let estadoGlobal = null;
let execucaoGlobal = null;
let lastActionGlobal = null;
let idGlobal = null;

export default async function handler(req, res) {
    try {
        const { action } = req.query;
        console.log(`Received ${req.method} request with action: ${action}`);

        if (!action) {
            return res.status(400).json({ error: 'Action is required' });
        }

        if (req.method === 'POST') {
            const { id, acao, estado, execucao, func } = req.body;
            switch (action) {
                case 'acao':
                    idGlobal = id;
                    console.log('Id que será recebido',idGlobal);
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
                  if(!idGlobal){
                    console.log('não existe id.')
                    idGlobal = id;
                  }
                    
                    execucaoGlobal = execucao;
                    console.log('Execucao recebida do post', execucao);
                    // res.status(201).json(execucao);

                    switch (execucao){
                    case 'executado':
                        try {
                            const hoje = moment.tz('America/Sao_Paulo').format('YYYY-MM-DD');
                            const hojeFormat = moment.tz(hoje, 'America/Sao_Paulo').toISOString();
                            console.log('Valor do dia no formato', hojeFormat);
                            console.log('ID que será apagado:', idGlobal);
                    
                            // Buscar a execução mais recente
                            const lastExecution = await prisma.executedAction.findFirst({
                              orderBy: { id: 'desc' },
                            });

                            if (!lastExecution) {
                                throw new Error('Nenhuma execução encontrada');
                              }

                            console.log('Data da última execução:', lastExecution);
                    
                            // Atualizar a data de execução
                            await prisma.executedAction.update({
                              where: { id: lastExecution.id },
                              data: { date: hojeFormat },
                            });
                            console.log('Data que está sendo salva:', hojeFormat);
                    
                            // Excluir a ação do banco de dados
                            await prisma.action.delete({
                              where: { id: parseInt(idGlobal) },
                            });
                    
                            console.log('Ação original excluída:', idGlobal);

                            acaoGlobal = null;
                            estadoGlobal = null;
                            execucaoGlobal = null;
                            idGlobal = null ;
                    
                            // Desconectar do Prisma
                            await prisma.$disconnect();
                    
                            res.status(201).json({ message: 'Ação executada e excluída com sucesso' });
                          } catch (error) {
                            console.error('Erro ao apagar ação:', error);
                            await prisma.$disconnect();
                            res.status(500).json({ error: 'Erro ao executar ação' });
                          }
                          break;  
                    case 'concluido':
                      acaoGlobal = null;
                      lastActionGlobal = null;
                      res.status(201).json({ message: 'Ação direta executada com sucesso' });
                    break;
                  }
                    break;
                    case 'direto':

                      if (!lastActionGlobal){
                        console.log('não há açoes')
                      if (func === 'tampa'){
                          console.log('Executar func');
                            const lastAction = await prisma.lastAction.findUnique({
                                where: { id: 2 },
                              });
                              if (lastAction.action === "A52"){
                                acaoGlobal = "A51";
                              }else{
                                acaoGlobal = "A52";
                              }
                            try{
                                    await prisma.lastAction.update({
                                where: { id: 2 },
                                data: { 
                                    action: acaoGlobal, },
                              }); 
                              res.status(201).json(acaoGlobal);
                              await prisma.$disconnect();
                              lastActionGlobal = 'executando';
                            } catch (error) {
                                res.status(500).json({ error: "Failed to create action" });
                              } 
                        }else if (func === 'gaveta'){
                          console.log('Executar func');
                            const lastAction = await prisma.lastAction.findUnique({
                                where: { id: 1 },
                              });
                              if (lastAction.action === "A42"){
                                acaoGlobal = "A41";
                              }else{
                                acaoGlobal = "A42";
                              }
                            try{
                                 await prisma.lastAction.update({
                                where: { id: 1 },
                                data: {
                                    action: acaoGlobal, },
                              });

                              res.status(201).json(acaoGlobal);
                              await prisma.$disconnect();
                              lastActionGlobal = 'executando';
                            } catch (error) {
                                res.status(500).json({ error: "Failed to create action" });
                              } 
                        }else{
                          console.log('Ação incorreta');
                          res.status(201).json(acaoGlobal);
                        };
                      }else{
                        console.log('executando ainda');
                        res.status(201).json(acaoGlobal);
                      }

                      if(acao === "A60"){
                        acaoGlobal = "A60";
                        setTimeout(() => {
                          acaoGlobal = null;
                          console.log('Variável global estadoGlobal configurada para null após 2 minutos.');
                          }, 20 * 1000); // 2 minutos em milissegundos
                      }


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

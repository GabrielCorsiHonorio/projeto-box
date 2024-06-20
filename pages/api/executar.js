import { PrismaClient } from '@prisma/client';
import moment from 'moment-timezone';

const prisma = new PrismaClient();

let ultimaAcao = null;

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { acao, estado } = req.body;

    if (acao){
        console.log('Ação recebida:', acao);
        ultimaAcao = acao;

    try {

        res.status(201).json({ message: 'Ação recebida com sucesso', acao });

    } catch (error) {
      console.error('Erro ao registrar a ação executada:', error);
      res.status(500).json({ error: "Failed to register executed action" });
    }
    } else if (estado === 'apertado') {
        console.log('estado de botão recebida:', estado);
  
        try {
          // Processamento da ação de botão (armazenamento ou qualquer outra lógica necessária)
          // Para este exemplo, apenas estamos retornando a ação de botão recebida
  
          res.status(201).json({ message: 'Ação de botão recebida com sucesso', acaoRecebida: estado });
        } catch (error) {
          console.error('Erro ao registrar a ação do botão:', error);
          res.status(500).json({ error: "Failed to register button action" });
        }
      } else {
        res.status(400).json({ error: "Dados inválidos na requisição" });
      }
    
  } else if (req.method === 'GET') {
    // Lógica para lidar com requisição GET do ESP32
    if (req.url.startsWith === '/acao') {
      if (ultimaAcao) {
        res.status(200).json({ acao: ultimaAcao });
      } else {
        res.status(404).json({ error: "Nenhuma ação registrada ainda" });
      }
    } else if (req.url.startsWith === '/botao') {
      // Simulação de estado do botão
      const botao = {
        estado: 'apertado'
      };
      res.status(200).json(botao);
    } else {
      res.status(404).json({ error: "Rota não encontrada" });
    }
  } else {
    res.setHeader('Allow', ['POST', 'GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}





   //     const hoje = moment.tz('America/Sao_Paulo').format('YYYY-MM-DD');
    //     // const hojeTeste = '2024-06-21';
    //     const hojeFormat = moment.tz(hoje,'America/Sao_Paulo').toISOString();
    //     console.log('Valor do dia no formato', hojeFormat);

    //   // Buscar a execução mais recente
    //   const lastExecution = await prisma.executedAction.findFirst({
    //     orderBy: { id: 'desc' },
    //   });
    //   if (lastExecution) {


    //   // Executar a ação (para fins de teste, um console log)
    //   console.log('Ação executada');

    //   // Atualizar a data de execução
    //   await prisma.executedAction.update({
    //       where: { id: lastExecution.id },
    //       data: { date: hojeFormat },
    //     });
    //     console.log('Date que está sendo salva', hojeFormat);

    //   // Excluir a ação do banco de dados
    //   await prisma.action.delete({
    //     where: { id: parseInt(id) },
    //   });
    //   console.log('Ação original excluída:', id);

    //   res.status(201).json({ message: 'Ação executada e excluída com sucesso' });
    //   }
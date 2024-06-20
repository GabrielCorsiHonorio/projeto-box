import express from 'express';

const router = express.Router();

let acaoGlobal = null;
let estadoGlobal = null;
let execucaoGlobal = null;

// Função para manipular ações GET e POST
router.all('/', async (req, res) => {
    try {
        // const action = req.method === 'POST' ? req.body.action : req.query.action;
        const { action } = req.query;
        console.log(`Received ${req.method} request with action: ${action}`);

        if (!action) {
            return res.status(400).json({ error: 'Action is required' });
        }

        if (req.method === 'POST') {
            let { acao, estado, execucao } = req.body;
            switch (action) {
                case 'acao':
                    acaoGlobal = acao;
                    console.log('Acao recebida do post',acao);
                    res.status(201).json(acao);
                    break;
                case 'estado':
                    estadoGlobal = estado;
                    console.log('estado recebido do post',estado);
                    res.status(201).json(estado);
                    break;
                case 'execucao':
                    execucaoGlobal = execucao;
                    console.log('execucao recebida do post',execucao);
                    res.status(201).json(execucao);
                    break;
                default:
                    res.status(400).json({ error: 'Invalid action for POST request.' });
            }
        } else if (req.method === 'GET') {
            let { acao, estado } = req.query;
            switch (action) {
                case 'acao':
                    acao = acaoGlobal;
                    console.log('acao enviada ao get',acao);
                    res.status(200).json(acao);
                    break;
                case 'estado':
                    estado = estadoGlobal;
                    console.log('estado enviada ao get',estado);
                    res.status(200).json(estado);
                    break;
                default:
                    res.status(400).json({ error: 'Invalid action for GET request.' });
            }
        } else {
            res.status(405).json({ error: 'Method not allowed' });
        }
    } catch (error) {
        console.error('Internal server error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

export default router;
// api/esp-outputs-action.mjs

import express from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const router = express.Router();

// Function to handle SQL injection protection
function test_input(data) {
    data = data.trim();
    data = data.replace(/[\n\r]+/g, '');
    data = data.replace(/[\\"']/g, '\\$&');
    data = data.replace(/\u0000/g, '\\0');
    return data;
}

// Function to create an output
async function createOutput(name, board, gpio, state) {
    try {
        console.log(`Creating output with name: ${name}, board: ${board}, gpio: ${gpio}, state: ${state}`);
        const newOutput = await prisma.outputs.create({
            data: {
                name,
                board,
                gpio,
                state,
            },
        });

        // Check if board exists, if not, create it
        const existingBoard = await prisma.boards.findFirst({
            where: {
                board: board,
            },
        });

        if (!existingBoard) {
            console.log(`Board ${board} not found, creating new board.`);
            await prisma.boards.create({
                data: {
                    board: board,
                },
            });
        }

        return { message: 'Output created successfully', output: newOutput };
    } catch (error) {
        console.error('Error creating output:', error);
        throw error;
    }
}

// Function to get all output states of a board
async function getAllOutputStates(board) {
    try {
        console.log(`Getting all output states for board: ${board}`);
        const result = await prisma.outputs.findMany({
            where: {
                board: parseInt(board),
            },
            select: {
                gpio: true,
                state: true,
            },
        });

        const outputStates = {};
        result.forEach((row) => {
            outputStates[row.gpio] = row.state;
        });

        // Find the board ID
        const boardRecord = await prisma.boards.findFirst({
            where: {
                board: parseInt(board),
            },
        });

        if (!boardRecord) {
            throw new Error(`Board with number ${board} not found`);
        }

        // Update last board request time using the board ID
        await prisma.boards.update({
            where: {
                id: boardRecord.id,
            },
            data: {
                last_request: new Date(),
            },
        });

        return outputStates;
    } catch (error) {
        console.error('Error getting output states:', error);
        throw error;
    }
}

// Function to update the state of an output
async function updateOutput(id, state) {
    try {
        console.log(`Updating output with id: ${id}, new state: ${state}`);
        await prisma.outputs.update({
            where: {
                id: parseInt(id),
            },
            data: {
                state: parseInt(state),
            },
        });

        return { message: 'Output state updated successfully' };
    } catch (error) {
        console.error('Error updating output:', error);
        throw error;
    }
}

// Function to delete an output
// Função para deletar um output
async function deleteOutput(id) {
    try {
        console.log(`Attempting to delete output with id: ${id}`);

        // Encontrar o output pelo ID
        const output = await prisma.outputs.findUnique({
            where: {
                id: parseInt(id),
            },
            select: {
                board: true,
            },
        });

        // Verificar se o output foi encontrado
        if (!output) {
            console.error(`Output with id ${id} not found`);
            throw new Error('Output not found');
        }

        // Deletar o output
        await prisma.outputs.delete({
            where: {
                id: parseInt(id),
            },
        });

        // Verificar se a placa ainda possui outros outputs
        const remainingOutputs = await prisma.outputs.findMany({
            where: {
                board: output.board,
            },
        });

        // Se não houver mais outputs, deletar a placa
        if (remainingOutputs.length === 0) {
            await prisma.boards.delete({
                where: {
                    id: output.board,
                },
            });
        }

        console.log(`Output with id ${id} deleted successfully`);
        return { message: 'Output deleted successfully' };
    } catch (error) {
        console.error(`Error deleting output with id ${id}:`, error);
        throw error;
    }
}

// Função para manipular ações GET e POST
router.all('/', async (req, res) => {
    try {
        const action = req.method === 'POST' ? req.body.action : req.query.action;
        console.log(`Received ${req.method} request with action: ${action}`);

        if (!action) {
            return res.status(400).json({ error: 'Action is required' });
        }

        if (req.method === 'POST') {
            let { name, board, gpio, state } = req.body;
            switch (action) {
                case 'output_create':
                    name = test_input(name);
                    board = parseInt(test_input(board));
                    gpio = parseInt(test_input(gpio));
                    state = parseInt(test_input(state));
                    const createResult = await createOutput(name, board, gpio, state);
                    res.status(200).json(createResult);
                    break;
                default:
                    res.status(400).json({ error: 'Invalid action for POST request.' });
            }
        } else if (req.method === 'GET') {
            let { id, board, state } = req.query;
            switch (action) {
                case 'outputs_state':
                    board = test_input(board);
                    const statesResult = await getAllOutputStates(board);
                    res.status(200).json(statesResult);
                    break;
                case 'output_update':
                    id = test_input(id);
                    state = test_input(state);
                    const updateResult = await updateOutput(id, state);
                    res.status(200).json(updateResult);
                    break;
                case 'output_delete':
                    id = test_input(id);
                    const deleteResult = await deleteOutput(id);
                    res.status(200).json(deleteResult);
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

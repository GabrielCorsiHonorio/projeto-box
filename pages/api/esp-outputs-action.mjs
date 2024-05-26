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
            await prisma.boards.create({
                data: {
                    board: board,
                },
            });
        }

        return { message: 'Output created successfully', output: newOutput };
    } catch (error) {
        throw error;
    }
}

// Function to get all output states of a board
async function getAllOutputStates(board) {
    try {
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

        // Update last board request time
        await prisma.boards.update({
            where: {
                board: parseInt(board),
            },
            data: {
                last_request: new Date(),
            },
        });

        return outputStates;
    } catch (error) {
        throw error;
    }
}

// Function to update the state of an output
async function updateOutput(id, state) {
    try {
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
        throw error;
    }
}

// Function to delete an output
async function deleteOutput(id) {
    try {
        const output = await prisma.outputs.findUnique({
            where: {
                id: parseInt(id),
            },
            select: {
                board: true,
            },
        });

        if (!output) {
            throw new Error('Output not found');
        }

        await prisma.outputs.delete({
            where: {
                id: parseInt(id),
            },
        });

        // Check if board still has outputs, if not, delete it
        const remainingOutputs = await prisma.outputs.findMany({
            where: {
                board: output.board,
            },
        });

        if (remainingOutputs.length === 0) {
            await prisma.boards.delete({
                where: {
                    id: output.board,
                },
            });
        }

        return { message: 'Output deleted successfully' };
    } catch (error) {
        throw error;
    }
}

// Route to handle POST requests
router.post('/', async (req, res) => {
    try {
        let { action, name, board, gpio, state } = req.body;

        if (action === 'output_create') {
            name = test_input(name);
            board = parseInt(test_input(board));
            gpio = parseInt(test_input(gpio));
            state = parseInt(test_input(state));

            const result = await createOutput(name, board, gpio, state);
            res.status(200).json(result);
        } else {
            res.status(400).json({ error: 'No data posted with HTTP POST.' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to create output' });
    }
});

// Route to handle GET requests
router.get('/', async (req, res) => {
    try {
        let { action, id, board, state } = req.query;

        if (action === 'outputs_state') {
            board = test_input(board);

            const result = await getAllOutputStates(board);
            res.status(200).json(result);
        } else if (action === 'output_update') {
            id = test_input(id);
            state = test_input(state);

            const result = await updateOutput(id, state);
            res.status(200).json(result);
        } else if (action === 'output_delete') {
            id = test_input(id);

            const result = await deleteOutput(id);
            res.status(200).json(result);
        } else {
            res.status(400).json({ error: 'Invalid HTTP request.' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

export default router;

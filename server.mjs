// server.js
import express from 'express';
import outputsRouter from './pages/api/outputs.mjs';
import outputsActionRouter from './pages/api/esp-outputs-action.mjs';
import boardsRouter from './pages/api/boards.mjs';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static('public'));
app.use(express.json());
app.use('/api/outputs', outputsRouter);
app.use('/api/esp-outputs-action', outputsActionRouter);
app.use('/api/boards', boardsRouter);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

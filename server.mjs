// server.mjs
import express from 'express';
import path from 'path';
import boardsRouter from './pages/api/boards.mjs';
import outputsRouter from './pages/api/outputs.mjs';
import outputsActionRouter from './pages/api/esp-outputs-action.mjs';


const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());
app.use(express.static(path.join(process.cwd(), 'public')));

app.use('/api/boards', boardsRouter);
app.use('/api/outputs', outputsRouter);
app.use('/api/esp-outputs-action', outputsActionRouter);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

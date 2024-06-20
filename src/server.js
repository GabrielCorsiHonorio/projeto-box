import express from 'express';
// import next from 'next';
import testeRouter from '../pages/api/teste.js'; 

// const dev = process.env.NODE_ENV !== 'production';
// const app = next({ dev });
// const handle = app.getRequestHandler();

// app.prepare().then(() => {
  const server = express();

  server.use(express.json());
  // Roteia os endpoints da API
  server.use('/api/teste', testeRouter);

  // Roteia todas as outras requisições para o Next.js
  // server.all('*', (req, res) => {
  //     return handle(req, res);
  // });

  const PORT = process.env.PORT || 3001;
  server.listen(PORT, (err) => {
      if (err) throw err;
      console.log(`> Ready on http://localhost:${PORT}`);
  });
// });
  
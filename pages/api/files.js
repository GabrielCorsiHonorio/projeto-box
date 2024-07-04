// pages/api/files.js
import { db } from '../../firebaseAdmin';
// import { getFirestore, collection, query, where, getDocs } from 'firebase/firestore';

export default async function handlerFiles(req, res) {
  res.setHeader('Access-Control-Allow-Origin', 'https://gch-a-paris.vercel.app');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  // if (req.method === 'OPTIONS') {
  //   // Handle preflight request
  //   res.status(200).end();
  //   return;
  // }

  console.log('Request received:', req.method);

  // if (req.method !== 'GET' || req.method !== 'POST') {
  //   return res.status(405).json({ message: 'Method Not Allowed' });
  // }
try {
    const {username} = req.query;
    const { nome } = req.body;
    console.log('Nome do usuário',username);
    console.log('recebido de comando',req.body);
    const filesCollection = db.collection('files');


    // Obter arquivos privados do usuário específico
    const privateFilesSnapshot =  await filesCollection
    // .where('user', '==', 'box')
    .where('comment', 'array-contains', nome)
    .get();
    const privateFiles = [];
    // console.log('valor do fetch',privateFiles);
    privateFilesSnapshot.forEach((doc) => {
      privateFiles.push({
        id: doc.id,
        ...doc.data()
      });
    });

    // Combinar arquivos públicos e privados
    const files = [...privateFiles];
    console.log('valor do arquivo',files);

    // Preparar dados para enviar ao frontend
    const filesToSend = files.map((file) => ({
        id: file.id,
        // visibility: file.visibility,
        // user: file.user,
        imageURL: file.url,
        type: file.type
        // comment: file.comment
        // Outros campos do arquivo, se necessário
    }));

    // Responder com os arquivos encontrados
    return res.status(200).json(filesToSend);
  }catch (error) {
    console.error('Error fetching files:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
}

import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import styles from '../styles/comando.module.css';

const Comando = () => {
  const [isUser, setIsUser] = useState(false);
  const [acaoDiaria, setAcaoDiaria] = useState('');
  const [loading, setLoading] = useState(false);
  const [executando, setExecutando] = useState(false);
  const [botaoVisivel, setBotaoVisivel] = useState(true);
  const router = useRouter();

  useEffect(() => {
    console.log('useEffect triggered');
    const username = localStorage.getItem('username');
    const authenticated = localStorage.getItem('authenticated');

    console.log('Username from localStorage:', username);
    console.log('Authenticated from localStorage:', authenticated);


    if (username && username !== 'gabriel' && authenticated === 'true') {
      setIsUser(true);
      handleBuscarAcaoDiaria();

    } else {
      router.push('/login');
    }
  }, [router]);


  const handleBuscarAcaoDiaria = async () => {
    setLoading(true);
    try {
      // Buscar a ação diária através da API
      const response = await fetch('/api/getAction');
      if (!response.ok) {
        throw new Error('Erro ao buscar ações');
      }
      const acao = await response.json();

      if (acao) {
        setAcaoDiaria(acao);

        const envioAction = await fetch('/api/executar?action=acao', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ id: acao.id, acao: acao.acao }),
          });
    
          if (!envioAction.ok) {
            const data = await envioAction.json();
            alert(data.error || 'Erro ao registrar a ação');
            throw new Error('Erro ao registrar a ação');
          }

          
       await envioAction.json();
        // setAcaoDiaria(result.acaoRecebida);

      } else {
        setAcaoDiaria(null);
      }

    } catch (error) {
      console.error('Erro ao obter ação diária:', error);
    // console.error('Erro ao registrar a ação:', error);
    } finally {
      setLoading(false);
    }
  };


    const handleAgir = async () => {

        if (!acaoDiaria) {
          return;
        }
    
        setExecutando(true);
        try {
          // Enviar o ID da ação para o servidor para registrar a execução
          const response = await fetch('/api/executar?action=estado', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ estado:'apertado' }),
          });
    
          if (!response.ok) {
            const data = await response.json();
            alert(data.error || 'Erro ao registrar a ação');
            throw new Error('Erro ao registrar a ação');
          }
    
          console.log('Estado registrado com sucesso');
        //   setAcaoDiaria(null); // Limpar a ação diária após execução bem sucedida
        } catch (error) {
          console.error('Erro ao registrar estado:', error);
        } finally {
          setAcaoDiaria(false);
          setExecutando(false);
        }
      };

      if (!isUser) {
        return <p>Loading...</p>;
      }

  // return (
  //   <div>
  //     <h1>Ação Diária</h1>
  //     {acaoDiaria ? (
  //       <div>
  //         <p>Ação diária selecionada: {acaoDiaria.acao}</p>
  //         <button onClick={handleAgir} disabled={executando}>
  //           {executando ? 'Executando...' : 'Agir'}
  //         </button>
  //       </div>
  //     ) : (
  //       <p>{!loading && 'Ação diária já executada'}</p>
  //     )}
  //   </div>
  // );

  return (
    <div className={styles.page_container}>
      <h1 className={styles.heading}>Ação Diária</h1>
      {acaoDiaria ? (
        <div className={styles.acao_container}>
          <p className={styles.acao_text}>Ação diária selecionada: {acaoDiaria.acao}</p>
          <button onClick={handleAgir} disabled={executando} className={styles.acao_button}>
            {executando ? 'Executando...' : 'Agir'}
          </button>
        </div>
      ) : (
        <p className={styles.no_acao_text}>{!loading && 'Ação já executada'}</p>
      )}
    </div>
  );
};

export default Comando;

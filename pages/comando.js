import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/router';
import styles from '../styles/comando.module.css';
import { FaBars } from 'react-icons/fa';

const Comando = () => {
  const [isUser, setIsUser] = useState(false);
  const [acaoDiaria, setAcaoDiaria] = useState('');
  const [acaoAudio, setAcaoAudio] = useState('');
  const [acaoCarta, setAcaoCarta] = useState('');
  const [loading, setLoading] = useState(false);
  const [executando, setExecutando] = useState(false);
  const [files, setFiles] = useState([]);
  const [controlsVisible, setControlsVisible] = useState(false);
  const [CaseLetr, setCaseLetr] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [UsuAdmin, setUsuAdmin] = useState(false);

  const videoRef = useRef(null);
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

    }else if (username && username === 'gabriel' && authenticated === 'true'){
      setUsuAdmin(true);
    }else {
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
          if (acao.acao === 'A31'){
            setAcaoAudio(acao);
            console.log('procurando em files')
              // async () => {
              // try {
                console.log('Fetching files...');
                const responseFiles = await fetch(`/api/files?username=box`,{
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                  },
                  body: JSON.stringify({ nome: acao.nome  }),
                });
                if (!responseFiles.ok) {
                  throw new Error('Failed to fetch files');
                }
                const dataFiles = await responseFiles.json();
                setFiles(dataFiles);
                console.log('Files:', dataFiles);
              // } catch (error) {
              //   console.error('Error fetching files:', error);
              //   // Trate o erro de forma adequada, exibindo uma mensagem para o usuário, por exemplo.
              // } finally {
              //   console.log('Fetch files completed.');
              // }
            // };
          } else if(acao.acao === 'A2'){
            setAcaoCarta(acao)
            setCaseLetr(true);

          }else{
            setAcaoDiaria(acao);
            console.log('Mandando para a api executar');
            const envioAction = await fetch('/api/executar?action=acao', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ id: acao.id, acao: acao.acao,  }),
            });
      
            if (!envioAction.ok) {
              const data = await envioAction.json();
              alert(data.error || 'Erro ao registrar a ação');
              throw new Error('Erro ao registrar a ação');
            }
  
            
         await envioAction.json();
          // setAcaoDiaria(result.acaoRecebida);
          };



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
// Ordena os arquivos pela data, mais recentes primeiro



const handleEscutado = async () => {

  if (!acaoAudio) {
    return;
  }

  setTimeout(() => {
    setExecutando(true);
  }, 5000);

  try {
    // Enviar o ID da ação para o servidor para registrar a execução
    const response = await fetch('/api/executar?action=execucao', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ execucao:'executado',id: acaoAudio.id }),
    });

    if (!response.ok) {
      const data = await response.json();
      alert(data.error || 'Erro ao Apagar a ação');
      throw new Error('Erro ao Apgar a ação');
    }

    console.log('Estado Apagado com sucesso');
  //   setAcaoDiaria(null); // Limpar a ação diária após execução bem sucedida
  } catch (error) {
    console.error('Erro ao Apagado estado:', error);
  } finally {
    setAcaoDiaria(false);
    setAcaoAudio(false);
    setExecutando(false);
  }
};


const showControls = () => {
  setControlsVisible(true);
};

const hideControls = () => {
  setControlsVisible(false);
};

const handleVideoTouch = () => {
  const video = videoRef.current;
  if (video) {
    if (video.paused) {
      video.play();
    } else {
      video.pause();
    }
  }
};

const handleCarta = async () =>{
  setTimeout(() => {
    setExecutando(true);
  }, 5000);
  
  try {
    // Enviar o ID da ação para o servidor para registrar a execução
    const response = await fetch('/api/executar?action=execucao', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ execucao:'executado',id: acaoCarta.id }),
    });

    if (!response.ok) {
      const data = await response.json();
      alert(data.error || 'Erro ao Apagar a ação');
      throw new Error('Erro ao Apgar a ação');
    }

    console.log('Estado Apagado com sucesso');
  //   setAcaoDiaria(null); // Limpar a ação diária após execução bem sucedida
  } catch (error) {
    console.error('Erro ao Apagado estado:', error);
  } finally {
    setAcaoDiaria(false);
    setAcaoAudio(false);
    setCaseLetr(false);
    setExecutando(false);
  }
};


const toggleSidebar = () => {
  setSidebarOpen(!sidebarOpen);
};



      if (!isUser) {
        return <p>Loading...</p>;
      }



  return (
    <div className={styles.page_container}>
      {!sidebarOpen && (
      <header className={styles.header}>
        <nav className={styles.nav}>   
        <button className={styles.menu_icon} onClick={toggleSidebar}>
          <FaBars />
        </button>
        </nav>
      </header>
    )}
      <div className={`${styles.sidebar} ${sidebarOpen ? styles.open : ''}`}>
      <button className={styles.close_button} onClick={toggleSidebar}>&times;</button>
      {UsuAdmin &&(
      <button className={styles.nav_link} onClick={() => router.push('/inicio')}>Home</button>
 )}
       {!UsuAdmin &&(
          <button className={styles.nav_link} onClick={() => router.push('/home')}>Home</button>
       )}
          <button className={styles.nav_link} onClick={() => router.push('/direto')}>Direto</button>
          <button className={styles.nav_link} onClick={() => router.push('/metas')}>Metas</button>
          <button className={styles.nav_link} onClick={() => window.location.href = 'https://gch-a-paris.vercel.app'}>GCH à Paris</button>
      </div>
      <h1 className={styles.heading}>Ação Diária</h1>
      {acaoDiaria ? (
        <div className={styles.acao_container}>
          <p className={styles.acao_text}>Ação diária selecionada: {acaoDiaria.acao}</p>
          <button onClick={handleAgir} disabled={executando} className={styles.acao_button}>
            {executando ? 'Executando...' : 'Agir'}
          </button>
        </div>
      ) : (
        <p className={styles.no_acao_text}>{!loading }</p>
      )}
      
        <ul className={styles.postsList}>
      {files.map((file) => (
    <li key={file.id} className={styles.container}>
      <div className={styles.media}>
  {file.imageURL ? (
    file.type.startsWith('image/') ? (
      <img src={file.imageURL} alt={file.id} className={styles.image} />
    ) : file.type.startsWith('video/') ? (
      <div className={styles.videoContainer}    
      onMouseEnter={showControls}
      onMouseLeave={hideControls}
      onClick={handleVideoTouch}
      onTouchStart={() => videoRef.current?.play()}
      onTouchEnd={() => videoRef.current?.pause()}>
      <video ref={videoRef} controls={controlsVisible} className={styles.video} controlsList="nodownload nofullscreen" >
        <source src={file.imageURL} type={file.type} />
        Seu navegador não suporta a tag de vídeo.
      </video>
    </div>
      ) : file.type.startsWith('audio/') ? (
        <audio 
          ref={videoRef} 
          className={styles.audio}
          onClick={handleVideoTouch}
          onTouchStart={() => videoRef.current?.play()}
          onTouchEnd={() => videoRef.current?.pause()}
          controls
          >
          <source src={file.imageURL} type={file.type} />
            Seu navegador não suporta a tag de áudio.
          </audio>
    ) : (
      <p>Formato de mídia não suportado</p>
    )
  ) : (
    <p>Mídia não encontrada</p>
  )}
</div>

      <p className={styles.comment}><b>{file.comment}</b></p>
    </li>
  ))}
</ul>

{acaoAudio ? (
        <div className={styles.acao_container}>
          <button onClick={handleEscutado} disabled={executando} className={styles.acao_button}>
            {executando ? 'Apagando...' : 'Já escutei, amor'}
          </button>
        </div>
      ) : (
        <p className={styles.no_acao_text}>{!loading }</p>
      )}
{CaseLetr ? (
          <div className={styles.acao_container}>
            <p>Pegue uma carta, minha querida.</p>
            <button onClick={handleCarta} disabled={executando} className={styles.acao_button}>
            {executando ? 'Apagando...' : 'Já Peguei, amor'}
          </button>
          </div>
      ) : (
        <p className={styles.no_acao_text}>{!loading }</p>
)}
    </div>
  );
};

export default Comando;

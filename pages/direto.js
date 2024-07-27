import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import styles from '../styles/controle.module.css';
import { FaBars } from 'react-icons/fa';

const direto = () => {
    const [isUser, setIsUser] = useState(false);
    const [isDisabled, setIsDisabled] = useState(false);
    const router = useRouter();
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [UsuAdmin, setUsuAdmin] = useState(false);


    useEffect(() => {
        console.log('useEffect triggered');
        const username = localStorage.getItem('username');
        const authenticated = localStorage.getItem('authenticated');
    
        console.log('Username from localStorage:', username);
        console.log('Authenticated from localStorage:', authenticated);
    
    
        if (authenticated === 'true') {
          setIsUser(true);
          if (username && username === 'gabriel') {
            setUsuAdmin(true);
          }
    
        } else {
          router.push('/login');
        }
      }, [router]);



      if (!isUser) {
        return <p>Loading...</p>;
      }

      const handleGaveta = async () => {

        const response = await fetch('/api/executar?action=direto', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({  func:'gaveta' }),
          });
    
          if (!response.ok) {
            const data = await response.json();
            alert(data.error || 'Erro ao registrar a ação');
            // throw new Error('Erro ao registrar a ação');
          }
        //   const data = await response.json();
        //   console.log('o valor da ação retornada é',data.action)
          console.log('Estado registrado com sucesso');
          setIsDisabled(true);
          setTimeout(() => {
            setIsDisabled(false);
          }, 20000);

      };

      const handleTampa = async () => {

        const response = await fetch('/api/executar?action=direto', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ func:'tampa' }),
          });

          
    
          if (!response.ok) {
            const data = await response.json();
            alert(data.error || 'Erro ao registrar a ação');
            // throw new Error('Erro ao registrar a ação');
          }

          const data = await response.json();
          console.log(data)
          console.log('Estado registrado com sucesso');
          setIsDisabled(true);
          setTimeout(() => {
            setIsDisabled(false);
          }, 20000);

      };

      const handleCarta = async () => {

        const response = await fetch('/api/executar?action=direto', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ acao:'A60' }),
          });

          
    
          if (!response.ok) {
            const data = await response.json();
            alert(data.error || 'Erro ao registrar a ação');
            // throw new Error('Erro ao registrar a ação');
          }

          const data = await response.json();
          console.log(data)
          console.log('Estado registrado com sucesso');
          setIsDisabled(true);
          setTimeout(() => {
            setIsDisabled(false);
          }, 20000);

      };

      const toggleSidebar = () => {
        setSidebarOpen(!sidebarOpen);
      };
      
    
    
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
          <button className={styles.nav_link} onClick={() => router.push('/comando')}>Comando</button>
          <button className={styles.nav_link} onClick={() => router.push('/metas')}>metas</button>
          <button className={styles.nav_link} onClick={() => window.location.href = 'https://gch-a-paris.vercel.app'}>GCH à Paris</button>
          </div>
          <div className={styles.form_container}>
            <h1 >Controle de Ações</h1>
              <label>
                <h2>Gaveta</h2> 
                <button onClick={() => handleGaveta()} className={styles.btn_edit} disabled={isDisabled}>
                        Abrir/Fechar
                        
                </button>
              </label>
              <label>
              <h2>Tampa</h2> 
                <button onClick={() => handleTampa()} className={styles.btn_edit} disabled={isDisabled}>
                        Abrir/Fechar
                </button>
              </label>
              <label>
              <h2>Carta</h2> 
                <button onClick={() => handleCarta()} className={styles.btn_edit} disabled={isDisabled}>
                        Ejetar
                </button>
              </label>
          </div>
        </div>
      );
  

}

export default direto;
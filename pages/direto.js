import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import styles from '../styles/controle.module.css';

const direto = () => {
    const [isUser, setIsUser] = useState(false);
    const router = useRouter();


    useEffect(() => {
        console.log('useEffect triggered');
        const username = localStorage.getItem('username');
        const authenticated = localStorage.getItem('authenticated');
    
        console.log('Username from localStorage:', username);
        console.log('Authenticated from localStorage:', authenticated);
    
    
        if (username && username === 'gabriel' && authenticated === 'true') {
          setIsUser(true);
    
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
            body: JSON.stringify({ acao:'A42', func:'gaveta' }),
          });
    
          if (!response.ok) {
            const data = await response.json();
            alert(data.error || 'Erro ao registrar a ação');
            // throw new Error('Erro ao registrar a ação');
          }
        //   const data = await response.json();
        //   console.log('o valor da ação retornada é',data.action)
          console.log('Estado registrado com sucesso');

      };

      const handleTampa = async () => {

        const response = await fetch('/api/executar?action=direto', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ acao:'A51', func:'tampa' }),
          });

          
    
          if (!response.ok) {
            const data = await response.json();
            alert(data.error || 'Erro ao registrar a ação');
            // throw new Error('Erro ao registrar a ação');
          }

        //   const data = await response.json();
        //   console.log(data)
          console.log('Estado registrado com sucesso');

      };
    
    
      return (
        <div className={styles.page_container}>
          <div className={styles.form_container}>
            <h1 >Controle de Ações</h1>
              <label>
                <h2>Gaveta</h2> 
                <button onClick={() => handleGaveta()} className={styles.btn_edit}>
                        Abrir/Fechar
                        
                </button>
              </label>
              <label>
              <h2>Tampa</h2> 
                <button onClick={() => handleTampa()} className={styles.btn_edit}>
                        Abrir/Fechar
                </button>
              </label>
          </div>
        </div>
      );
  

}

export default direto;
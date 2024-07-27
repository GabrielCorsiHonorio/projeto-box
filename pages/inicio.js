import styles from '../styles/home.module.css';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { FaBars } from 'react-icons/fa';


const inicio = () => {
const [isUser, setIsUser] = useState(false);
const [sidebarOpen, setSidebarOpen] = useState(false);
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

  const user = localStorage.getItem('username');

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
          <button className={styles.nav_link} onClick={() => router.push('/controle')}>Controle</button>
          <button className={styles.nav_link} onClick={() => router.push('/metas')}>Metas</button>
          <button className={styles.nav_link} onClick={() => router.push('/direto')}>Direto</button>
          <button className={styles.nav_link} onClick={() => window.location.href = 'https://gch-a-paris.vercel.app'}>GCH à Paris</button>
          </div>
      <main className={styles.main_content}>
        <h1>Welcome, {user}</h1>
      </main>
    </div>
  );
}



export default inicio;

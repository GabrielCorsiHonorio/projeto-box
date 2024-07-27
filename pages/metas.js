import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import styles from '../styles/metas.module.css';
import { FaBars } from 'react-icons/fa';

const Posts = () => {
  const [isUser, setIsUser] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const router = useRouter();
  const [UsuAdmin, setUsuAdmin] = useState(false);

  useEffect(() => {
    console.log('useEffect triggered');
    const username = localStorage.getItem('username');
    const authenticated = localStorage.getItem('authenticated');

    console.log('Username from localStorage:', username);
    console.log('Authenticated from localStorage:', authenticated);


    if ( authenticated === 'true') {
      setIsUser(true);
      if (username && username === 'gabriel') {
        setUsuAdmin(true);
      }

    } else {
      router.push('/login');
    }
  }, [router]);
  

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  

  if (!isUser) {
    return <p>Loading...</p>;
  }

  const username = localStorage.getItem('username');

    return (
      <div className={styles.pageContainer}>
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
          <button className={styles.nav_link} onClick={() => router.push('/direto')}>Direto</button>
          <button className={styles.nav_link} onClick={() => window.location.href = 'https://gch-a-paris.vercel.app'}>GCH à Paris</button>
  </div>
      <main className={styles.main_content}>
        <h1>Nossas metas</h1>
      </main>
      </div>
    );
  };
  
export default Posts;

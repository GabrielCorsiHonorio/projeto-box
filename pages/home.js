import styles from '../styles/home.module.css';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

const Home = () => {
const [isUser, setIsUser] = useState(false);
const router = useRouter();

useEffect(() => {
    console.log('useEffect triggered');
    const username = localStorage.getItem('username');
    const authenticated = localStorage.getItem('authenticated');

    console.log('Username from localStorage:', username);
    console.log('Authenticated from localStorage:', authenticated);


    if (username && username !== 'gabriel' && authenticated === 'true') {
      setIsUser(true);


    } else {
      router.push('/login');
    }
  }, [router]);

  if (!isUser) {
    return <p>Loading...</p>;
  }

  const user = localStorage.getItem('username');

  return (
    <div className={styles.page_container}>
      <header className={styles.header}>
        <nav className={styles.nav}>
          <button className={styles.nav_link} onClick={() => router.push('/comando')}>Comando</button>
          <button className={styles.nav_link} onClick={() => router.push('/livro')}>Livro</button>
          <button className={styles.nav_link} onClick={() => router.push('/posts')}>Post</button>
        </nav>
      </header>
      <main className={styles.main_content}>
        <h1>Welcome, {user}</h1>
      </main>
    </div>
  );
}



export default Home;

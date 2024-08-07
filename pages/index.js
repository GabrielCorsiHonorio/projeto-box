// function Home() {
//     return <div>Eu te amo Eshlyn</div>
// }

// export default Home

// pages/index.js
import { useRouter } from 'next/router';
import styles from '../styles/index.module.css';

const Home = () => {
  const router = useRouter();

  const handleLoginRedirect = () => {
    router.push('/login');
  };

  return (
    <div className={styles.container}>
      <div className={styles.background}>
        <img
          src="/images/praia.jpg"
          alt="Torre Eiffel"
          className={styles.backgroundImage}
        />
      </div>
      <div className={styles.content}>
        <h1 className={styles.title}>Projeto do Gabriel e da Eshlyn</h1>
        <button className={styles.startButton} onClick={handleLoginRedirect}>
          Começar
        </button>
      </div>
    </div>
  );
};

export default Home;




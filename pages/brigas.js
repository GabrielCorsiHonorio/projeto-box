import { useState, useEffect } from 'react';
import DatePicker from "react-datepicker";
import { useRouter } from 'next/router';
import "react-datepicker/dist/react-datepicker.css";
import moment from 'moment-timezone';
import styles from '../styles/controle.module.css';
import { FaBars } from 'react-icons/fa';


const Briga = () => {
    const [isUser, setIsUser] = useState(false);
    const [formData, setFormData] = useState({ tema: '', contexto: '', date: '', comentario: '' });
    const [brigaList, setBrigaList] = useState([]);
    const [editingId, setEditingId] = useState('');
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const router = useRouter();
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

    useEffect(() => {
        fetch('/api/brigas')
          .then(res => res.json())
          .then(data => setBrigaList(data));
      }, []);
  
  
    const handleChange = (e) => {
      const { name, value } = e.target;
      setFormData({ ...formData, [name]: value });
    };
  
    const handleDateChange = (date) => {
      setFormData({ ...formData, date });
    };
  
    const handleSubmit = async (e) => {
      e.preventDefault();
  
      if (!formData.tema || !formData.contexto) {
          alert("Tema e Contexto são obrigatórios");
          return;
        }
  
      const brigaData = {
          tema: formData.tema,
          contexto: formData.contexto ? formData.contexto : null,
          date: formData.date ? moment.tz(formData.date, 'America/Sao_Paulo').toISOString() : '',
          comentario: formData.comentario ? formData.comentario : null,
        };
  
      try {
      // let response;
      if (editingId) {
        await fetch('/api/brigas', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: editingId, ...brigaData })
        });
      } else {
        await fetch('/api/brigas', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(brigaData)
        });
      }
      // if (!response.ok) {
      //     const errorData = await response.json();
      //     throw new Error(errorData.error || 'Unknown error');
      //   }
      setFormData({ tema: '', contexto: '', date: '', comentario: '' });
      setEditingId(null);
      fetch('/api/brigas')
        .then(res => res.json())
        .then(data => setBrigaList(data));
      } catch (error) {
          console.error('Error submitting action:', error);
        }
    };
  
  const handleEdit = (briga) => {
      setFormData({
        tema: briga.acao || '',
        contexto: briga.ordem || '',
        date: formData.date ? moment.tz(formData.date, 'America/Sao_Paulo').toISOString() : '',
        nome: briga.nome || '',
      });
      setEditingId(briga.id);
    };
    const handleDelete = async (id) => {
      await fetch('/api/brigas', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id })
      });
      fetch('/api/brigas')
        .then(res => res.json())
        .then(data => setActionList(data));
    };
  
    function formatDate(date) {
      const d = new Date(date);
      const year = d.getFullYear();
      let month = `${d.getMonth() + 1}`;
      let day = `${d.getDate()}`;
    
      if (month.length < 2) month = `0${month}`;
      if (day.length < 2) day = `0${day}`;
    
      return [day, month, year].join('/');
    }
  
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
            <button className={styles.nav_link} onClick={() => router.push('/metas')}>Metas</button>
            <button className={styles.nav_link} onClick={() => router.push('/posts')}>Post</button>
            <button className={styles.nav_link} onClick={() => window.location.href = 'https://gch-a-paris.vercel.app'}>GCH à Paris</button>
    </div>
        <div className={styles.form_container}>
          <h1 >Formulario das Brigas</h1>
          <form onSubmit={handleSubmit} className={styles.action_form}>
          <label>
            Tema:
          <input type="text" name="tema" value={formData.tema} onChange={handleChange} className={styles.form_control} />
          </label>
          <label>
            Contexto:
          <input type="text" name="contexto" value={formData.contexto} onChange={handleChange} className={styles.form_control} />
          </label>
            <label>
              Data:
              <DatePicker
                selected={formData.date}
                onChange={handleDateChange}
                dateFormat="dd/MM/yyyy"
                isClearable
                placeholderText="Selecione a data"
                className="form-control"
              />
            </label>
          <label>
            comentario:
          <input type="text" name="comentario" value={formData.comentario} onChange={handleChange} className={styles.form_control} />
          </label>
            <button type="submit" className={styles.btn_submit}>
              {editingId ? 'Atualizar Briga' : 'Adicionar Briga'}
            </button>
          </form>
        </div>
        <div className={styles.table_container}>
          <h2>Lista de Brgas</h2>
          <table>
            <thead>
              <tr>
                <th>Tema</th>
                <th>Contexto</th>
                <th>Data</th>
                <th>comentario</th>
              </tr>
            </thead>
            <tbody>
              {brigaList.map((briga) => (
                <tr key={briga.id}>
                  <td>{briga.tema}</td>
                  <td>{briga.contexto}</td>
                  <td>{briga.date ? formatDate(briga.date) : ''}</td>
                  <td>{briga.comentario}</td>
                  <td>
                    <button onClick={() => handleEdit(briga)} className={styles.btn_edit}>
                      Editar
                    </button>
                    <button onClick={() => handleDelete(briga.id)} className={styles.btn_delete}>
                      Excluir
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };
  
  export default Briga;
  
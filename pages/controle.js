import { useState, useEffect } from 'react';
import DatePicker from "react-datepicker";
import { useRouter } from 'next/router';
import "react-datepicker/dist/react-datepicker.css";
import moment from 'moment-timezone';
import styles from '../styles/controle.module.css';

const Controle = () => {
  const [isUser, setIsUser] = useState(false);
  const [formData, setFormData] = useState({ acao: '', ordem: '', date: '', nome: '' });
  const [actionList, setActionList] = useState([]);
  const [editingId, setEditingId] = useState('');
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

  useEffect(() => {
    fetch('/api/actions')
      .then(res => res.json())
      .then(data => setActionList(data));
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

    if (!formData.acao) {
        alert("Ação é obrigatória");
        return;
      }
  
      if (!formData.ordem && !formData.date) {
        alert("Pelo menos uma ordem ou uma data deve ser fornecida");
        return;
      }

    const actionData = {
        acao: formData.acao,
        ordem: formData.ordem ? parseInt(formData.ordem) : null,
        date: formData.date ? moment.tz(formData.date, 'America/Sao_Paulo').toISOString() : '',
        nome: formData.nome ? formData.nome : null,
      };

    try {
    // let response;
    if (editingId) {
      await fetch('/api/actions', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: editingId, ...actionData })
      });
    } else {
      await fetch('/api/actions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(actionData)
      });
    }
    // if (!response.ok) {
    //     const errorData = await response.json();
    //     throw new Error(errorData.error || 'Unknown error');
    //   }
    setFormData({ acao: '', ordem: '', date: '', nome: '' });
    setEditingId(null);
    fetch('/api/actions')
      .then(res => res.json())
      .then(data => setActionList(data));
    } catch (error) {
        console.error('Error submitting action:', error);
      }
  };

const handleEdit = (action) => {
    setFormData({
      acao: action.acao || '',
      ordem: action.ordem !== undefined ? action.ordem.toString() : '',
      date: formData.date ? moment.tz(formData.date, 'America/Sao_Paulo').toISOString() : '',
      nome: action.nome || '',
    });
    setEditingId(action.id);
  };
  const handleDelete = async (id) => {
    await fetch('/api/actions', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id })
    });
    fetch('/api/actions')
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

  if (!isUser) {
    return <p>Loading...</p>;
  }


  return (
    <div className={styles.page_container}>
      <div className={styles.form_container}>
        <h1 >Controle de Ações</h1>
        <form onSubmit={handleSubmit} className={styles.action_form}>
          <label>
            Ação:
            <select
              type="text"
              name="acao"
              value={formData.acao}
              onChange={handleChange}
              required
              className="form-control"
            >
              <option value="">Selecione uma opção</option>
              <option value="A1">A1</option>
              <option value="A2">A2</option>
              <option value="A31">A31</option>
              <option value="A32">A32</option>
              <option value="A33">A33</option>
            </select>
          </label>
          <label>
            Ordem:
              <input type="number" name="ordem" value={formData.ordem} onChange={handleChange} className ={styles.form_control} />
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
          Nome:
        <input type="text" name="nome" value={formData.nome} onChange={handleChange} className={styles.form_control} />
        </label>
          <button type="submit" className={styles.btn_submit}>
            {editingId ? 'Atualizar Ação' : 'Adicionar Ação'}
          </button>
        </form>
      </div>
      <div className={styles.table_container}>
        <h2>Lista de Ações</h2>
        <table>
          <thead>
            <tr>
              <th>Ação</th>
              <th>Ordem</th>
              <th>Data</th>
              <th>Nome</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {actionList.map((action) => (
              <tr key={action.id}>
                <td>{action.acao}</td>
                <td>{action.ordem}</td>
                <td>{action.date ? formatDate(action.date) : ''}</td>
                <td>{action.nome}</td>
                <td>
                  <button onClick={() => handleEdit(action)} className={styles.btn_edit}>
                    Editar
                  </button>
                  <button onClick={() => handleDelete(action.id)} className={styles.btn_delete}>
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

export default Controle;

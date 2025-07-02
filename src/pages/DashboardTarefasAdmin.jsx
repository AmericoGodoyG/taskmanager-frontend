import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate, useLocation } from "react-router-dom";
import "../styles/DashboardAdmin.css";
import { FaChartPie, FaUsers, FaTasks, FaSignOutAlt } from 'react-icons/fa';

function DashboardTarefasAdmin() {
  const [tarefas, setTarefas] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const fetchTarefas = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/tarefas", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        setTarefas(res.data);
        setLoading(false);
      } catch (err) {
        console.error("Erro ao carregar tarefas", err);
        setLoading(false);
      }
    };

    fetchTarefas();
  }, []);

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/"); 
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/tarefas/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setTarefas(tarefas.filter((tarefa) => tarefa._id !== id));
    } catch (err) {
      console.error("Erro ao excluir tarefa", err);
    }
  };

  const handleEdit = (tarefaId) => {
    navigate(`/admin/editar-tarefa/${tarefaId}`);
  };

  return (
    <div className="admin-page">
      <aside className="sidebar">
        <nav>
          <ul>
            <li className="menu-title">Dashboard</li>
            <li>
              <Link to="/admin/geral" className={location.pathname === '/admin/geral' ? 'active' : ''}>
                <span><FaChartPie /> Geral</span>
              </Link>
            </li>
            <li>
              <Link to="/admin" className={location.pathname === '/admin' ? 'active' : ''}>
                <span><FaUsers /> Equipes</span>
              </Link>
            </li>
            <li>
              <Link to="/admin/tarefas" className={location.pathname === '/admin/tarefas' ? 'active' : ''}>
                <span><FaTasks /> Tarefas</span>
              </Link>
            </li>
          </ul>
          <ul className="sidebar-bottom">
            <li>
              <button onClick={logout} className="logout-button">
                <span><FaSignOutAlt /> Sair</span>
              </button>
            </li>
          </ul>
        </nav>
      </aside>

      <main className="dashboard-container">
        <h2 className="dashboard-title">Tarefas</h2>

        <div className="dashboard-actions">
          <Link to="/admin/criar-tarefa" className="btn-create">
            Criar nova tarefa
          </Link>
        </div>

        <div className="metrics">
          <div className="metric">
            <span className="metric-title">Número de Tarefas:</span>
            <span className="metric-value">{tarefas.length}</span>
          </div>
        </div>

        <div className="teams-list">
          {loading ? (
            <p>Carregando tarefas...</p>
          ) : tarefas.length === 0 ? (
            <p>Nenhuma tarefa encontrada.</p>
          ) : (
            tarefas.map((tarefa) => (
              <div key={tarefa._id} className="team-item">
                <h3>{tarefa.descricao}</h3>
                <p><strong>Entrega:</strong> {new Date(tarefa.dataEntrega).toLocaleDateString()}</p>
                <p><strong>Aluno:</strong> {tarefa.aluno?.nome}</p>
                <p><strong>Equipe:</strong> {tarefa.equipe?.nome}</p>
                <p><strong>Status:</strong> {tarefa.status}</p>

                <div className="actions">
                  <button className="btn-edit" onClick={() => handleEdit(tarefa._id)}>
                    Editar
                  </button>
                  <button className="btn-delete" onClick={() => handleDelete(tarefa._id)}>
                    Excluir
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </main>
    </div>
  );
}

export default DashboardTarefasAdmin;

import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link, useLocation } from "react-router-dom";
import "../styles/DashboardAdmin.css"; 
import { useNavigate } from "react-router-dom";
import { FaChartPie, FaUsers, FaTasks, FaSignOutAlt } from 'react-icons/fa';

function DashboardAdmin() {
  const [equipes, setEquipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [adminNome, setAdminNome] = useState("");
  const location = useLocation();

  useEffect(() => {
    const nomeSalvo = localStorage.getItem("nome");
      if (nomeSalvo) setAdminNome(nomeSalvo);
    const fetchEquipes = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/equipes", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        setEquipes(res.data);
        setLoading(false);
      } catch (err) {
        console.error("Erro ao carregar equipes", err);
        setLoading(false);
      }
    };

    fetchEquipes();
  }, []);

  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/equipes/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setEquipes(equipes.filter((equipe) => equipe._id !== id));
    } catch (err) {
      console.error("Erro ao excluir equipe", err);
    }
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
        {adminNome && <h3 className="boas-vindas">Bem-vindo(a), {adminNome}!</h3>}
        <h2 className="dashboard-title">Equipes</h2>

        <div className="dashboard-actions">
          <Link to="/admin/criar-equipe" className="btn-create">
            Criar nova equipe
          </Link>
        </div>

        <div className="metrics">
          <div className="metric">
            <span className="metric-title">Número de Equipes:</span>
            <span className="metric-value">{equipes.length}</span>
          </div>
        </div>

        <div className="teams-list">
          {loading ? (
            <p>Carregando equipes...</p>
          ) : (
            equipes.map((equipe) => (
              <div key={equipe._id} className="team-item">
                <h3>{equipe.nome}</h3>
                <div className="team-members">
                  <h4>Membros da Equipe:</h4>
                  <ul>
                    {equipe.membros && equipe.membros.map((membro) => (
                      <li key={membro._id}>{membro.nome}</li>
                    ))}
                  </ul>
                </div>
                <div className="actions">
                  <Link to={`/admin/equipe/${equipe._id}`} className="btn-edit">
                    Editar
                  </Link>
                  <button
                    className="btn-delete"
                    onClick={() => handleDelete(equipe._id)}
                  >
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

export default DashboardAdmin;

import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale
} from 'chart.js';
import { FaChartPie, FaUsers, FaTasks, FaSignOutAlt } from 'react-icons/fa';
import "../styles/DashboardGeral.css";
import "../styles/DashboardAdmin.css";

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale
);

function DashboardGeral() {
  const [equipes, setEquipes] = useState([]);
  const [tarefas, setTarefas] = useState([]);
  const [dadosGraficos, setDadosGraficos] = useState([]);
  const location = useLocation();

  useEffect(() => {
    buscarEquipes();
    buscarTarefas();
  }, []);

  useEffect(() => {
    if (equipes.length > 0 && tarefas.length > 0) {
      processarDadosGraficos();
    }
  }, [equipes, tarefas]);

  const navigate = useNavigate();
  
  const logout = () => {
    localStorage.removeItem("token");
    navigate("/"); 
  };

  const processarDadosGraficos = () => {
    const dadosPorEquipe = equipes.map(equipe => {
      const tarefasEquipe = tarefas.filter(tarefa => tarefa.equipe?._id === equipe._id);
      
      const pendentes = tarefasEquipe.filter(t => t.status === 'pendente').length;
      const emAndamento = tarefasEquipe.filter(t => t.status === 'em andamento').length;
      const concluidas = tarefasEquipe.filter(t => t.status === 'concluído').length;

      return {
        equipe: equipe.nome,
        dados: {
          labels: ['Pendentes', 'Em Andamento', 'Concluídas'],
          datasets: [{
            data: [pendentes, emAndamento, concluidas],
            backgroundColor: ['#f44336', '#ff9800', '#4caf50'],
            borderWidth: 1
          }]
        }
      };
    });

    setDadosGraficos(dadosPorEquipe);
  };

  const buscarEquipes = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/equipes", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setEquipes(res.data);
    } catch (err) {
      console.error("Erro ao buscar equipes:", err);
    }
  };

  const buscarTarefas = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/tarefas", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setTarefas(res.data);
    } catch (err) {
      console.error("Erro ao buscar tarefas:", err);
    }
  };

  const renderStatusIndicator = (status) => {
  let bgColor = '#ccc';

  switch (status) {
    case 'pendente':
      bgColor = '#f44336';
      break;
    case 'em andamento':
      bgColor = '#ff9800';
      break;
    case 'concluído':
      bgColor = '#4caf50';
      break;
    default:
      break;
  }

  return (
    <div className="status-indicator-bar" style={{ backgroundColor: bgColor }} />
  );
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

    <main className="dashboard-geral">
      <h2>Painel Geral</h2>

      <div className="cards-container">
        <div className="card cyan">
          <h3>Equipes Criadas</h3>
          <p>{equipes.length}</p>
        </div>
        <div className="card purple">
          <h3>Tarefas Criadas</h3>
          <p>{tarefas.length}</p>
        </div>
      </div>

      <div className="graficos-container" style={{ display: 'flex', flexWrap: 'wrap', gap: '20px', marginBottom: '20px' }}>
        {dadosGraficos.map((grafico, index) => (
          <div key={index} style={{ width: '300px', backgroundColor: 'white', padding: '15px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
            <h3 style={{ textAlign: 'center', marginBottom: '10px' }}>{grafico.equipe}</h3>
            <Pie 
              data={grafico.dados}
              options={{
                plugins: {
                  legend: {
                    position: 'bottom'
                  },
                  title: {
                    display: true,
                    text: 'Status das Tarefas'
                  }
                }
              }}
            />
          </div>
        ))}
      </div>

      <div className="lista-tarefas">
        <h3>Todas as Tarefas</h3>
        {tarefas.map((tarefa) => (
          <div className="tarefa-item" key={tarefa._id}>
            <p><strong>Descrição:</strong> {tarefa.descricao}</p>
            <p><strong>Entrega:</strong> {new Date(tarefa.dataEntrega).toLocaleDateString()}</p>
            <p><strong>Equipe:</strong> {tarefa.equipe?.nome}</p>
            <p>
              <strong>Status:</strong> {tarefa.status.charAt(0).toUpperCase() + tarefa.status.slice(1)}
            </p>
            {renderStatusIndicator(tarefa.status)}
          </div>
        ))}
      </div>
    </main>
  </div>
);

}

export default DashboardGeral;

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/TarefasAluno.css';

const TarefasAluno = () => {
  const [tarefas, setTarefas] = useState([]);
  const [mensagem, setMensagem] = useState('');
  const [tarefaSelecionada, setTarefaSelecionada] = useState(null);

  useEffect(() => {
    carregarTarefas();
  }, []);

  const carregarTarefas = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/tarefas/aluno');
      setTarefas(response.data);
    } catch (error) {
      setMensagem('Erro ao carregar tarefas');
    }
  };

  const iniciarTarefa = async (id) => {
    try {
      await axios.post(`http://localhost:5000/api/tarefas/${id}/iniciar`);
      carregarTarefas();
      setMensagem('Tarefa iniciada com sucesso');
    } catch (error) {
      setMensagem('Erro ao iniciar tarefa');
    }
  };

  const pausarTarefa = async (id) => {
    try {
      const response = await axios.post(`http://localhost:5000/api/tarefas/${id}/pausar`);
      carregarTarefas();
      
      if (response.data.tempoExcedido) {
        setMensagem('Atenção: O tempo estimado para esta tarefa foi excedido!');
      } else {
        setMensagem('Tarefa pausada com sucesso');
      }
    } catch (error) {
      setMensagem('Erro ao pausar tarefa');
    }
  };

  const finalizarTarefa = async (id) => {
    try {
      await axios.post(`http://localhost:5000/api/tarefas/${id}/finalizar`);
      carregarTarefas();
      setMensagem('Tarefa finalizada com sucesso');
    } catch (error) {
      setMensagem('Erro ao finalizar tarefa');
    }
  };

  const baixarPDF = async (tarefa) => {
    try {
      const response = await axios.get(`http://localhost:5000/api/tarefas/${tarefa._id}/pdf`, {
        responseType: 'blob'
      });
      
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `tarefa-${tarefa.titulo}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      setMensagem('Erro ao baixar PDF');
    }
  };

  const getUrgenciaClass = (urgencia) => {
    switch (urgencia) {
      case 'alta':
        return 'urgencia-alta';
      case 'media':
        return 'urgencia-media';
      case 'baixa':
        return 'urgencia-baixa';
      default:
        return '';
    }
  };

  return (
    <div className="tarefas-container">
      <h2>Minhas Tarefas</h2>
      {mensagem && <div className={`mensagem ${mensagem.includes('sucesso') ? 'sucesso' : mensagem.includes('Atenção') ? 'alerta' : 'erro'}`}>{mensagem}</div>}
      
      <div className="tarefas-lista">
        {tarefas.map((tarefa) => (
          <div key={tarefa._id} className={`tarefa-item ${getUrgenciaClass(tarefa.urgencia)} ${tarefa.tempoExcedido ? 'tempo-excedido' : ''}`}>
            <h3>{tarefa.titulo}</h3>
            <p><strong>Descrição:</strong> {tarefa.descricao}</p>
            <p><strong>Prazo:</strong> {new Date(tarefa.prazo).toLocaleDateString()}</p>
            <p><strong>Urgência:</strong> {tarefa.urgencia.charAt(0).toUpperCase() + tarefa.urgencia.slice(1)}</p>
            <p><strong>Status:</strong> {tarefa.status}</p>
            {tarefa.tempoEstimado && (
              <p><strong>Tempo Estimado:</strong> {tarefa.tempoEstimado} minutos</p>
            )}
            {tarefa.tempoGasto > 0 && (
              <p className={tarefa.tempoExcedido ? 'tempo-excedido-texto' : ''}>
                <strong>Tempo Gasto:</strong> {tarefa.tempoGasto} minutos
                {tarefa.tempoExcedido && ' (Tempo excedido!)'}
              </p>
            )}
            
            <div className="buttons">
              {tarefa.status === 'pendente' && (
                <button onClick={() => iniciarTarefa(tarefa._id)} className="iniciar-btn">
                  Iniciar
                </button>
              )}
              {tarefa.status === 'em_andamento' && (
                <>
                  <button onClick={() => pausarTarefa(tarefa._id)} className="pausar-btn">
                    Pausar
                  </button>
                  <button onClick={() => finalizarTarefa(tarefa._id)} className="finalizar-btn">
                    Finalizar
                  </button>
                </>
              )}
              <button onClick={() => baixarPDF(tarefa)} className="pdf-btn">
                Baixar PDF
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TarefasAluno; 
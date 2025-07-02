import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import "../styles/Login.css";
import { FaUser, FaEnvelope, FaLock, FaUserGraduate, FaUserPlus } from 'react-icons/fa';

function Register() {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [tipo, setTipo] = useState("aluno");
  const [erro, setErro] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.post("http://localhost:5000/api/auth/registrar", {
        nome,
        email,
        senha,
        tipo,
      });

      navigate("/");
    } catch (err) {
      setErro(err.response?.data?.erro || "Erro ao cadastrar");
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h2>Criar nova conta</h2>
          <p>Preencha os dados para se cadastrar</p>
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
          {erro && <div className="erro-container">{erro}</div>}

          <div className="input-group">
            <div className="input-icon">
              <FaUser />
            </div>
            <input
              type="text"
              placeholder="Seu nome completo"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              required
            />
          </div>

          <div className="input-group">
            <div className="input-icon">
              <FaEnvelope />
            </div>
            <input
              type="email"
              placeholder="Seu melhor email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="input-group">
            <div className="input-icon">
              <FaLock />
            </div>
            <input
              type="password"
              placeholder="Escolha uma senha segura"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              required
            />
          </div>

          <div className="input-group">
            <div className="input-icon">
              <FaUserGraduate />
            </div>
            <select
              value={tipo}
              onChange={(e) => setTipo(e.target.value)}
              className="select-tipo"
            >
              <option value="aluno">Aluno</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          <button type="submit">
            <FaUserPlus /> Criar conta
          </button>

          <div className="auth-footer">
            <p>
              Já tem uma conta? <Link to="/">Faça login</Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Register;

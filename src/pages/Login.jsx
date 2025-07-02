import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { FaEnvelope, FaLock, FaSignInAlt } from 'react-icons/fa';

function Login() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post("http://localhost:5000/api/auth/login", {
        email,
        senha,
      });

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("tipo", res.data.user.tipo);
      localStorage.setItem("nome", res.data.user.nome);

      if (res.data.user.tipo === "admin") {
        window.location.href = "/admin";
      } else {
        window.location.href = "/aluno";
      }

    } catch (err) {
      setErro(err.response?.data?.erro || "Erro ao fazer login");
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h2>Bem-vindo(a) de volta!</h2>
          <p>Faça login para acessar sua conta</p>
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
          {erro && <div className="erro-container">{erro}</div>}

          <div className="input-group">
            <div className="input-icon">
              <FaEnvelope />
            </div>
            <input
              type="email"
              placeholder="Seu email"
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
              placeholder="Sua senha"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              required
            />
          </div>

          <button type="submit">
            <FaSignInAlt /> Entrar
          </button>

          <div className="auth-footer">
            <p>
              Não tem uma conta? <Link to="/register">Cadastre-se</Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Login;

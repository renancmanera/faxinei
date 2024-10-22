import { useState } from 'react';
import './signin.css';
import { Link, useNavigate } from 'react-router-dom';

export default function SignIn() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();  // Para redirecionamento

  function logar(e) {
    e.preventDefault();
    
    if (email !== '' && password !== '') {
      // Aqui você pode adicionar a lógica de login com autenticação se necessário

      // Exemplo de redirecionamento após login bem-sucedido
      navigate('');  // Redireciona para a página de dashboard
    } else {
      alert('Preencha todos os campos!');
    }
  }

  return (
    <div className="container-center">
      <div className="login">
        <div className="login-area">
        </div>

        <form onSubmit={logar}>
          <h1>Bem-vindo (a)</h1>
          <input 
            type="text" 
            placeholder="usuario@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input 
            type="password" 
            placeholder="********"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button type="submit" className="botaoLogin">
            Entrar
          </button>
        </form>

        <Link to="/cadastrar">Não possui uma conta? Cadastre-se</Link>
      </div>
    </div>
  );
}

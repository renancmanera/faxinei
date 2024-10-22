import { useState } from 'react';

import { Link, useNavigate } from 'react-router-dom';
//import { toast } from 'react-toastify';

//import { collection, getDocs, query, where } from "firebase/firestore";
//import { db } from "../../services/firebaseConnection";

export default function SignUp() {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const navigate = useNavigate();  // Para redirecionar após o cadastro

  async function cadastrar(e) {
    e.preventDefault();
    
    // Verificar se todos os campos foram preenchidos
    if (nome === '' || email === '' || senha === '') {
      alert('Preencha todos os campos.');
      return;
    }
    
    // Verificar o comprimento da senha
    if (senha.length < 6) {
      alert('A senha deve ter pelo menos 6 caracteres.');
      return;
    }
    
    // Verificar se o email já existe na coleção "usuarios"
    //const usuariosRef = collection(db, 'usuarios');
    //const q = query(usuariosRef, where('email', '==', email));
    
    
  }

  return (
    <div className="container-center">
      <div className="login">
        <div className="login-area">

        </div>

        <form onSubmit={cadastrar}>
          <h1>Cadastre-se</h1>
          
          <input 
            type="text" 
            placeholder="Seu nome"
            value={nome}
            onChange={ (e) => setNome(e.target.value) }
          />
          
          <input 
            type="text" 
            placeholder="usuario@email.com"
            value={email}
            onChange={ (e) => setEmail(e.target.value) }
          />

          <input 
            type="password" 
            placeholder="********"
            value={senha}
            onChange={ (e) => setSenha(e.target.value) }
          />

          <button type="submit" className='botaoLogin'>
            Cadastrar
          </button>
        </form>

        <Link to="/">Já possui uma conta? Faça login</Link>

      </div>
    </div>
  );
}

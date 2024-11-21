import { useState, useContext } from 'react'
import './signin.css'

import logo from '../../assets/logo.png'
import { Link } from 'react-router-dom'
import { AuthContext } from '../../contexts/auth'
import {toast} from 'react-toastify'

export default function SignIn(){
  const [email, setEmail] = useState('');
  const [password, setSenha] = useState('');
  const { signIn } = useContext(AuthContext);
  const { loadingAuth } = useContext(AuthContext);

  function logar(e){
    e.preventDefault();
    
    if(email !== '' && password !== ''){
      signIn(email, password);
    }else{
      toast.info('Preencha todos os campos.');
    }
  }

  return(
    <div className="container-center">
      <div className="login">
        <div className="login-area">
          <img src={logo} alt="Logo do sistema de chamados" />
        </div>

        <form onSubmit={logar}>
          <h1>Bem-vindo (a)</h1>
          <input 
            type="text" 
            placeholder="usuario@email.com"
            value={email}
            onChange={ (e) => setEmail(e.target.value) }
          />

          <input 
            type="password" 
            placeholder="********"
            value={password}
            onChange={ (e) => setSenha(e.target.value) }
          />

        <button type="submit" className='botaoLogin'>
            Entrar
          </button>
        </form>

        <Link to="/cadastrar">Não possui uma conta? <span className='cadastre-se'>Cadastre-se</span></Link>

      </div>
    </div>
  )
}
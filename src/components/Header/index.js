import { useContext } from 'react';
import avatarImg from '../../assets/avatar.png';
import { Link, useLocation } from 'react-router-dom';

import { AuthContext } from '../../contexts/auth';
import { FiMessageSquare, FiUser, FiSettings, FiLogOut, FiHome } from 'react-icons/fi';
import './header.css';

export default function Header() {
    const { user, logout } = useContext(AuthContext);
    const location = useLocation();

    return (
        <div className="sidebar">
            <div>
                <img src={user.avatarUrl === null ? avatarImg : user.avatarUrl} alt="Foto do usuário" />
            </div>

            <Link
                to="/home"
                className={location.pathname === '/home' ? 'active' : ''} // Classe 'active' para a rota ativa
            >
                <FiHome color="#FFF" size={24} />
                <span>Home</span>
            </Link>

            <Link
                to="/agendamentos"
                className={location.pathname === '/agendamentos' ? 'active' : ''} // Aplica classe se estiver na rota
            >
                <FiUser color="#FFF" size={24} />
                <span>Agendamentos</span>
            </Link>

            <Link
                to="/perfil"
                className={location.pathname === '/perfil' ? 'active' : ''} // Aplica classe se estiver na rota
            >
                <FiSettings color="#FFF" size={24} />
                <span>Perfil</span>
            </Link>

            <Link to="/" onClick={logout}>
                <FiLogOut color="#FFF" size={24} />
                <span>Sair</span>
            </Link>
        </div>
    );
}

import { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../contexts/auth';

export default function Private({ children }) {
    const { signed } = useContext(AuthContext);

    if (!signed) {
        console.log("Redirecionando para a página de login...");
        return <Navigate to="/" />;
    }

    return children;
}

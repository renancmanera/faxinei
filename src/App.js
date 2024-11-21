import { BrowserRouter } from "react-router-dom";
import RoutesApp from "./routes";
import AuthProvider, { AuthContext } from "./contexts/auth";
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { useContext } from "react";

function App() {
    const { loading } = useContext(AuthContext);

    if (loading) {
        // Enquanto o estado de autenticação está carregando, exibe um placeholder
        return <div>Carregando aplicação...</div>;
    }

    return (
        <BrowserRouter>
            <AuthProvider>
                <ToastContainer autoClose={3000} />
                <RoutesApp />
            </AuthProvider>
        </BrowserRouter>
    );
}

export default App;

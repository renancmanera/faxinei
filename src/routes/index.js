import { Routes, Route } from "react-router-dom";

import SignIn from "../pages/SignIn";
import SignUp from "../pages/SignUp";
import Home from "../pages/Home";
import Agendamento from "../pages/Agendamento";
import Private from "./Private";
import Profile from "../pages/Profile";

function RoutesApp() {
  return (
  
    <Routes>
      <Route path="/" element={<SignIn />} />
      <Route path="/faxinei" element={<SignIn />} />
      <Route path="/cadastrar" element={<SignUp />} />
      <Route path="/home" element={<Private><Home /></Private>} />
      <Route path="/perfil" element={<Profile />} />
      <Route path="/agendamentos" element={<Private><Agendamento/></Private>} />
      <Route path="*" element={<h1>Página não encontrada.</h1>} />
    </Routes>
    
  );
}

export default RoutesApp;

import { useEffect, useState, useContext } from "react";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../../services/FirebaseConnection";
import Header from "../../components/Header";
import { AuthContext } from "../../contexts/auth";
import { toast } from "react-toastify";
import Title from "../../components/Title";
import { FiUser } from "react-icons/fi";

import "./agendamento.css";

export default function Agendamento() {
    const { user } = useContext(AuthContext);
    const [agendamentos, setAgendamentos] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchAgendamentos() {
            if (!user) return;

            try {
                const userRef = doc(db, "usuarios", user.uid);
                const userSnapshot = await getDoc(userRef);

                if (userSnapshot.exists()) {
                    const data = userSnapshot.data();
                    if (data.agendamentos) {
                        setAgendamentos(data.agendamentos);
                    }
                }
            } catch (error) {
                console.error("Erro ao buscar agendamentos:", error);
            } finally {
                setLoading(false);
            }
        }

        fetchAgendamentos();
    }, [user]);

    const handleDelete = async (agendamento) => {
        try {
            // Remover agendamento do contratante
            const contratanteRef = doc(db, "usuarios", agendamento.contratanteId);
            const contratanteSnapshot = await getDoc(contratanteRef);
            if (contratanteSnapshot.exists()) {
                const contratanteData = contratanteSnapshot.data();
                const updatedAgendamentos = contratanteData.agendamentos.filter(
                    (item) =>
                        item.data !== agendamento.data ||
                        item.horario !== agendamento.horario
                );
                await updateDoc(contratanteRef, { agendamentos: updatedAgendamentos });
            }

            // Remover agendamento da faxineira
            const faxineiraRef = doc(db, "usuarios", agendamento.faxineiraId);
            const faxineiraSnapshot = await getDoc(faxineiraRef);
            if (faxineiraSnapshot.exists()) {
                const faxineiraData = faxineiraSnapshot.data();
                const updatedAgendamentos = faxineiraData.agendamentos.filter(
                    (item) =>
                        item.data !== agendamento.data ||
                        item.horario !== agendamento.horario
                );
                await updateDoc(faxineiraRef, { agendamentos: updatedAgendamentos });
            }

            // Atualiza localmente os agendamentos
            setAgendamentos((prev) =>
                prev.filter(
                    (item) =>
                        item.data !== agendamento.data || item.horario !== agendamento.horario
                )
            );

            toast.success("Agendamento excluído com sucesso!");
        } catch (error) {
            console.error("Erro ao excluir agendamento:", error);
            toast.error("Erro ao excluir o agendamento. Tente novamente.");
        }
    };

    return (
        <div>
            <Header />
                <div className="content">
                    <Title nome="Meus agendamentos">
                        <FiUser size={25} />
                    </Title>
            <div className="container">
                {loading ? (
                    <div className="loading">Carregando...</div>
                ) : agendamentos.length === 0 ? (
                    <div className="empty">Você não possui agendamentos</div>
                ) : (
                    <div className="agendamento-list">
                        {agendamentos.map((agendamento, index) => (
                            <div className="agendamento-card" key={index}>
                                <h2>
                                    {user.objetivo === "1"
                                        ? `Faxineiro(a): ${agendamento.faxineiraNome}`
                                        : `Cliente: ${agendamento.contratanteNome}`}
                                </h2>
                                <p><strong>Data:</strong> {agendamento.data}</p>
                                <p><strong>Horário:</strong> {agendamento.horario}</p>
                                <button
                                    className="btn-excluir"
                                    onClick={() => handleDelete(agendamento)}
                                >
                                    Excluir
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div> </div>
        </div>
    );
}

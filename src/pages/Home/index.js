import { useEffect, useState, useContext } from "react";
import { collection, getDocs, doc, updateDoc, getDoc } from "firebase/firestore";
import { db } from "../../services/FirebaseConnection";
import Header from "../../components/Header";
import Title from "../../components/Title";
import { FiHome } from "react-icons/fi";
import { AuthContext } from "../../contexts/auth";
import { toast } from "react-toastify";

import "../Home/home.css";

export default function Home() {
    const { user, setUser, storageUser } = useContext(AuthContext);
    const [faxineiras, setFaxineiras] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedFaxineira, setSelectedFaxineira] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [selectedDate, setSelectedDate] = useState("");
    const [selectedTime, setSelectedTime] = useState("");

    useEffect(() => {
        async function fetchFaxineiras() {
            try {
                const querySnapshot = await getDocs(collection(db, "usuarios"));
                const listaFaxineiras = [];

                querySnapshot.forEach((doc) => {
                    const data = doc.data();
                    // Apenas faxineiras disponíveis
                    if (data.objetivo === "2" && data.disponivel) {
                        listaFaxineiras.push({
                            id: doc.id,
                            nome: `${data.nome} ${data.sobrenome}`,
                            servicos: data.servicos,
                            avatarUrl: data.avatarUrl || "",
                            telefone: data.telefone || "Não informado",
                        });
                    }
                });

                setFaxineiras(listaFaxineiras);
            } catch (error) {
                console.error("Erro ao buscar faxineiras:", error);
            } finally {
                setLoading(false);
            }
        }

        fetchFaxineiras();
    }, []);

    const openModal = (faxineira) => {
        setSelectedFaxineira(faxineira);
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        setSelectedDate("");
        setSelectedTime("");
    };

    const handleSchedule = async () => {
        if (!selectedDate || !selectedTime) {
            toast.error("Por favor, selecione uma data e horário.");
            return;
        }

        try {
            const agendamento = {
                data: selectedDate,
                horario: selectedTime,
                faxineiraId: selectedFaxineira.id,
                faxineiraNome: selectedFaxineira.nome,
                contratanteId: user.uid,
                contratanteNome: `${user.nome} ${user.sobrenome}`,
            };

            // Atualiza o documento do contratante
            const contratanteRef = doc(db, "usuarios", user.uid);
            const contratanteSnapshot = await getDoc(contratanteRef);

            const agendamentosAtualizadosContratante =
                contratanteSnapshot.exists() && contratanteSnapshot.data().agendamentos
                    ? [...contratanteSnapshot.data().agendamentos, agendamento]
                    : [agendamento];

            await updateDoc(contratanteRef, {
                agendamentos: agendamentosAtualizadosContratante,
            });

            // Atualiza o documento da faxineira
            const faxineiraRef = doc(db, "usuarios", selectedFaxineira.id);
            const faxineiraSnapshot = await getDoc(faxineiraRef);

            const agendamentosAtualizadosFaxineira =
                faxineiraSnapshot.exists() && faxineiraSnapshot.data().agendamentos
                    ? [...faxineiraSnapshot.data().agendamentos, agendamento]
                    : [agendamento];

            await updateDoc(faxineiraRef, {
                agendamentos: agendamentosAtualizadosFaxineira,
            });

            // Atualiza o estado do contratante localmente
            const updatedUser = {
                ...user,
                agendamentos: agendamentosAtualizadosContratante,
            };

            setUser(updatedUser);
            storageUser(updatedUser);

            toast.success("Agendamento realizado com sucesso!");
            closeModal();
        } catch (error) {
            console.error("Erro ao salvar agendamento:", error);
            toast.error("Erro ao salvar agendamento. Tente novamente.");
        }
    };

    return (
        <div>
            <Header />
            <div className="content">
                <Title nome="Meu perfil">
                    <FiHome size={25} />
                </Title>

                <div className="container">
                    {loading ? (
                        <div className="loading">Carregando...</div>
                    ) : faxineiras.length === 0 ? (
                        <div className="empty">Nenhuma faxineira disponível no momento.</div>
                    ) : (
                        <div className="cards-container">
                            {faxineiras.map((faxineira) => (
                                <div className="card" key={faxineira.id}>
                                    <img
                                        src={faxineira.avatarUrl || "/default-avatar.png"}
                                        alt={faxineira.nome}
                                        className="avatar"
                                    />
                                    <div className="info">
                                        <h2>{faxineira.nome}</h2>
                                        <p><strong>Serviços:</strong> {faxineira.servicos}</p>
                                        <p><strong>Contato:</strong> {faxineira.telefone}</p>
                                    </div>
                                    {user.objetivo === "1" && (
                                        <button
                                            className="btn-agendar"
                                            onClick={() => openModal(faxineira)}
                                         >
                                            Agendar Faxina
                                        </button>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
            </div></div>

            {showModal && (
                <div className="modal-overlay">
                    <div className="modal">
                        <h2>Agendar Faxina com {selectedFaxineira.nome}</h2>
                        <label>
                            Data:
                            <input
                                type="date"
                                value={selectedDate}
                                onChange={(e) => setSelectedDate(e.target.value)}
                            />
                        </label>
                        <label>
                            Horário:
                            <input
                                type="time"
                                value={selectedTime}
                                onChange={(e) => setSelectedTime(e.target.value)}
                            />
                        </label>
                        <div className="modal-actions">
                            <button className="btn-cancelar" onClick={closeModal}>
                                Cancelar
                            </button>
                            <button className="btn-confirmar" onClick={handleSchedule}>
                                Confirmar
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

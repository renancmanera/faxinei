import { useContext, useState, useEffect } from "react";
import Header from "../../components/Header";
import Title from "../../components/Title";
import { FiSettings, FiUpload } from "react-icons/fi";
import avatar from '../../assets/avatar.png';
import { AuthContext } from "../../contexts/auth";
import { doc, updateDoc } from 'firebase/firestore';
import { db, storage } from '../../services/FirebaseConnection';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import './profile.css';
import { toast } from 'react-toastify';

export default function Profile() {
    const { user, setUser, storageUser } = useContext(AuthContext);

    const [avatarUrl, setAvatarUrl] = useState(user && user.avatarUrl);
    const [imagemAvatar, setImagemAvatar] = useState(null);
    const [nome, setNome] = useState(user && user.nome);
    const [sobrenome, setSobrenome] = useState(user && user.sobrenome);
    const [email, setEmail] = useState(user && user.email);
    const [cpf, setCpf] = useState(user && user.cpf);
    const [telefone, setTelefone] = useState(user && user.telefone);
    const [dataNascimento, setDataNascimento] = useState(user && user.dataNascimento);
    const [genero, setGenero] = useState(user && user.genero || ""); // Começa vazio
    const [disponivel, setDisponivel] = useState(user && user.disponivel || false);

    const [endereco, setEndereco] = useState(user && user.endereco || "");
    const [estado, setEstado] = useState(user && user.estado || "");
    const [sobreDomicilio, setSobreDomicilio] = useState(user && user.sobreDomicilio || "");
    const [servicos, setServicos] = useState(user && user.servicos || "");

    useEffect(() => {
        if (user && user.genero) {
            setGenero(user.genero);
        }
        if (user && typeof user.disponivel !== "undefined") {
            setDisponivel(user.disponivel);
        }
    }, [user]);

    function mudarFoto(e) {
        if (e.target.files[0]) {
            const image = e.target.files[0];
            if (image.type === 'image/jpeg' || image.type === 'image/png') {
                setImagemAvatar(image);
                setAvatarUrl(URL.createObjectURL(image));
            } else {
                toast.error("Envie uma imagem do tipo PNG ou JPEG");
                setImagemAvatar(null);
            }
        }
    }

    async function uploadFoto() {
        const currentUid = user.uid;
        const uploadRef = ref(storage, `imagens/${currentUid}/${imagemAvatar.name}`);

        await uploadBytes(uploadRef, imagemAvatar)
            .then((snapshot) => {
                getDownloadURL(snapshot.ref).then(async (downloadURL) => {
                    await atualizarDados({ avatarUrl: downloadURL });
                });
            });
    }

    async function atualizarDados(atualizacoes) {
        const docRef = doc(db, "usuarios", user.uid);
        await updateDoc(docRef, atualizacoes)
            .then(() => {
                const updatedUser = { ...user, ...atualizacoes };
                setUser(updatedUser);
                storageUser(updatedUser);
                toast.success("Atualizado com sucesso!");
            })
            .catch((error) => {
                console.error("Erro ao atualizar dados:", error);
                toast.error("Erro ao atualizar dados.");
            });
    }

    async function salvar(e) {
        e.preventDefault();

        if (!genero) {
            toast.error("Por favor, selecione um gênero antes de salvar.");
            return;
        }

        const atualizacoes = {
            nome,
            sobrenome,
            cpf,
            telefone,
            dataNascimento,
            genero,
            ...(user.objetivo === "1" && {
                endereco,
                estado,
                sobreDomicilio,
            }),
            ...(user.objetivo === "2" && {
                servicos,
            }),
        };

        if (imagemAvatar === null) {
            await atualizarDados(atualizacoes);
        } else if (nome !== '') {
            uploadFoto();
        }
    }

    async function alternarDisponibilidade() {
        const novaDisponibilidade = !disponivel;
        setDisponivel(novaDisponibilidade);
        await atualizarDados({ disponivel: novaDisponibilidade });
    }

    return (
        <div>
            <Header />
            <div className="content">
                <Title nome="Meu perfil">
                    <FiSettings size={25} />
                </Title>

                <div className="container">
                    <form className="form-profile" onSubmit={salvar}>
                        <label className="label-avatar">
                            <span>
                                <FiUpload color="#FFF" size={25} />
                            </span>
                            <input type="file" accept="image/*" onChange={mudarFoto} className="foto" /> <br />
                            {avatarUrl === null ? (
                                <img src={avatar} alt="Foto de perfil" width={250} height={250} />
                            ) : (
                                <img src={avatarUrl} alt="Foto de perfil" width={250} height={250} />
                            )}
                        </label>

                        <div className="profile-fields">
                            <div className="field">
                                <label>Nome</label>
                                <input type="text" value={nome} onChange={(e) => setNome(e.target.value)} />
                            </div>

                            <div className="field">
                                <label>Sobrenome</label>
                                <input type="text" value={sobrenome} onChange={(e) => setSobrenome(e.target.value)} />
                            </div>

                            <div className="field">
                                <label>Email</label>
                                <input type="text" value={email} disabled />
                            </div>

                            <div className="field">
                                <label>CPF</label>
                                <input type="text" value={cpf} onChange={(e) => setCpf(e.target.value)} />
                            </div>

                            <div className="field">
                                <label>Telefone</label>
                                <input type="text" value={telefone} onChange={(e) => setTelefone(e.target.value)} />
                            </div>

                            <div className="field">
                                <label>Data de Nascimento</label>
                                <input type="date" value={dataNascimento} onChange={(e) => setDataNascimento(e.target.value)} />
                            </div>

                            <div className="field">
                                <label>Gênero</label>
                                <select value={genero} onChange={(e) => setGenero(e.target.value)}>
                                    <option value="" disabled>
                                        Selecione
                                    </option>
                                    <option value="Masculino">Masculino</option>
                                    <option value="Feminino">Feminino</option>
                                </select>
                            </div>

                            {user.objetivo === "1" && (
                                <>
                                    <div className="field">
                                        <label>Endereço</label>
                                        <input type="text" value={endereco} onChange={(e) => setEndereco(e.target.value)} />
                                    </div>

                                    <div className="field">
                                        <label>Estado</label>
                                        <input type="text" value={estado} onChange={(e) => setEstado(e.target.value)} />
                                    </div>

                                    <div className="field">
                                        <label>Sobre o seu domicílio</label>
                                        <textarea value={sobreDomicilio} onChange={(e) => setSobreDomicilio(e.target.value)} />
                                    </div>
                                </>
                            )}

                            {user.objetivo === "2" && (
                                <>
                                    <div className="field">
                                        <label>Serviços</label>
                                        <textarea value={servicos} onChange={(e) => setServicos(e.target.value)} />
                                    </div>
                                    <button
                                        type="button"
                                        className={`btn-disponibilidade ${disponivel ? "disponivel" : "indisponivel"}`}
                                        onClick={alternarDisponibilidade}
                                    >
                                        {disponivel ? "Disponível" : "Indisponível"}
                                    </button>
                                </>
                            )}
                        </div>

                        <button className="botaoPerfil" type="submit">Atualizar</button>
                    </form>
                </div>
            </div>
        </div>
    );
}

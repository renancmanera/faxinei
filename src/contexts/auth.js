import { useState, createContext, useEffect } from 'react';
import { auth, db } from '../services/FirebaseConnection';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

export const AuthContext = createContext({});

function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loadingAuth, setLoadingAuth] = useState(false);
    const [loading, setLoading] = useState(true);

    const navigate = useNavigate();

    useEffect(() => {
        async function loadUser() {
            const storageUser = localStorage.getItem('@sistema');
    
            if (storageUser) {
                setUser(JSON.parse(storageUser));
            }
            setLoading(false); // Define o loading para false apenas após verificar `localStorage`
        }
    
        loadUser();
    }, []);
    
    

    async function signIn(email, senha) {
        setLoadingAuth(true);

        await signInWithEmailAndPassword(auth, email, senha)
            .then(async (value) => {
                let uid = value.user.uid;

                const docRef = doc(db, 'usuarios', uid);
                const docSnap = await getDoc(docRef);

                let data = {
                    uid: uid,
                    nome: docSnap.data().nome,
                    sobrenome: docSnap.data().sobrenome,  // Adiciona o sobrenome
                    objetivo: docSnap.data().objetivo,    // Adiciona o objetivo
                    avatarUrl: docSnap.data().avatarUrl,
                    cpf: docSnap.data().cpf,
                    telefone: docSnap.data().telefone,
                    dataNascimento: docSnap.data().dataNascimento,
                    genero: docSnap.data().genero,
                    email: value.user.email,
                };

                setUser(data);
                storageUser(data);
                setLoadingAuth(false);
                toast.success('Bem-vindo de volta!');
                navigate('/perfil');
            })
            .catch((error) => {
                console.log(error);
                toast.error('Usuário inválido.');
                setLoadingAuth(false);
            });
    }

    // cadastrar novo usuario
    async function signUp(nome, sobrenome, email, senha, objetivo) { // Adiciona sobrenome e objetivo
        setLoadingAuth(true);

        await createUserWithEmailAndPassword(auth, email, senha)
            .then(async (value) => {
                let uid = value.user.uid;

                await setDoc(doc(db, 'usuarios', uid), {
                    nome: nome,
                    sobrenome: sobrenome,     // Armazena o sobrenome no Firestore
                    objetivo: objetivo,       // Armazena o objetivo no Firestore
                    avatarUrl: null,
                    cpf: '',
                    telefone: '',
                    dataNascimento: '',
                    genero: '',
                    email: email,
                })
                    .then(() => {
                        let data = {
                            uid: uid,
                            nome: nome,
                            sobrenome: sobrenome, // Inclui o sobrenome nos dados locais
                            objetivo: objetivo,   // Inclui o objetivo nos dados locais
                            email: email,
                            avatarUrl: null,
                            cpf: '',
                            telefone: '',
                            dataNascimento: '',
                            genero: '',
                        };

                        setUser(data);
                        storageUser(data);
                        setLoadingAuth(false);
                        navigate('/perfil');
                    })
                    .catch((error) => {
                        console.log(error);
                        toast.error('Erro ao criar usuário.');
                        setLoadingAuth(false);
                    });
            })
            .catch((error) => {
                console.log(error);
                toast.error('Usuário inválido.');
                setLoadingAuth(false);
            });
    }

    function storageUser(data) {
        localStorage.setItem('@sistema', JSON.stringify(data));
    }

    async function logout() {
        await signOut(auth);
        localStorage.removeItem('@sistema');
        setUser(null);
    }

    return (
        <AuthContext.Provider
            value={{
                signed: !!user, // falso se o user for nulo
                user,
                signIn,
                signUp,
                logout,
                loadingAuth,
                loading,
                storageUser,
                setUser,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export default AuthProvider;

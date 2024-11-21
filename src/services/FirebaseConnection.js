import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
    apiKey: "AIzaSyBpah4E0wmsWzzQ9mYaqibGZcoUzr5wG8s",
    authDomain: "faxinei-8206d.firebaseapp.com",
    projectId: "faxinei-8206d",
    storageBucket: "faxinei-8206d.appspot.com",
    messagingSenderId: "653543986614",
    appId: "1:653543986614:web:3f848abe9e58fa37669d17",
    measurementId: "G-BQYX5C0DS7"
};

const firebaseApp = initializeApp(firebaseConfig);

const auth = getAuth(firebaseApp);
const db = getFirestore(firebaseApp);
const storage = getStorage(firebaseApp);

export { auth, db, storage };
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Aqui você colará a chave que o Firebase vai te dar no site deles
const firebaseConfig = {
  apiKey: "AIzaSyDFXGZ0psOOwSx4dGMfbQ4C53l-LMbFhN8",
  authDomain: "lista-casa-nova-bd.firebaseapp.com",
  projectId: "lista-casa-nova-bd",
  storageBucket: "lista-casa-nova-bd.firebasestorage.app",
  messagingSenderId: "321625966061",
  appId: "1:321625966061:web:b89103d376f304a8c3d3e4"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };
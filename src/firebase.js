import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Aqui você colará a chave que o Firebase vai te dar no site deles
const firebaseConfig = {
  apiKey: "SUA_API_KEY",
  authDomain: "seu-projeto.firebaseapp.com",
  projectId: "seu-projeto",
  storageBucket: "seu-projeto.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdefg"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };
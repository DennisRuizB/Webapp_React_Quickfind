import { initializeApp } from 'firebase/app';
import { getMessaging } from 'firebase/messaging';
import { getFirestore } from 'firebase/firestore'; // Añade esta línea

const firebaseConfig = {
    apiKey: "AIzaSyCk_QrhGojGOQ_PXgSW5Sw0VO3hN_RBQbo",
    authDomain: "fq-ea-dennis.firebaseapp.com",
    projectId: "fq-ea-dennis",
    storageBucket: "fq-ea-dennis.firebasestorage.app",
    messagingSenderId: "355189445983",
    appId: "1:355189445983:web:5a0c4e2062fb99fbded2ea",
};

// Inicializa Firebase
const app = initializeApp(firebaseConfig);

// Inicializa Firebase Messaging y exporta
export const messaging = getMessaging(app);

// Inicializa Firestore y exporta
export const db = getFirestore(app);
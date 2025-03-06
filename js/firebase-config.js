import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import { getDatabase } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-database.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js";

// Configuración de Firebase
const firebaseConfig = {
    apiKey: "AIzaSyBifprRYGKFSHxKF8TgLJuHlhUv1lSi5EY",
    authDomain: "diario-d6fec.firebaseapp.com",
    projectId: "diario-d6fec",
    storageBucket: "diario-d6fec.firebasestorage.app",
    messagingSenderId: "47564703165",
    appId: "1:47564703165:web:d68cc2c96d389445a37ed4",
    measurementId: "G-0MFSM1K0CG"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);
const auth = getAuth(app);

// Para poder usar Firebase en tu archivo comments.js
window.firebase = { database, auth };
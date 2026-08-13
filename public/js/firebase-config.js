// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.17.1/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/12.17.1/firebase-analytics.js";
// Agregamos Firestore para leer la base de datos
import { getFirestore } from "https://www.gstatic.com/firebasejs/12.17.1/firebase-firestore.js";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCENcEYyoxKdYYZpCbMEU8UPtL-RcuBP74",
  authDomain: "praxis-prio.firebaseapp.com",
  projectId: "praxis-prio",
  storageBucket: "praxis-prio.firebasestorage.app",
  messagingSenderId: "832613297185",
  appId: "1:832613297185:web:2c2f08322d753863050760",
  measurementId: "G-Z6BESE9B0F"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
if (!['localhost', '127.0.0.1'].includes(window.location.hostname)) {
  getAnalytics(app);
}
// Inicializamos la base de datos y la exportamos
const db = getFirestore(app);

export { db };
// firebaseConfig.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCINTSejIqbn8prTVfA7P39GZEoXfKg2YA",
  authDomain: "myfolder-d8603.firebaseapp.com",
  projectId: "myfolder-d8603",
  storageBucket: "myfolder-d8603.appspot.com",
  messagingSenderId: "985127776007",
  appId: "1:985127776007:web:27a6d9c37b117bc03e1fa2",
};

// Inicializa o Firebase App
const app = initializeApp(firebaseConfig);

// Inicializa o Firestore
const firestore = getFirestore(app);

export { app, firestore };


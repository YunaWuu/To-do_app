import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyA-HXytIXQMPDC6Jm21UM1TiLRO-xh7sCU",
    authDomain: "family-todo-list-6c51c.firebaseapp.com",
    projectId: "family-todo-list-6c51c",
    storageBucket: "family-todo-list-6c51c.appspot.com",
    messagingSenderId: "605412012550",
    appId: "1:605412012550:web:478bd73e2cdcf2765c8987",
    measurementId: "G-LRXMKWXGS6"
  };

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app);
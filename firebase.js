import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyCVT-Z3bk-v6QX7C6WkSdS0_WfJlEAWoHI",
  authDomain: "complios-d49c4.firebaseapp.com",
  projectId: "complios-d49c4",
  storageBucket: "complios-d49c4.firebasestorage.app",
  messagingSenderId: "760456325368",
  appId: "1:760456325368:web:a450ba52684166452cf30d",
  measurementId: "G-K9YK3ZXV3K",
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);

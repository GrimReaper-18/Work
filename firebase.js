import { initializeApp } from 'https://www.gstatic.com/firebasejs/12.0.0/firebase-app.js';
import { getFirestore, collection, query, where, getDocs, onSnapshot, doc, setDoc, deleteDoc, serverTimestamp, updateDoc, addDoc } from 'https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js';
import { getAuth, signInWithEmailAndPassword, onAuthStateChanged, signOut } from 'https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js';

const firebaseConfig = {
  apiKey: 'AIzaSyCVT-Z3bk-v6QX7C6WkSdS0_WfJlEAWoHI',
  authDomain: 'complios-d49c4.firebaseapp.com',
  projectId: 'complios-d49c4',
  storageBucket: 'complios-d49c4.firebasestorage.app',
  messagingSenderId: '760456325368',
  appId: '1:760456325368:web:a450ba52684166452cf30d',
  measurementId: 'G-K9YK3ZXV3K',
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);

window.firebaseServices = {
  db,
  auth,
  collection,
  query,
  where,
  getDocs,
  onSnapshot,
  doc,
  setDoc,
  deleteDoc,
  serverTimestamp,
  updateDoc,
  addDoc,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
};

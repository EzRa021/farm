// lib/firebase.js
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyD6rhrnoVU12EkaQVdyKshxYYRYZiYs94U",
  authDomain: "farm-153b8.firebaseapp.com",
  projectId: "farm-153b8",
  storageBucket: "farm-153b8.appspot.com",
  messagingSenderId: "511715043942",
  appId: "1:511715043942:web:6eb378d5d2a17d7eb99ba7",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };

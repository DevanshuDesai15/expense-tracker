// Firebase configuration
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyD6UNoOWBqzzsin1QbIXbLDh3wfZlyX3kA",
  authDomain: "pennyworth-bf5bf.firebaseapp.com",
  projectId: "pennyworth-bf5bf",
  storageBucket: "pennyworth-bf5bf.firebasestorage.app",
  messagingSenderId: "829469225872",
  appId: "1:829469225872:web:fe358c07ab284fbc2cf915",
  measurementId: "G-1DYL3BHBK0"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const db = getFirestore(app);
export const auth = getAuth(app);

export default app;
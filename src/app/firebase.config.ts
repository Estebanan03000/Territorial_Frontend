import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

export const firebaseConfig = {
  apiKey: "AIzaSyAHO1vlB1_mYEdNkfiX4RbtbZ6Jls1ZS2s",
  authDomain: "territorial-frontend-ce669.firebaseapp.com",
  projectId: "territorial-frontend-ce669",
  storageBucket: "territorial-frontend-ce669.firebasestorage.app",
  messagingSenderId: "849639293420",
  appId: "1:849639293420:web:9be0c1de111f312b0ec0c9",
  measurementId: "G-JJ1QS2H1Z9"
};

export const firebaseApp = initializeApp(firebaseConfig);
export const firebaseAuth = getAuth(firebaseApp);

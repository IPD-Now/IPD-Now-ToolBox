import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyBmpY53eI8HeVDX_tFFuwd0dgCBwiJW8cM",
  authDomain: "ipd-now.firebaseapp.com",
  projectId: "ipd-now",
  storageBucket: "ipd-now.firebasestorage.app",
  messagingSenderId: "358061283275",
  appId: "1:358061283275:web:6398580b6c0b3e8dbbc84e",
  measurementId: "G-BRQC891WL6"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);
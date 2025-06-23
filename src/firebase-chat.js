// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration for the chat
const firebaseChatConfig = {
  apiKey: "AIzaSyDSCkQd1r5I_hHoHhBpWsKkJsRpeWfo9VI",
  authDomain: "secapp-296d5.firebaseapp.com",
  projectId: "secapp-296d5",
  storageBucket: "secapp-296d5.firebasestorage.app",
  messagingSenderId: "968672696644",
  appId: "1:968672696644:web:39db5a9c5ed9ca6fe41f11",
  measurementId: "G-PLLM8K1HY1"
};

// Initialize the secondary Firebase app
const chatApp = initializeApp(firebaseChatConfig, "chatApp");

// Get a Firestore instance for the chat app
export const dbChat = getFirestore(chatApp); 
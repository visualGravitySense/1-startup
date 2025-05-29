// Firebase Configuration для React Dashboard
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";

// Firebase конфигурация (из firebase-config.js)
const firebaseConfig = {
  apiKey: "AIzaSyCYV9WGP9JItX-vZL6sYMkoxAnLXq0pmCg",
  authDomain: "main-management-572b0.firebaseapp.com",
  projectId: "main-management-572b0",
  storageBucket: "main-management-572b0.firebasestorage.app",
  messagingSenderId: "1081305439096",
  appId: "1:1081305439096:web:0b7bdcc3f8f0ddc900068d",
  measurementId: "G-2T7T34TSMF"
};

// Инициализация Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const analytics = getAnalytics(app);

export { app, db, analytics, firebaseConfig }; 
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCYV9WGP9JItX-vZL6sYMkoxAnLXq0pmCg",
  authDomain: "main-management-572b0.firebaseapp.com",
  projectId: "main-management-572b0",
  storageBucket: "main-management-572b0.firebasestorage.app",
  messagingSenderId: "1081305439096",
  appId: "1:1081305439096:web:0b7bdcc3f8f0ddc900068d",
  measurementId: "G-2T7T34TSMF"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);
const auth = getAuth(app);

export { db, auth, analytics };
export default app; 
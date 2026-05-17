// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getAuth} from 'firebase/auth';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey:import.meta.env.VITE_FIREBASE_APIKEY,
  authDomain: "vingo-food-delivery-6c34e.firebaseapp.com",
  projectId: "vingo-food-delivery-6c34e",
  storageBucket: "vingo-food-delivery-6c34e.firebasestorage.app",
  messagingSenderId: "747672081445",
  appId: "1:747672081445:web:0302693a7bf73c2dc11bcc"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth=getAuth(app)
export {app,auth};
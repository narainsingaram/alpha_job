// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import {getFirestore} from "firebase/firestore";
import {getStorage} from "firebase/storage";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDV-tviFUTABy9ik3FogRM2P9oMBPe5JUA",
  authDomain: "alphajob-db3d7.firebaseapp.com",
  projectId: "alphajob-db3d7",
  storageBucket: "alphajob-db3d7.firebasestorage.app",
  messagingSenderId: "1040844005992",
  appId: "1:1040844005992:web:0d29d7163f149fb629d1dd",
  measurementId: "G-GY3ZGW7LNT"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

export const storage = getStorage(app);
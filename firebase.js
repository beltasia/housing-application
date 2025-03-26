// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDPX5SOMTCXziTnyp8VfxtGp3dWCHP931k",
  authDomain: "housing-40339.firebaseapp.com",
  projectId: "housing-40339",
  storageBucket: "housing-40339.firebasestorage.app",
  messagingSenderId: "320567801300",
  appId: "1:320567801300:web:f4d55fa58c97e930991241",
  measurementId: "G-FFWFD936GW"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

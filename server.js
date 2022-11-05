import "./src/db/conn.js";
import "./src/app.js"

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyARU_H-7q-rIBQJhnD2vdVwVUVM_-cyQQc",
  authDomain: "abst-d76fb.firebaseapp.com",
  projectId: "abst-d76fb",
  storageBucket: "abst-d76fb.appspot.com",
  messagingSenderId: "95582966759",
  appId: "1:95582966759:web:4c19d83101ce8cc57be342",
  measurementId: "G-RJDY4QRM2F"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
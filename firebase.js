// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAlCkv06IwsgpOUsgb9ySF3jzEv1voE",
  authDomain: "hacka-4e613.firebaseapp.com",
  projectId: "hackathe613",
  storageBucket: "hackapspot.com",
  messagingSenderId: "83036239",
  appId: "1:8303731[9:wd9256e9bb4d40a",
  measurementId: "G-H0J65W"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app); 
export { auth, createUserWithEmailAndPassword, signInWithEmailAndPassword };

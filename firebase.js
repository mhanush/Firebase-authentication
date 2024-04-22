// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAlCkvLu-06IwsgpOUsgb9ySF3jzEv1voE",
  authDomain: "hackathon-cse-4e613.firebaseapp.com",
  projectId: "hackathon-cse-4e613",
  storageBucket: "hackathon-cse-4e613.appspot.com",
  messagingSenderId: "830373186239",
  appId: "1:830373186239:web:f3dcbaf6d9256e9bb4d40a",
  measurementId: "G-6EMNH0J65W"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app); 
export { auth, createUserWithEmailAndPassword, signInWithEmailAndPassword };

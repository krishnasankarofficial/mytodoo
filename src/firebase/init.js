// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app"
import { getFirestore } from "firebase/firestore"
import { getAuth } from "firebase/auth"



// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDZugvSxAzvI8-S1CX3sWdspTD6r7pRkTE",
  authDomain: "to-do-app-8b6da.firebaseapp.com",
  projectId: "to-do-app-8b6da",
  storageBucket: "to-do-app-8b6da.appspot.com",
  messagingSenderId: "428942186369",
  appId: "1:428942186369:web:369fee9a0fb22d5223ba80",
  measurementId: "G-DQF2MVME2D"
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)
const auth = getAuth(app)


// Initialize FireStore Service
const db = getFirestore(app)


export { auth }
export default db
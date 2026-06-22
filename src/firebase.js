import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: "AIzaSyC-1SQB8zIa-p-3UK1qcCQ0w2fURzXc69c",
  authDomain: "officemove-a6744.firebaseapp.com",
  projectId: "officemove-a6744",
  storageBucket: "officemove-a6744.firebasestorage.app",
  messagingSenderId: "794977343875",
  appId: "1:794977343875:web:03b6f638ef87707618feb6"
}

const app = initializeApp(firebaseConfig)
export const db = getFirestore(app)

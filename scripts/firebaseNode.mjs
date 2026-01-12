import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// En Node usamos process.env (no import.meta.env)
const firebaseConfig = {
  apiKey: process.env.VITE_FIREBASE_API_KEY,
  authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.VITE_FIREBASE_APP_ID,
};

for (const [k, v] of Object.entries(firebaseConfig)) {
  if (!v) throw new Error(`Falta variable de entorno: ${k}`);
}

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyC0I3ncNGyVOYuWngL58xsvM9opMJNX0e4",
  authDomain: "viveenunpueblodemexico-9a369.firebaseapp.com",
  projectId: "viveenunpueblodemexico-9a369",
  storageBucket: "viveenunpueblodemexico-9a369.firebasestorage.app",
  messagingSenderId: "1076199522084",
  appId: "1:1076199522084:web:c9a35afed1bb9bf0c03db1",
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);

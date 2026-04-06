import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase";

export async function subscribeNewsletter({ email, source = "home", acceptedTerms = false }) {
  const cleanEmail = (email || "").trim().toLowerCase();
  if (!cleanEmail || !cleanEmail.includes("@")) {
    throw new Error("Ingresa un correo válido.");
  }

  if (!acceptedTerms) {
    throw new Error("Debes aceptar el aviso de privacidad.");
  }

  await addDoc(collection(db, "newsletter_subscribers"), {
    email: cleanEmail,
    source,
    acceptedTerms: true,
    status: "active",
    createdAt: serverTimestamp(),
  });
}
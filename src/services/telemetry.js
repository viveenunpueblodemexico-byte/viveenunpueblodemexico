import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase";

export async function trackEvent(name, payload = {}) {
  if (!name) return;

  try {
    await addDoc(collection(db, "analytics_events"), {
      name,
      payload,
      createdAt: serverTimestamp(),
    });
  } catch (error) {
    console.warn("No se pudo registrar evento:", name, error?.message || error);
  }
}
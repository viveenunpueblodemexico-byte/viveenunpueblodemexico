import { collection, getDocs, limit, query, where } from "firebase/firestore";
import { db } from "../firebase";

function normalize(docSnap) {
  const d = docSnap.data() || {};
  return {
    id: docSnap.id,
    nombre: d.nombre || "Comunidad",
    ubicacion: d.ubicacion || "México",
    texto: d.texto || "",
    activo: d.activo !== false,
  };
}

export async function getTestimoniosPublicos({ max = 6 } = {}) {
  const ref = collection(db, "testimonios");
  const q = query(ref, where("activo", "==", true), limit(max));
  const snap = await getDocs(q);
  return snap.docs.map(normalize).filter((t) => t.texto.trim().length > 0);
}
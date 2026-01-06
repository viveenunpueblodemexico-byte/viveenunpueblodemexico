// src/services/pueblos.js
import { db } from "../firebase";
import {
  collection,
  getDocs,
  query,
  where,
  orderBy,
  limit,
} from "firebase/firestore";

// Normaliza para que nunca truene la UI
function normalizePueblo(doc) {
  const d = doc.data() || {};
  return {
    id: doc.id,
    ...d,
    // defaults útiles
    nombre: d.nombre || "",
    estado: d.estado || "",
    slug: d.slug || "",
    descripcionCorta: d.descripcionCorta || "",
    publicado: Boolean(d.publicado),
    destacado: Boolean(d.destacado),
    tags: Array.isArray(d.tags) ? d.tags.filter(Boolean) : [],
  };
}

// ============================
// #RTC_CO-1 — LISTA PUBLICADOS (CATÁLOGO)
// ============================
export async function getPueblosPublicados({ max = 50 } = {}) {
  const ref = collection(db, "pueblos");

  const q = query(
    ref,
    where("publicado", "==", true),
    orderBy("destacado", "desc"),
    orderBy("createdAt", "desc"),
    limit(max)
  );

  const snap = await getDocs(q);
  return snap.docs.map(normalizePueblo);
}

// ============================
// #RTC_CO-2 — DETALLE POR SLUG
// ============================
// Para ruta: /pueblo/:slug
export async function getPuebloBySlug(slug) {
  if (!slug) return null;

  const ref = collection(db, "pueblos");

  // OJO: esto puede pedir índice compuesto (slug + publicado)
  const q = query(
    ref,
    where("slug", "==", slug),
    where("publicado", "==", true),
    limit(1)
  );

  const snap = await getDocs(q);
  if (snap.empty) return null;

  return normalizePueblo(snap.docs[0]);
}

// ============================
// #RTC_CO-3 — DESTACADOS (HOME)
// ============================
export async function getPueblosDestacados({ max = 6 } = {}) {
  const ref = collection(db, "pueblos");

  const q = query(
    ref,
    where("publicado", "==", true),
    where("destacado", "==", true),
    orderBy("createdAt", "desc"),
    limit(max)
  );

  const snap = await getDocs(q);
  return snap.docs.map(normalizePueblo);
}

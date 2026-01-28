// src/services/pueblos.js
import { db } from "../firebase";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
  orderBy,
  limit,
} from "firebase/firestore";

// ============================
// Normalizers
// ============================
function normalizePueblo(doc) {
  const d = doc.data() || {};
  return {
    id: doc.id,
    ...d,

    nombre: d.nombre || "",
    estado: d.estado || "",
    municipio: d.municipio || "",
    slug: d.slug || "",
    descripcionCorta: d.descripcionCorta || "",

    imagenUrl: d.imagenUrl || "",
    videoUrl: d.videoUrl || "",

    publicado: Boolean(d.publicado),
    destacado: Boolean(d.destacado),

    tags: Array.isArray(d.tags) ? d.tags.filter(Boolean) : [],

    createdAt: d.createdAt || null,
    updatedAt: d.updatedAt || null,
  };
}

function normalizeOferta(doc) {
  const d = doc.data() || {};
  return {
    id: doc.id,
    ...d,
    titulo: d.titulo || "",
    descripcion: d.descripcion || "",
    contactoEmail: d.contactoEmail || "",
    activo: Boolean(d.activo),
    createdAt: d.createdAt || null,
  };
}

function normalizeImagen(doc) {
  const d = doc.data() || {};
  return {
    id: doc.id,
    ...d,
    url: d.url || "",
    alt: d.alt || "",
    orden: Number.isFinite(d.orden) ? d.orden : 0,
    createdAt: d.createdAt || null,
  };
}

// ============================
// #RTC_CO-1 — LISTA PUBLICADOS
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
export async function getPuebloBySlug(slug) {
  if (!slug) return null;

  const ref = collection(db, "pueblos");

  // ✅ Solo por slug (sin publicado)
const q = query(ref, where("slug", "==", slug), where("publicado", "==", true), limit(1));

  const snap = await getDocs(q);
  if (!snap.empty) {
    return normalizePueblo(snap.docs[0]);
  }

  // 🔁 Fallback: si no existe ese slug, intentamos interpretarlo como docId
  const docRef = doc(db, "pueblos", slug);
  const docSnap = await getDoc(docRef);
  if (!docSnap.exists()) return null;

  return normalizePueblo(docSnap);
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

// ============================
// #RTC_CO-4 — OFERTAS POR PUEBLO
// ============================
export async function getOfertasByPuebloId(puebloId, { max = 50 } = {}) {
  if (!puebloId) return [];

  const ref = collection(db, "pueblos", puebloId, "ofertas");

  const q = query(
    ref,
    where("activo", "==", true),
    orderBy("createdAt", "desc"),
    limit(max)
  );

  const snap = await getDocs(q);
  return snap.docs.map(normalizeOferta);
}

// ============================
// #RTC_CO-5 — IMÁGENES POR PUEBLO (GALERÍA)
// ============================
export async function getImagenesByPuebloId(puebloId, { max = 30 } = {}) {
  if (!puebloId) return [];

  const ref = collection(db, "pueblos", puebloId, "imagenes");

  const q = query(
    ref,
    orderBy("orden", "asc"),
    orderBy("createdAt", "desc"),
    limit(max)
  );

  const snap = await getDocs(q);
  return snap.docs.map(normalizeImagen);
}

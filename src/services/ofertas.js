import {
  addDoc,
  collection,
  collectionGroup,
  doc,
  getDocs,
  limit,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
  deleteDoc,
  deleteField,
  where,
} from "firebase/firestore";
import { auth, db } from "../firebase";
import { slugify } from "../utils/slug";


// ============================
// Crear oferta dentro del pueblo (público)
// ============================
export async function crearOfertaPueblo({
  puebloId,
  puebloNombre,
  puebloSlug,
  estado,
  tipo = "trabajo",
  titulo,
  descripcion,
  contactoEmail = "",
  userId = "",
  userEmail = "",
}) {
  if (!puebloId) throw new Error("puebloId requerido");
  if (!titulo?.trim()) throw new Error("Título requerido");
  if (!descripcion?.trim()) throw new Error("Descripción requerida");
  if (!userId) throw new Error("Debes iniciar sesión para publicar.");

  const ref = collection(db, "pueblos", puebloId, "ofertas");

  const payload = {
    tipo,
    status: "pendiente",
    activo: false,

    titulo: titulo.trim(),
    descripcion: descripcion.trim(),
    contactoEmail: contactoEmail.trim(),

    userId: String(userId),
    userEmail: (userEmail || "").trim(),

    puebloId,
    puebloNombre: (puebloNombre || "").trim(),
    puebloSlug: (puebloSlug || "").trim(),

    estado: (estado || "").trim(),
    estadoSlug: slugify(estado || ""),

    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  };

  const docRef = await addDoc(ref, payload);
  return docRef.id;
}

// ============================
// Normalizer (para bolsas/admin)
// ============================
function normalizeOfertaDoc(d, id) {
  return {
    id,
    tipo: d.tipo || "",
    status: d.status || "",
    activo: Boolean(d.activo),

    titulo: d.titulo || "",
    descripcion: d.descripcion || "",
    contactoEmail: d.contactoEmail || "",

    userId: d.userId || "",
    userEmail: d.userEmail || "",

    puebloId: d.puebloId || "",
    puebloNombre: d.puebloNombre || "",
    puebloSlug: d.puebloSlug || "",

    estado: d.estado || "",
    estadoSlug: d.estadoSlug || "",

    createdAt: d.createdAt || null,
    updatedAt: d.updatedAt || null,
    
    moderatedAt: d.moderatedAt || null,
    moderatedBy: d.moderatedBy || null,
    moderatedAction: d.moderatedAction || null,
    };
  }

function getAdminUid() {
  return auth?.currentUser?.uid || null;
}

function moderationMeta(action) {
  return {
    moderatedAt: serverTimestamp(),
    moderatedBy: getAdminUid(),
    moderatedAction: action,
  };
}

async function getDocsWithLimitFallback(buildQuery, preferredMax = 200) {
  const attempts = Array.from(new Set([preferredMax, 100, 50, 20].filter((n) => Number.isFinite(n) && n > 0)));
  let lastError = null;

  for (const n of attempts) {
    try {
      const snap = await getDocs(buildQuery(n));
      return snap;
    } catch (e) {
      lastError = e;
      if (e?.code !== "permission-denied") throw e;
    }
  }

  throw lastError || new Error("No se pudieron cargar las ofertas.");
}


// ============================
// Bolsa (público): ofertas activas por tipo (collectionGroup)
// ============================
export async function getOfertasActivas({ tipo = "trabajo", max = 200 } = {}) {
  const ref = collectionGroup(db, "ofertas");

const q = query(
  ref,
  where("activo", "==", true),
  where("status", "==", "aprobada"),
  where("tipo", "==", tipo),
  orderBy("createdAt", "desc"),
  limit(max)
);

  try {
    console.log("🧪 Query tipo:", tipo);
    console.log("🧪 About to getDocs...");

    const snap = await getDocs(q);

    console.log("🧪 snap.size:", snap.size);
    console.log("🧪 first path:", snap.docs[0]?.ref?.path);

    return snap.docs.map((docu) => normalizeOfertaDoc(docu.data() || {}, docu.id));
  } catch (e) {
    console.error("❌ getOfertasActivas error:", e);
    const code = e?.code || "";
    const isDev = Boolean(import.meta?.env?.DEV);

    if (code === "permission-denied" && !isDev) return [];
    throw e;
  }
}


// ============================
// Admin: ofertas pendientes por tipo (collectionGroup)
// ============================
export async function getOfertasPendientes({ tipo = "trabajo", max = 200 } = {}) {
  const ref = collectionGroup(db, "ofertas");

    const snap = await getDocsWithLimitFallback(
    (safeMax) =>
      query(
        ref,
        where("status", "==", "pendiente"),
        where("tipo", "==", tipo),
        orderBy("createdAt", "desc"),
        limit(safeMax)
      ),
    max
  );
  return snap.docs.map((docu) => normalizeOfertaDoc(docu.data() || {}, docu.id));
}

// Admin: listar por status (ej: "aprobada", "tomada")
export async function getOfertasPorStatus({ tipo, status, max = 100 }) {
  if (!tipo) throw new Error("Falta 'tipo'.");
  if (!status) throw new Error("Falta 'status'.");

    const snap = await getDocsWithLimitFallback(
    (safeMax) =>
      query(
        collectionGroup(db, "ofertas"),
        where("tipo", "==", tipo),
        where("status", "==", status),
        orderBy("createdAt", "desc"),
        limit(safeMax)
      ),
    max
  );


  return snap.docs.map((docu) => normalizeOfertaDoc(docu.data() || {}, docu.id));
 
}

// ============================
// Admin: aprobar / rechazar (por puebloId + ofertaId)
// ============================
export async function aprobarOferta({ puebloId, ofertaId }) {
  if (!puebloId || !ofertaId) throw new Error("puebloId y ofertaId requeridos");
  const ref = doc(db, "pueblos", puebloId, "ofertas", ofertaId);

  await updateDoc(ref, {
  activo: true,
  status: "aprobada",
  tomadaAt: deleteField(),
  updatedAt: serverTimestamp(),
  ...moderationMeta("aprobar"),
});
}

export async function rechazarOferta({ puebloId, ofertaId }) {
  if (!puebloId || !ofertaId) throw new Error("puebloId y ofertaId requeridos");
  const ref = doc(db, "pueblos", puebloId, "ofertas", ofertaId);

  await updateDoc(ref, {
  activo: false,
  status: "rechazada",
  tomadaAt: deleteField(),
  updatedAt: serverTimestamp(),
  ...moderationMeta("rechazar"),
});
}

// ============================
// Detalle de pueblo (público): ofertas activas por puebloId
// ============================
export async function getOfertasActivasByPuebloId(
  puebloId,
  { tipo = "trabajo", max = 50 } = {}
) {
  if (!puebloId) throw new Error("puebloId requerido");

  const ref = collection(db, "pueblos", puebloId, "ofertas");

const q = query(
  ref,
  where("activo", "==", true),
  where("status", "==", "aprobada"),
  where("tipo", "==", tipo),
  orderBy("createdAt", "desc"),
  limit(max)
);

  try {
    const snap = await getDocs(q);
    return snap.docs.map((docu) => normalizeOfertaDoc(docu.data() || {}, docu.id));
  } catch (e) {
    const code = e?.code || "";
    const isDev = Boolean(import.meta?.env?.DEV);

    if (code === "permission-denied" && !isDev) return [];
    throw e;
  }
}

// ============================
// Admin: marcar como tomada/cerrada
// ============================
export async function marcarOfertaTomada({ puebloId, ofertaId }) {
  if (!puebloId || !ofertaId) throw new Error("puebloId y ofertaId requeridos");
  const ref = doc(db, "pueblos", puebloId, "ofertas", ofertaId);

  await updateDoc(ref, {
    activo: false,
    status: "tomada",
    tomadaAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
    ...moderationMeta("tomar"),
  });
}

// ============================
// Admin: reactivar (volver a aprobada/visible)
// ============================
export async function reactivarOferta({ puebloId, ofertaId }) {
  if (!puebloId || !ofertaId) throw new Error("puebloId y ofertaId requeridos");
  const ref = doc(db, "pueblos", puebloId, "ofertas", ofertaId);

  await updateDoc(ref, {
  activo: true,
  status: "aprobada",
  tomadaAt: deleteField(),
  updatedAt: serverTimestamp(),
  ...moderationMeta("reactivar"),
});
}
// ============================
// Usuario: mis publicaciones (todas, incluyendo pendientes)
// ============================
export async function getMisOfertas({ userId, max = 200 } = {}) {
  if (!userId) throw new Error("userId requerido");

  const q = query(
    collectionGroup(db, "ofertas"),
    where("userId", "==", userId),
    orderBy("createdAt", "desc"),
    limit(max)
  );

  const snap = await getDocs(q);
  return snap.docs.map((docu) => normalizeOfertaDoc(docu.data() || {}, docu.id));
}

export async function editarOfertaUsuario({ puebloId, ofertaId, titulo, descripcion, contactoEmail }) {
  if (!puebloId || !ofertaId) throw new Error("puebloId y ofertaId requeridos");
  if (!auth?.currentUser?.uid) throw new Error("Debes iniciar sesión.");

  const ref = doc(db, "pueblos", puebloId, "ofertas", ofertaId);

  await updateDoc(ref, {
    titulo: (titulo || "").trim(),
    descripcion: (descripcion || "").trim(),
    contactoEmail: (contactoEmail || "").trim(),
    updatedAt: serverTimestamp(),
  });
}
export async function eliminarOfertaUsuario({ puebloId, ofertaId }) {
  if (!puebloId || !ofertaId) throw new Error("puebloId y ofertaId requeridos");
  if (!auth?.currentUser?.uid) throw new Error("Debes iniciar sesión.");

  const ref = doc(db, "pueblos", puebloId, "ofertas", ofertaId);
  await deleteDoc(ref);
}
export async function eliminarOfertaAdmin({ puebloId, ofertaId }) {
  if (!puebloId || !ofertaId) throw new Error("puebloId y ofertaId requeridos");
  const ref = doc(db, "pueblos", puebloId, "ofertas", ofertaId);
  await deleteDoc(ref);
}
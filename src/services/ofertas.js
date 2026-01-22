import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase";
import { slugify } from "../utils/slug";

export async function crearOfertaPueblo({
  puebloId,
  puebloNombre,
  puebloSlug,
  estado,
  tipo = "trabajo",
  titulo,
  descripcion,
  contactoEmail = "",
}) {
  if (!puebloId) throw new Error("puebloId requerido");
  if (!titulo?.trim()) throw new Error("Título requerido");
  if (!descripcion?.trim()) throw new Error("Descripción requerida");

  const ref = collection(db, "pueblos", puebloId, "ofertas");

  const payload = {
    tipo,
    status: "pendiente",
    activo: false,

    titulo: titulo.trim(),
    descripcion: descripcion.trim(),
    contactoEmail: contactoEmail.trim(),

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

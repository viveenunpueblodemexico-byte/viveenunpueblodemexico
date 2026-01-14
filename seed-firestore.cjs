/**
 * Seed de Firestore: pueblos + subcolecciones imagenes/ofertas
 * Requisitos:
 * 1) npm i firebase-admin
 * 2) Service Account JSON (descargado de Firebase Console) como ./serviceAccountKey.json
 * 3) Archivo ./pueblos.seed.json
 */

const admin = require("firebase-admin");
const fs = require("fs");

const serviceAccount = require("./src/serviceAccountKey.json");
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();
const { FieldValue } = admin.firestore;

function assertString(x, name) {
  if (typeof x !== "string" || !x.trim()) throw new Error(`Campo inválido: ${name}`);
}

async function upsertPueblo(entry) {
  const { puebloId, pueblo, imagenes = [], ofertas = [] } = entry;

  assertString(puebloId, "puebloId");
  if (!pueblo || typeof pueblo !== "object") throw new Error(`Falta pueblo en ${puebloId}`);

  // mínimos
  ["nombre", "slug", "estado", "municipio", "descripcionCorta"].forEach((k) =>
  assertString(pueblo[k], `pueblo.${k}`)
);

// imagenUrl puede ir vacío en MVP (pero debe ser string)
if (typeof pueblo.imagenUrl !== "string") {
  throw new Error(`pueblo.imagenUrl debe ser string en ${puebloId}`);
}

  if (!Array.isArray(pueblo.tags)) throw new Error(`pueblo.tags debe ser array en ${puebloId}`);

  const puebloRef = db.collection("pueblos").doc(puebloId);

  // Upsert doc principal
  await puebloRef.set(
    {
      ...pueblo,
      publicado: pueblo.publicado === true,
      destacado: pueblo.destacado === true,
      createdAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp(),
    },
    { merge: true }
  );

  // Subcolección: imagenes
  for (const img of imagenes) {
    assertString(img.imagenId, "imagenes[].imagenId");
    assertString(img.url, "imagenes[].url");
    assertString(img.alt, "imagenes[].alt");
    const orden = Number.isFinite(img.orden) ? img.orden : 1;

    await puebloRef
      .collection("imagenes")
      .doc(img.imagenId)
      .set(
        {
          url: img.url,
          alt: img.alt,
          orden,
          createdAt: FieldValue.serverTimestamp(),
        },
        { merge: true }
      );
  }

  // Subcolección: ofertas
  for (const ofr of ofertas) {
    assertString(ofr.ofertaId, "ofertas[].ofertaId");
    assertString(ofr.titulo, "ofertas[].titulo");
    assertString(ofr.descripcion, "ofertas[].descripcion");

    await puebloRef
      .collection("ofertas")
      .doc(ofr.ofertaId)
      .set(
        {
          titulo: ofr.titulo,
          descripcion: ofr.descripcion,
          contactoEmail: typeof ofr.contactoEmail === "string" ? ofr.contactoEmail : "",
          activo: ofr.activo === true,
          createdAt: FieldValue.serverTimestamp(),
        },
        { merge: true }
      );
  }
}

async function main() {
  const raw = fs.readFileSync("./pueblos.seed.json", "utf8");
  const data = JSON.parse(raw);

  if (!Array.isArray(data)) throw new Error("El seed debe ser un array JSON.");

  console.log(`Cargando ${data.length} pueblos...`);
  for (let i = 0; i < data.length; i++) {
    const entry = data[i];
    await upsertPueblo(entry);
    console.log(`✔ ${i + 1}/${data.length} -> ${entry.puebloId}`);
  }
  console.log("✅ Seed terminado.");
  process.exit(0);
}

main().catch((err) => {
  console.error("❌ Error:", err.message);
  process.exit(1);
});

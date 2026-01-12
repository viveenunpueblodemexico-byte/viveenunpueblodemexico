import "dotenv/config";
import { db } from "./firebaseNode.mjs";
import { collection, getDocs } from "firebase/firestore";

function slugify(str = "") {
  return str
    .toLowerCase()
    .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .replace(/-+/g, "-");
}

async function auditSlugs() {
  const snap = await getDocs(collection(db, "pueblos"));

  const items = snap.docs.map((d) => ({ id: d.id, ...d.data() }));

  console.log("Total pueblos leídos:", items.length);

  const missing = items.filter((p) => !p.slug || String(p.slug).trim() === "");

  // Conteo + índice de slugs -> docs (para detectar duplicados y ver cuáles chocan)
  const slugToDocs = new Map();
  for (const p of items) {
    const raw = (p.slug ?? "").toString();
    const s = raw.trim();
    if (!s) continue;
    if (!slugToDocs.has(s)) slugToDocs.set(s, []);
    slugToDocs.get(s).push(p);
  }

  const duplicated = [...slugToDocs.entries()]
    .filter(([, arr]) => arr.length > 1)
    .map(([slug, arr]) => ({
      slug,
      count: arr.length,
      docs: arr.map((p) => ({
        id: p.id,
        nombre: p.nombre,
        estado: p.estado,
        municipio: p.municipio,
      })),
    }));

  // (Opcional) slugs "raros" (no coinciden con slugify del propio texto)
  const weird = items
    .filter((p) => p.slug && String(p.slug).trim() !== "")
    .filter((p) => {
      const raw = String(p.slug);
      const normalized = slugify(raw);
      return raw !== raw.toLowerCase() || raw.trim() !== raw || raw !== normalized;
    })
    .map((p) => ({
      id: p.id,
      nombre: p.nombre,
      slug: p.slug,
      slug_normalizado: slugify(String(p.slug)),
    }));

  console.log("=== PUEBLOS SIN SLUG ===");
  console.table(
    missing.map((p) => ({
      id: p.id,
      nombre: p.nombre,
      estado: p.estado,
      municipio: p.municipio,
    }))
  );

  console.log("=== SLUGS DUPLICADOS (slug -> count) ===");
  console.table(duplicated.map((d) => ({ slug: d.slug, count: d.count })));

  // Detalle completo de duplicados (qué documentos chocan)
  if (duplicated.length > 0) {
    console.log("=== DETALLE DUPLICADOS (docs por slug) ===");
    for (const d of duplicated) {
      console.log(`- ${d.slug} (${d.count})`);
      console.table(d.docs);
    }
  }

  console.log("=== SLUGS 'RAROS' (opcional) ===");
  console.table(weird);

  // Resumen final claro
  const ok = missing.length === 0 && duplicated.length === 0;
  console.log(ok ? "✅ Slugs OK (sin faltantes ni duplicados)." : "⚠️ Revisar slugs (faltantes y/o duplicados).");
 }

auditSlugs().catch(console.error);

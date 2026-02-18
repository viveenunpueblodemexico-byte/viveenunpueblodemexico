// src/utils/antiSpam.js
export const COOLDOWN_MS = 60_000;

export function sanitizeText(s) {
  return (s || "").replace(/\s+/g, " ").trim();
}

export function countUrls(text) {
  return (text || "").match(/https?:\/\/|www\./gi)?.length || 0;
}

export function getCooldownRemaining(key) {
  const last = Number(localStorage.getItem(key) || "0");
  if (!last) return 0;
  const elapsed = Date.now() - last;
  const remaining = COOLDOWN_MS - elapsed;
  return remaining > 0 ? remaining : 0;
}

export function setLastSubmitNow(key) {
  localStorage.setItem(key, String(Date.now()));
}

export function isLikelyBot(honeypotValue) {
  return sanitizeText(honeypotValue).length > 0;
}

export function validateOffer({ titulo, descripcion, contactoEmail }) {
  const t = sanitizeText(titulo);
  const d = (descripcion || "").trim(); // NO colapsamos saltos dentro del textarea
  const email = sanitizeText(contactoEmail);

  if (t.length < 8) return "El título debe tener al menos 8 caracteres.";
  if (t.length > 120) return "El título es muy largo (máx. 120).";
  if (/https?:\/\//i.test(t) || /www\./i.test(t)) return "No incluyas links en el título.";

  if (d.replace(/\s/g, "").length < 40) return "La descripción es muy corta (mín. 40 caracteres).";
  if (d.length > 3000) return "La descripción es muy larga (máx. 3000).";

  const links = countUrls(d);
  if (links > 2) return "Demasiados links en la descripción (máx. 2).";

  if (email) {
    // validación simple: suficiente para frenar basura
    const ok = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i.test(email);
    if (!ok) return "El correo de contacto no parece válido.";
  }

  return null;
}

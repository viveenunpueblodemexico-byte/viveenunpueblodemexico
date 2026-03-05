export function getAdminAllowlist() {
  const raw = (import.meta.env.VITE_ADMIN_EMAILS || "").trim();
  if (!raw) return [];
  return raw
    .split(",")
    .map((s) => s.trim().toLowerCase())
    .filter(Boolean);
}

export function isAdminEmail(email) {
  const e = (email || "").trim().toLowerCase();
  if (!e) return false;
  const allow = getAdminAllowlist();
  return allow.length > 0 && allow.includes(e);
}
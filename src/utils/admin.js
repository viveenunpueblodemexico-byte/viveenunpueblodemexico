export function getAdminAllowlist() {
  const raw = (import.meta.env.VITE_ADMIN_EMAILS || "").trim();
  if (!raw) return [];
  return raw
    .split(",")
    .map((s) => s.trim().toLowerCase())
    .filter(Boolean);
}

export function isEmailAllowed(email) {
  if (!email) return false;
  const allow = getAdminAllowlist();
  return allow.includes(String(email).toLowerCase());
}

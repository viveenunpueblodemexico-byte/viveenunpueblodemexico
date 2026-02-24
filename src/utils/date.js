// src/utils/date.js
export function timeAgo(ts) {
  if (!ts) return "";
  const d = ts?.toDate ? ts.toDate() : new Date(ts);
  if (Number.isNaN(d.getTime())) return "";

  const diffMs = Date.now() - d.getTime();
  const s = Math.floor(diffMs / 1000);

  if (s < 0) return ""; // por si viene del futuro
  if (s < 60) return "Publicado hace segundos";
  const m = Math.floor(s / 60);
  if (m < 60) return m === 1 ? "Hace 1 minuto" : `Hace ${m} minutos`;
  const h = Math.floor(m / 60);
  if (h < 24) return h === 1 ? "Hace 1 hora" : `Hace ${h} horas`;
  const days = Math.floor(h / 24);
  if (days === 0) return "Publicado hoy";
  if (days === 1) return "Hace 1 día";
  if (days < 7) return `Hace ${days} días`;
  const weeks = Math.floor(days / 7);
  if (weeks === 1) return "Hace 1 semana";
  if (weeks < 5) return `Hace ${weeks} semanas`;
  const months = Math.floor(days / 30);
  if (months === 1) return "Hace 1 mes";
  if (months < 12) return `Hace ${months} meses`;
  const years = Math.floor(days / 365);
  return years === 1 ? "Hace 1 año" : `Hace ${years} años`;
}

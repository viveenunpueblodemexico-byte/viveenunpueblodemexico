export function slugify(input = "") {
  return input
    .toString()
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")   // quita acentos
    .replace(/[^a-z0-9\s-]/g, "")      // quita símbolos raros
    .replace(/\s+/g, "-")             // espacios -> -
    .replace(/-+/g, "-");             // colapsa ---
}

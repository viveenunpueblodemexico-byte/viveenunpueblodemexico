// src/utils/seo.js
// Utilidad simple para SEO/OG tags sin librerías externas
// - Inserta o reutiliza tags existentes
// - Marca los tags gestionados con data-managed="true"
// - Permite limpiar fácilmente al desmontar cada página

function isBrowser() {
  return typeof document !== "undefined";
}

function upsertMeta({ attr, key, content }) {
  if (!isBrowser() || !key) return;

  const managedSelector = `meta[${attr}="${key}"][data-managed="true"]`;
  let el = document.head.querySelector(managedSelector);

  // Si existe uno NO gestionado, lo reutilizamos y lo marcamos como gestionado
  if (!el) {
    el = document.head.querySelector(`meta[${attr}="${key}"]`);
  }

  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }

  el.setAttribute("content", content ?? "");
  el.setAttribute("data-managed", "true");
}

function upsertLink({ rel, href }) {
  if (!isBrowser() || !rel) return;

  const managedSelector = `link[rel="${rel}"][data-managed="true"]`;
  let el = document.head.querySelector(managedSelector);

  // Reutiliza si ya existe un canonical (o rel) no gestionado
  if (!el) {
    el = document.head.querySelector(`link[rel="${rel}"]`);
  }

  if (!el) {
    el = document.createElement("link");
    el.setAttribute("rel", rel);
    document.head.appendChild(el);
  }

  el.setAttribute("href", href ?? "");
  el.setAttribute("data-managed", "true");
}
 

// Limpia TODOS los metas/links gestionados por esta utilidad
export function clearManagedSEO() {
  if (!isBrowser()) return;

  const managed = document.head.querySelectorAll(
    'meta[data-managed="true"], link[data-managed="true"]'
  );

  managed.forEach((el) => el.remove());
}

export function buildAbsoluteUrl(pathname = "/") {
  if (typeof window === "undefined") return pathname;

  const base = window.location.origin || "";
  const clean = pathname.startsWith("/") ? pathname : `/${pathname}`;
  return `${base}${clean}`;
}

/**
 * setPageSEO
 * @param {Object} params
 * @param {string} params.title
 * @param {string} params.description
* @param {string} params.url absolute URL
 * @param {string} [params.type] og:type (website/article)
 * @param {string} [params.image] absolute URL de la imagen
 */
export function setPageSEO({ title, description, url, type = "website", image = "" }) {
  if (!isBrowser()) return;

  // Title
  if (title) document.title = title;

  // Canonical
 if (url) upsertLink({ rel: "canonical", href: url });

  // Description
  if (description) upsertMeta({ attr: "name", key: "description", content: description });

  // Open Graph
  if (title) upsertMeta({ attr: "property", key: "og:title", content: title });
  if (description) upsertMeta({ attr: "property", key: "og:description", content: description });
  if (url) upsertMeta({ attr: "property", key: "og:url", content: url });
  if (type) upsertMeta({ attr: "property", key: "og:type", content: type });
  if (image) upsertMeta({ attr: "property", key: "og:image", content: image });

  // Twitter (básico)
  upsertMeta({
    attr: "name",
    key: "twitter:card",
    content: image ? "summary_large_image" : "summary",
  });
  if (title) upsertMeta({ attr: "name", key: "twitter:title", content: title });
  if (description) upsertMeta({ attr: "name", key: "twitter:description", content: description });
  if (image) upsertMeta({ attr: "name", key: "twitter:image", content: image });
 }
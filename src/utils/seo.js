// src/utils/seo.js
// Utilidad simple para SEO/OG tags sin librerías externas

function upsertMeta({ attr, key, content }) {
  if (!key) return;

  const selector = `meta[${attr}="${key}"][data-managed="true"]`;
  let el = document.head.querySelector(selector);

  if (!el) {
   // Si existe uno NO gestionado, lo reutilizamos y lo marcamos como gestionado   el = document.head.querySelector(`meta[${attr}="${key}"]`);
  }

  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }

  el.setAttribute("content", content || "");
  el.setAttribute("data-managed", "true");
}

function upsertLink({ rel, href }) {
  if (!rel) return;

  const selector = `link[rel="${rel}"][data-managed="true"]`;
  let el = document.head.querySelector(selector);

  if (!el) {
    el = document.head.querySelector(`link[rel="${rel}"]`);
  }

  if (!el) {
    el = document.createElement("link");
    el.setAttribute("rel", rel);
    document.head.appendChild(el);
  }

  el.setAttribute("href", href || "");
  el.setAttribute("data-managed", "true");
}

export function setPageSEO({
  title,
  description,
  url,
  image,
  type = "website",
} = {}) {
  if (typeof document === "undefined") return;

  // Title
  if (title) document.title = title;

  // Basic meta
  if (description) upsertMeta({ attr: "name", key: "description", content: description });

  // Canonical
  if (url) upsertLink({ rel: "canonical", href: url });

  // Open Graph
  if (title) upsertMeta({ attr: "property", key: "og:title", content: title });
  if (description) upsertMeta({ attr: "property", key: "og:description", content: description });
  if (url) upsertMeta({ attr: "property", key: "og:url", content: url });
  if (type) upsertMeta({ attr: "property", key: "og:type", content: type });
  if (image) upsertMeta({ attr: "property", key: "og:image", content: image });

  // Twitter (básico)
  upsertMeta({ attr: "name", key: "twitter:card", content: image ? "summary_large_image" : "summary" });
  if (title) upsertMeta({ attr: "name", key: "twitter:title", content: title });
  if (description) upsertMeta({ attr: "name", key: "twitter:description", content: description });
  if (image) upsertMeta({ attr: "name", key: "twitter:image", content: image });
}

export function buildAbsoluteUrl(pathname = "/") {
  if (typeof window === "undefined") return pathname;
  const base = window.location.origin;
  if (!pathname.startsWith("/")) pathname = `/${pathname}`;
  return `${base}${pathname}`;
}


// Limpia TODOS los metas gestionados por esta utilidad
export function clearManagedSEO() {
  if (typeof document === "undefined") return;

  const managed = document.head.querySelectorAll(
    'meta[data-managed="true"], link[data-managed="true"]'
  );

  managed.forEach((el) => el.remove());
}


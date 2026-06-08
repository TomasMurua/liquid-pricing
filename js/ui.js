/**
 * ui.js — Módulo de utilidades de UI para Liquid Pricing
 * Exporta: formatoCLP, estrellas, renderNavbar, logout
 */

// ============================================================
// 1. FORMATO DE MONEDA
// ============================================================

/**
 * Formatea un número como precio CLP sin decimales.
 * @param {number} n
 * @returns {string} Ej: "$499.990"
 */
export function formatoCLP(n) {
  const valor = Math.round(Number(n));
  return "$" + valor.toLocaleString("es-CL", { maximumFractionDigits: 0 });
}


// ============================================================
// 2. ESTRELLAS DE RATING
// ============================================================

/**
 * Genera HTML con estrellas para un rating 0–5.
 * @param {number|null|undefined} rating
 * @returns {string} HTML string
 */
export function estrellas(rating) {
  if (rating == null || isNaN(rating)) {
    return `<span class="sin-rating">Sin valoraciones</span>`;
  }

  const MAX = 5;
  const llenas = Math.round(rating);  // redondeo al entero más cercano
  let html = `<span class="estrellas" aria-label="Valoración: ${rating} de 5">`;
  for (let i = 1; i <= MAX; i++) {
    if (i <= llenas) {
      html += `<span class="star-llena" aria-hidden="true">★</span>`;
    } else {
      html += `<span class="star-vacio" aria-hidden="true">☆</span>`;
    }
  }
  html += `</span>`;
  return html;
}


// ============================================================
// 3. LOGOUT
// ============================================================

/**
 * Elimina la sesión activa y redirige a la página de inicio.
 * Puede recibir un prefijo de ruta (para páginas dentro de admin/).
 * @param {string} [base=''] — Ej: '../' cuando se llama desde admin/
 */
export function logout(base = "") {
  localStorage.removeItem("lp_sesion");
  window.location.href = base + "index.html";
}


// ============================================================
// 4. NAVBAR DINÁMICO
// ============================================================

/**
 * Construye e inyecta el navbar en el elemento con el id dado.
 * Lee la sesión desde localStorage y ramifica según el rol.
 * @param {string} [contenedorId='navbar']
 */
export function renderNavbar(contenedorId = "navbar") {
  const contenedor = document.getElementById(contenedorId);
  if (!contenedor) return;

  // Detectar si estamos dentro de admin/ para corregir rutas relativas
  const enAdmin = window.location.pathname.includes("/admin/");
  const base = enAdmin ? "../" : "";

  // Leer sesión
  let sesion = null;
  try {
    sesion = JSON.parse(localStorage.getItem("lp_sesion"));
  } catch (_) {
    sesion = null;
  }

  const rol = sesion?.rol ?? null;

  // Wordmark compartida
  const brandHref = rol === "cliente"
    ? `${base}catalogo.html`
    : rol === "admin"
    ? `${base}admin/productos.html`
    : `${base}index.html`;

  const brandHTML = `
    <a class="navbar-brand" href="${brandHref}">
      <span class="brand-icon"><i class="bi bi-droplet-fill"></i></span>
      Liquid<span class="brand-accent">Pricing</span>
    </a>`;

  // Toggler (hamburger)
  const togglerHTML = `
    <button class="navbar-toggler" type="button"
            data-bs-toggle="collapse" data-bs-target="#navbarMenu"
            aria-controls="navbarMenu" aria-expanded="false"
            aria-label="Abrir menú">
      <span class="navbar-toggler-icon"></span>
    </button>`;

  let linksHTML = "";

  if (rol === "admin") {
    // ---- ADMIN ----
    linksHTML = `
      <ul class="navbar-nav ms-auto align-items-lg-center gap-lg-1">
        <li class="nav-item">
          <a class="nav-link" href="${base}admin/productos.html">Productos</a>
        </li>
        <li class="nav-item">
          <a class="nav-link" href="${base}admin/inventario.html">Inventario</a>
        </li>
        <li class="nav-item">
          <a class="nav-link" href="${base}admin/usuarios.html">Usuarios</a>
        </li>
        <li class="nav-item">
          <a class="nav-link nav-link-salir" href="#"
             onclick="(function(){localStorage.removeItem('lp_sesion');window.location.href='${base}index.html';})();return false;">
            Salir
          </a>
        </li>
      </ul>`;

  } else if (rol === "cliente") {
    // ---- CLIENTE ----
    const carrito = _contarCarrito();
    const badgeHTML = carrito > 0
      ? `<span class="badge-carrito ms-1">${carrito}</span>`
      : "";

    linksHTML = `
      <ul class="navbar-nav ms-auto align-items-lg-center gap-lg-1">
        <li class="nav-item">
          <a class="nav-link" href="${base}catalogo.html">Catálogo</a>
        </li>
        <li class="nav-item">
          <a class="nav-link" href="${base}carrito.html">
            Carrito${badgeHTML}
          </a>
        </li>
        <li class="nav-item">
          <a class="nav-link" href="${base}mis-compras.html">Mis compras</a>
        </li>
        <li class="nav-item">
          <a class="nav-link" href="${base}perfil.html">Perfil</a>
        </li>
        <li class="nav-item">
          <a class="nav-link nav-link-salir" href="#"
             onclick="(function(){localStorage.removeItem('lp_sesion');window.location.href='${base}index.html';})();return false;">
            Salir
          </a>
        </li>
      </ul>`;

  } else {
    // ---- INVITADO ----
    linksHTML = `
      <ul class="navbar-nav ms-auto align-items-lg-center gap-lg-1">
        <li class="nav-item">
          <a class="nav-link" href="${base}index.html">Ingresar</a>
        </li>
        <li class="nav-item">
          <a class="nav-link" href="${base}registro.html">Registrarse</a>
        </li>
      </ul>`;
  }

  // Seguridad: todo el HTML inyectado proviene de literales de plantilla con
  // rutas estáticas y el conteo entero del carrito. Ningún dato ingresado por
  // el usuario se interpola directamente; el campo `rol` solo controla qué
  // bloque de HTML estático se elige, nunca se inserta en el DOM.
  contenedor.innerHTML = `
    <nav class="navbar navbar-lp navbar-expand-lg">
      <div class="container">
        ${brandHTML}
        ${togglerHTML}
        <div class="collapse navbar-collapse" id="navbarMenu">
          ${linksHTML}
        </div>
      </div>
    </nav>`;
}

/**
 * Suma las unidades totales del carrito desde localStorage.
 * Usa la propiedad `cantidad` de cada ítem (1 por defecto si falta).
 * @returns {number}
 */
function _contarCarrito() {
  try {
    const raw = localStorage.getItem("lp_carrito");
    if (!raw) return 0;
    const carrito = JSON.parse(raw);
    if (!Array.isArray(carrito)) return 0;
    return carrito.reduce((sum, item) => sum + (Number(item.cantidad) || 1), 0);
  } catch (_) {
    return 0;
  }
}

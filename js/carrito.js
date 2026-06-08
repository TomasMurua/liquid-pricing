/**
 * carrito.js — Módulo de carrito e historial de compras.
 * Importar con: import { getCarrito, agregar, ... } from './js/carrito.js'
 */

import { getSesion } from './auth.js';

/** Claves en localStorage */
const LS_CARRITO = 'lp_carrito';
const LS_COMPRAS = 'lp_compras';

// ============================================================
// Helpers de persistencia
// ============================================================

/** @param {string} key @returns {Array} */
function _leer(key) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : [];
  } catch (_) {
    return [];
  }
}

/** @param {string} key @param {Array} arr */
function _guardar(key, arr) {
  localStorage.setItem(key, JSON.stringify(arr));
}

// ============================================================
// CARRITO
// ============================================================

/**
 * Retorna el arreglo completo de ítems del carrito.
 * @returns {Array<{productoId: number, nombre: string, imagen: string, tienda: string, precio: number, link: string, cantidad: number}>}
 */
export function getCarrito() {
  return _leer(LS_CARRITO);
}

/**
 * Agrega un producto/oferta al carrito.
 * Si ya existe un ítem con el mismo productoId Y tienda, incrementa su cantidad.
 * @param {{id: number, nombre: string, imagen: string}} producto
 * @param {{tienda: string, precio: number, link: string}} oferta
 * @param {number} [cantidad=1]
 */
export function agregar(producto, oferta, cantidad = 1) {
  const items = getCarrito();
  const idx = items.findIndex(
    i => i.productoId === producto.id && i.tienda === oferta.tienda
  );
  if (idx >= 0) {
    items[idx].cantidad += cantidad;
  } else {
    items.push({
      productoId: producto.id,
      nombre:     producto.nombre,
      imagen:     producto.imagen,
      tienda:     oferta.tienda,
      precio:     oferta.precio,
      link:       oferta.link,
      cantidad
    });
  }
  _guardar(LS_CARRITO, items);
}

/**
 * Elimina el ítem en la posición indicada.
 * @param {number} index
 */
export function quitar(index) {
  const items = getCarrito();
  items.splice(index, 1);
  _guardar(LS_CARRITO, items);
}

/**
 * Cambia la cantidad de un ítem (mínimo 1).
 * @param {number} index
 * @param {number} nuevaCantidad
 */
export function cambiarCantidad(index, nuevaCantidad) {
  const items = getCarrito();
  if (items[index]) {
    items[index].cantidad = Math.max(1, nuevaCantidad);
    _guardar(LS_CARRITO, items);
  }
}

/**
 * Retorna la suma de precio × cantidad de todos los ítems.
 * @returns {number}
 */
export function total() {
  return getCarrito().reduce((acc, i) => acc + i.precio * i.cantidad, 0);
}

/**
 * Retorna la suma de cantidades (total de unidades).
 * @returns {number}
 */
export function contarItems() {
  return getCarrito().reduce((acc, i) => acc + i.cantidad, 0);
}

/**
 * Vacía el carrito.
 */
export function vaciar() {
  _guardar(LS_CARRITO, []);
}

// ============================================================
// HISTORIAL DE COMPRAS
// ============================================================

/**
 * Registra una compra: crea la orden, la persiste y vacía el carrito.
 * @param {{ nombre: string, precio: number }} [envio] — datos de envío (puede ser null)
 * @returns {{ id: number, fecha: string, email: string, items: Array, total: number, envio: any, estado: string }}
 */
export function registrarCompra(envio) {
  const sesion = getSesion();
  const orden = {
    id:     Date.now(),
    fecha:  new Date().toISOString(),
    email:  sesion?.email ?? '',
    items:  getCarrito(),
    total:  total(),
    envio:  envio ?? null,
    estado: 'Pagado'
  };
  const compras = _leer(LS_COMPRAS);
  compras.push(orden);
  _guardar(LS_COMPRAS, compras);
  vaciar();
  return orden;
}

/**
 * Retorna las órdenes del usuario actualmente autenticado.
 * @returns {Array}
 */
export function getCompras() {
  const email = getSesion()?.email;
  if (!email) return [];
  return _leer(LS_COMPRAS).filter(o => o.email === email);
}

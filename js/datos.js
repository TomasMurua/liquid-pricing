/**
 * datos.js — Módulo de acceso a datos para Liquid Pricing
 * Todas las funciones que acceden a JSON o localStorage están aquí.
 * Importar con: import { getProductos, getProducto, ... } from './js/datos.js'
 */

const LS_PRODUCTOS = "lp_productos";
const LS_USUARIOS  = "lp_usuarios";

/**
 * Retorna el arreglo completo de productos.
 * Prioridad: localStorage > fetch data/productos.json
 * @returns {Promise<Array>}
 */
export async function getProductos() {
  const raw = localStorage.getItem(LS_PRODUCTOS);
  if (raw) {
    try {
      return JSON.parse(raw);
    } catch (e) {
      console.warn("datos.js: localStorage lp_productos inválido, recargando desde JSON.", e);
    }
  }
  try {
    const res = await fetch("data/productos.json");
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (e) {
    console.warn("datos.js: no se pudo cargar productos.json.", e);
    return [];
  }
}

/**
 * Retorna un producto por su id (coerción de tipos incluida), o null si no existe.
 * @param {number|string} id
 * @returns {Promise<Object|null>}
 */
export async function getProducto(id) {
  const productos = await getProductos();
  // eslint-disable-next-line eqeqeq
  return productos.find(p => p.id == id) ?? null;
}

/**
 * Guarda el arreglo de productos en localStorage (usado por el CRUD de admin).
 * @param {Array} arr
 */
export function setProductos(arr) {
  localStorage.setItem(LS_PRODUCTOS, JSON.stringify(arr));
}

/**
 * Retorna el arreglo de usuarios combinando el seed JSON con los registrados en localStorage.
 * Los usuarios de localStorage tienen precedencia (se identifican por email).
 * @returns {Promise<Array>}
 */
export async function getUsuarios() {
  let seed = [];
  try {
    const res = await fetch("data/usuarios.json");
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    seed = await res.json();
  } catch (e) {
    console.warn("datos.js: no se pudo cargar usuarios.json.", e);
  }

  let registrados = [];
  const raw = localStorage.getItem(LS_USUARIOS);
  if (raw) {
    try {
      registrados = JSON.parse(raw);
    } catch (e) {
      console.warn("datos.js: localStorage lp_usuarios inválido.", e);
    }
  }

  // Merge: seed + registrados, sin duplicar emails (registrados tienen precedencia)
  const emailsRegistrados = new Set(registrados.map(u => u.email));
  const seedFiltrado = seed.filter(u => !emailsRegistrados.has(u.email));
  return [...seedFiltrado, ...registrados];
}

/**
 * Agrega o actualiza un usuario en localStorage.
 * Identifica duplicados por email o rut.
 * @param {Object} u — objeto usuario con al menos email o rut
 */
export function guardarUsuario(u) {
  let lista = [];
  const raw = localStorage.getItem(LS_USUARIOS);
  if (raw) {
    try {
      lista = JSON.parse(raw);
    } catch (e) {
      console.warn("datos.js: localStorage lp_usuarios inválido al guardar.", e);
    }
  }

  // Reemplaza si ya existe el mismo email o rut; si no, agrega
  const idx = lista.findIndex(x => x.email === u.email || (u.rut && x.rut === u.rut));
  if (idx >= 0) {
    lista[idx] = { ...lista[idx], ...u };
  } else {
    lista.push(u);
  }

  localStorage.setItem(LS_USUARIOS, JSON.stringify(lista));
}

/**
 * Retorna el precio más bajo entre todas las ofertas del producto.
 * @param {Object} producto
 * @returns {number}
 */
export function mejorPrecio(producto) {
  if (!producto?.ofertas?.length) return 0;
  return Math.min(...producto.ofertas.map(o => o.precio));
}

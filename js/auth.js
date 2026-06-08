/**
 * auth.js — Módulo de sesión y autenticación para Liquid Pricing.
 * Gestiona la sesión en localStorage y provee helpers de login y control de acceso.
 *
 * Importar con: import { getSesion, setSesion, login, requiereRol } from './js/auth.js'
 */

import { getUsuarios } from './datos.js';

/** Clave usada en localStorage para la sesión activa. */
const LS_SESION = 'lp_sesion';

/**
 * Retorna la sesión activa o null si no hay ninguna.
 * @returns {{ rut: string, nombre: string, email: string, rol: string }|null}
 */
export function getSesion() {
  try {
    return JSON.parse(localStorage.getItem(LS_SESION));
  } catch (_) {
    return null;
  }
}

/**
 * Persiste una copia segura del usuario (sin contraseña) en localStorage.
 * @param {{ rut: string, nombre: string, email: string, rol: string, [key: string]: any }} usuario
 */
export function setSesion(usuario) {
  const { rut, nombre, email, rol } = usuario;
  localStorage.setItem(LS_SESION, JSON.stringify({ rut, nombre, email, rol }));
}

/**
 * Intenta autenticar al usuario con email y contraseña.
 * Búsqueda de email insensible a mayúsculas.
 * @param {string} email
 * @param {string} password
 * @returns {Promise<{ rut: string, nombre: string, email: string, rol: string }|null>}
 *   Retorna el objeto de sesión (sin contraseña) si las credenciales son válidas, o null.
 */
export async function login(email, password) {
  const usuarios = await getUsuarios();
  const emailLower = email.trim().toLowerCase();
  const usuario = usuarios.find(
    u => u.email.toLowerCase() === emailLower && u.password === password
  );
  if (!usuario) return null;
  setSesion(usuario);
  return getSesion();
}

/**
 * Guard de acceso por rol.
 * Si no hay sesión activa o el rol no coincide, redirige a la página de login.
 * Detecta páginas dentro de admin/ para ajustar la ruta de redirección.
 * @param {string} rol — 'admin' | 'cliente'
 */
export function requiereRol(rol) {
  const s = getSesion();
  if (!s || s.rol !== rol) {
    const enAdmin = location.pathname.includes('/admin/');
    window.location.href = enAdmin ? '../index.html' : 'index.html';
  }
}

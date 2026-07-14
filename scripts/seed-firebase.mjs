/**
 * Puebla Firebase Realtime Database con los datos semilla (productos y usuarios).
 * Los datos viven en scripts/seed-data.json (mismos que usa la app en modo estático).
 *
 * Uso: node scripts/seed-firebase.mjs
 */
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const DB = 'https://liquid-pricing-default-rtdb.firebaseio.com';

const { productos, usuarios } = JSON.parse(
  readFileSync(join(__dirname, 'seed-data.json'), 'utf8'),
);

async function put(ruta, data) {
  const res = await fetch(`${DB}/${ruta}.json`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error(`PUT ${ruta}: HTTP ${res.status}`);
  return res.json();
}

// Guardar como OBJETO con keys únicas (p1, p2… / u1, u2…) en vez de array:
// así eliminar un producto borra solo ese y no colapsa el nodo completo.
const prodObj = Object.fromEntries(productos.map((p) => [`p${p.id}`, p]));
const userObj = Object.fromEntries(usuarios.map((u, i) => [`u${i + 1}`, u]));
await put('productos', prodObj);
await put('usuarios', userObj);

console.log(`OK: ${productos.length} productos y ${usuarios.length} usuarios sembrados en Firebase.`);

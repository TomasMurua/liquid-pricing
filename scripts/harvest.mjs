/**
 * Cosecha productos REALES desde Google Shopping (SerpApi) y hornea
 * `src/app/data/productos.seed.ts`. Para cada producto trae varias tiendas
 * reales vía `google_immersive_product` (product_results.stores) — ideal para
 * el comparador de precios.
 *
 * SEGURIDAD: la API key va SOLO en el entorno (SERPAPI_KEY), nunca en el
 * frontend ni en el repo. Uso:
 *   SERPAPI_KEY=xxx node scripts/harvest.mjs
 * o con la key en .env (ignorado por git):
 *   set -a && . ./.env && set +a && node scripts/harvest.mjs
 */
import { writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const KEY = process.env.SERPAPI_KEY;
if (!KEY) {
  console.error('Falta SERPAPI_KEY en el entorno. Ponla en .env o pásala inline.');
  process.exit(1);
}

const CATEGORIAS = [
  { q: 'notebook', cat: 'notebook' },
  { q: 'smartphone', cat: 'smartphone' },
  { q: 'audifonos bluetooth', cat: 'audífonos' },
  { q: 'smartwatch', cat: 'smartwatch' },
  { q: 'monitor gamer', cat: 'monitor' },
];
const POR_CATEGORIA = 5;

async function serp(params) {
  const url = 'https://serpapi.com/search.json?' + new URLSearchParams({ ...params, api_key: KEY });
  const r = await fetch(url);
  if (!r.ok) throw new Error(`SerpApi ${r.status} para ${params.engine}`);
  return r.json();
}

/** "$449.990" o 449990 -> 449990 */
const num = (x) => (typeof x === 'number' ? x : Number(String(x ?? '').replace(/[^\d]/g, '')) || 0);

/** Extrae el texto de envío desde details_and_offers de una tienda. */
const envioDe = (store) =>
  (store.details_and_offers || []).find((x) => /entrega|env[ií]o|gratis|despacho/i.test(x)) || 'Consultar';

const productos = [];
let id = 1;

for (const { q, cat } of CATEGORIAS) {
  const shopping = await serp({ engine: 'google_shopping', q, gl: 'cl', hl: 'es', num: '15' });
  const items = (shopping.shopping_results || [])
    .filter((i) => i.thumbnail && (i.extracted_price || i.price) && i.immersive_product_page_token)
    .slice(0, POR_CATEGORIA);

  for (const item of items) {
    let ofertas = [];
    let descripcion = '';
    try {
      const imm = await serp({
        engine: 'google_immersive_product',
        page_token: item.immersive_product_page_token,
        gl: 'cl',
        hl: 'es',
      });
      const pr = imm.product_results || {};
      const vistas = new Set();
      ofertas = (pr.stores || [])
        .map((s) => ({ tienda: s.name, precio: num(s.price), link: s.link || item.product_link, envio: envioDe(s) }))
        .filter((o) => o.tienda && o.precio > 0 && !vistas.has(o.tienda) && vistas.add(o.tienda));
      // Descartar precios atípicos (errores de unidad, "precio renovación", bundles)
      if (ofertas.length >= 3) {
        const p = ofertas.map((o) => o.precio).sort((a, b) => a - b);
        const mediana = p[Math.floor(p.length / 2)];
        ofertas = ofertas.filter((o) => o.precio <= mediana * 4 && o.precio >= mediana * 0.25);
      }
      ofertas = ofertas.slice(0, 5);
      const about = pr.about_the_product;
      if (Array.isArray(about) && about.length) descripcion = about.slice(0, 3).join(' · ');
    } catch {
      /* fallback abajo */
    }

    if (ofertas.length === 0) {
      ofertas = [
        {
          tienda: item.source || 'Tienda',
          precio: num(item.extracted_price ?? item.price),
          link: item.product_link || item.link,
          envio: 'Consultar',
        },
      ];
    }

    productos.push({
      id: id++,
      nombre: item.title,
      categoria: cat,
      imagen: item.thumbnail,
      rating: typeof item.rating === 'number' ? item.rating : null,
      descripcion: descripcion || `${item.title} — comparado en ${ofertas.length} tienda(s).`,
      stock: 5 + ((id * 7) % 26),
      ofertas,
    });
  }
}

const ts =
  `import { Producto } from '../models/producto.model';\n\n` +
  `/**\n * Catálogo semilla de productos REALES cosechados desde Google Shopping (SerpApi).\n` +
  ` * Generado por scripts/harvest.mjs — no editar a mano.\n */\n` +
  `export const PRODUCTOS_SEED: Producto[] = ${JSON.stringify(productos, null, 2)};\n`;

writeFileSync(join(__dirname, '..', 'src', 'app', 'data', 'productos.seed.ts'), ts);
const totalOfertas = productos.reduce((a, p) => a + p.ofertas.length, 0);
console.log(`OK: ${productos.length} productos reales, ${totalOfertas} ofertas horneadas en productos.seed.ts`);

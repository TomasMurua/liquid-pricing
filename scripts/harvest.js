// Uso: SERPAPI_KEY=xxx node scripts/harvest.js
import { writeFileSync } from "node:fs";

const KEY = process.env.SERPAPI_KEY;
if (!KEY) throw new Error("Falta SERPAPI_KEY en el entorno");

const CATEGORIAS = ["notebook", "smartphone", "audífonos", "smartwatch", "monitor"];

async function serp(params) {
  const url = "https://serpapi.com/search.json?" + new URLSearchParams({ ...params, api_key: KEY });
  const r = await fetch(url);
  if (!r.ok) throw new Error(`SerpApi ${r.status}`);
  return r.json();
}

const productos = [];
let id = 1;
for (const q of CATEGORIAS) {
  const shopping = await serp({ engine: "google_shopping", q, gl: "cl", hl: "es", num: "6" });
  for (const item of (shopping.shopping_results || []).slice(0, 4)) {
    let ofertas = [];
    if (item.product_id) {
      try {
        const prod = await serp({ engine: "google_product", product_id: item.product_id, gl: "cl", hl: "es" });
        ofertas = (prod.sellers_results?.online_sellers || []).map(s => ({
          tienda: s.name, precio: s.base_price || s.total_price || item.price, link: s.link, envio: s.additional_price?.shipping || "—",
        }));
      } catch { /* sin product page: usar precio del listado */ }
    }
    if (ofertas.length === 0) ofertas = [{ tienda: item.source || "Tienda", precio: item.price, link: item.link, envio: "—" }];
    productos.push({
      id: id++, nombre: item.title, categoria: q, imagen: item.thumbnail,
      rating: item.rating || null, descripcion: item.snippet || "", ofertas,
    });
  }
}
writeFileSync(new URL("../data/productos.json", import.meta.url), JSON.stringify(productos, null, 2));
console.log(`Escritos ${productos.length} productos.`);

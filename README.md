# Liquid Pricing

Comparador de precios de retailers chilenos (e-commerce) desarrollado en **Angular 19**.
Proyecto de la asignatura **Desarrollo Full Stack II (DSY2202)** — Duoc UC.

Permite comparar el precio de un producto entre varias tiendas (Falabella, Paris, Ripley,
PC Factory, MercadoLibre…), agregar al carrito la mejor oferta y simular la compra. Incluye
dos roles: **cliente** y **administrador** (mantenedores de productos, usuarios e inventario).

## Arquitectura de datos (una base, dos modos)

Los servicios de dominio consultan la fuente según `environment.useBackend`:

| Modo | `useBackend` | Fuente de datos | Build |
|------|-------------|-----------------|-------|
| Semana 6 (estático) | `false` | Arreglos semilla en memoria + `localStorage` | `ng serve` / dev |
| Semana 8 (backend) | `true`  | **Firebase Realtime Database** vía `HttpClient` (GET/POST/PUT/DELETE) | build de producción |

La sesión y el carrito se guardan en `localStorage`. En modo backend, los mantenedores de
administración ejecutan las operaciones REST sobre Firebase.

## Stack

Angular 19 (standalone), TypeScript, RxJS, Bootstrap 5.3 + Bootstrap Icons, Firebase Realtime
Database, Jasmine/Karma (pruebas), Compodoc (documentación), Docker + Nginx, Vercel (despliegue).

## Cómo ejecutar

```bash
npm install

# Desarrollo (modo estático, Semana 6)
npm start                    # http://localhost:4200

# Build de producción (modo Firebase, Semana 8)
npm run build

# Pruebas unitarias (Jasmine/Karma)
npm test                     # abre Chrome
npm run test:ci              # headless

# Documentación (Compodoc)
npm run docs                 # genera ./documentation

# Poblar Firebase con los datos semilla
node scripts/seed-firebase.mjs
```

## Docker

```bash
docker build -t liquid-pricing .
docker run -p 8080:80 liquid-pricing   # http://localhost:8080
```

El `Dockerfile` construye la app y la sirve con Nginx (con fallback SPA a `index.html`).
El despliegue en la nube usa `Dockerfile.vercel` sobre Vercel.

## Credenciales de demo

| Rol | Correo | Contraseña |
|-----|--------|-----------|
| Administrador | `admin@liquid.cl` | `Admin123!` |
| Cliente | `cliente@liquid.cl` | `Cliente123!` |

## Estructura

```
src/app/
  models/        interfaces (Producto, Usuario, Compra…)
  data/          datos semilla
  core/
    services/    Auth, Producto, Usuario, Carrito, Compra
    validators/  RUT chileno, reglas de contraseña
    guards/      sesión y rol
    utils/       formato CLP, mejor precio
  shared/        tarjeta de producto (@Input/@Output)
  features/      auth · catalogo · compra · admin
scripts/         seed de Firebase
```

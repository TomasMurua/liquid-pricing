# Liquid Pricing

E-commerce comparador de precios de retailers chilenos. Proyecto de la asignatura DSY2202 - Desarrollo Full Stack II, DUOC UC.

## Descripción

Liquid Pricing permite comparar precios de un mismo producto entre distintos retailers (Falabella, Ripley, Paris, PC Factory, entre otros), agregar productos al carrito y completar una compra simulada. Los datos provienen de búsquedas reales obtenidas con SerpApi y se almacenan como JSON estático. La API key se usa solo como variable de entorno local y no se incluye en el repositorio.

## Stack

- HTML5, CSS3
- Bootstrap 5.3
- JavaScript vanilla (ES6)
- Sin backend (servidor de archivos estáticos en local)

## Cómo correr el sitio

```bash
cd proyecto
python3 -m http.server 5500
```

Abrir http://localhost:5500 en el navegador.

## Regenerar datos desde SerpApi

```bash
SERPAPI_KEY=tu_clave_aqui node scripts/harvest.js
```

## Estructura de carpetas

```
proyecto/
├── index.html
├── admin/
├── assets/
├── css/
├── data/
├── img/
├── js/
└── scripts/
```

## Roles y credenciales de prueba

| Rol     | Email             | Contraseña  |
|---------|-------------------|-------------|
| Admin   | admin@liquid.cl   | Admin123!   |
| Cliente | cliente@liquid.cl | Cliente123! |

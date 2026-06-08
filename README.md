# Liquid Pricing

E-commerce comparador de precios de retailers chilenos.
Proyecto para la asignatura DSY2202 - Desarrollo Full Stack II, DUOC UC.

## Descripción
Liquid Pricing permite a los usuarios comparar precios de productos entre distintos retailers
(Falabella, Ripley, Paris, etc.), agregar productos al carrito y completar una compra simulada.
Los datos provienen de búsquedas reales cosechadas con SerpApi y almacenados como JSON estático;
la API key **nunca se incluye en el repositorio**.

## Stack
- HTML5, CSS3
- Bootstrap 5.3
- JavaScript vanilla (ES6)
- Sin backend — servidor de archivos estáticos en local

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

> **Seguridad:** la clave NUNCA se commitea al repositorio ni se incluye en ningún archivo
> del frontend. Úsala solo como variable de entorno al ejecutar el script localmente.

## Estructura de carpetas

```
proyecto/
├── index.html          # Página principal / catálogo
├── admin/              # Módulo de administración (solo rol admin)
├── assets/             # Fuentes, íconos y recursos estáticos
├── css/                # Hojas de estilo
├── data/               # JSON estático con productos cosechados
├── img/                # Imágenes de productos y marca
├── js/                 # Módulos JavaScript
└── scripts/            # Scripts de Node.js para cosechar datos (no van al frontend)
```

## Roles y credenciales de prueba

| Rol     | Email                 | Contraseña  |
|---------|-----------------------|-------------|
| Admin   | admin@liquid.cl       | Admin123!   |
| Cliente | cliente@liquid.cl     | Cliente123! |

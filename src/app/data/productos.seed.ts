import { Producto } from '../models/producto.model';

/**
 * Catálogo semilla de productos (datos reales pre-cosechados de retailers chilenos).
 * Usado en modo estático (Semana 6) y como base para poblar Firebase (Semana 8).
 */
export const PRODUCTOS_SEED: Producto[] = [
  {
    id: 1,
    nombre: 'Notebook Lenovo IdeaPad 3 15.6" Ryzen 5 5500U 8GB 512GB SSD',
    categoria: 'notebook',
    imagen: 'https://placehold.co/400x300?text=Lenovo+IdeaPad+3',
    rating: 4.3,
    descripcion:
      'Notebook con procesador AMD Ryzen 5 5500U, pantalla Full HD 15.6", 8GB RAM DDR4 y 512GB SSD. Ideal para trabajo y estudios.',
    stock: 12,
    ofertas: [
      { tienda: 'Falabella', precio: 449990, link: 'https://www.falabella.com', envio: 'Gratis' },
      { tienda: 'Paris', precio: 469990, link: 'https://www.paris.cl', envio: '$3.990' },
      { tienda: 'Ripley', precio: 459990, link: 'https://www.ripley.cl', envio: 'Gratis' },
      { tienda: 'PC Factory', precio: 444990, link: 'https://www.pcfactory.cl', envio: '$4.990' },
    ],
  },
  {
    id: 2,
    nombre: 'Notebook HP Pavilion 14" Intel Core i5-1235U 16GB 512GB SSD',
    categoria: 'notebook',
    imagen: 'https://placehold.co/400x300?text=HP+Pavilion+14',
    rating: 4.1,
    descripcion:
      'Notebook delgado y liviano con Intel Core i5 de 12va generación, 16GB RAM y almacenamiento SSD de 512GB.',
    stock: 8,
    ofertas: [
      { tienda: 'Falabella', precio: 529990, link: 'https://www.falabella.com', envio: 'Gratis' },
      { tienda: 'MercadoLibre', precio: 499990, link: 'https://www.mercadolibre.cl', envio: '$2.990' },
      { tienda: 'Linio', precio: 515990, link: 'https://www.linio.cl', envio: 'Gratis' },
    ],
  },
  {
    id: 3,
    nombre: 'Smartphone Samsung Galaxy A55 5G 256GB 8GB RAM',
    categoria: 'smartphone',
    imagen: 'https://placehold.co/400x300?text=Samsung+Galaxy+A55',
    rating: 4.6,
    descripcion:
      'Smartphone con pantalla Super AMOLED 6.6", cámara triple de 50MP, batería de 5000mAh y conectividad 5G.',
    stock: 20,
    ofertas: [
      { tienda: 'Falabella', precio: 389990, link: 'https://www.falabella.com', envio: 'Gratis' },
      { tienda: 'Paris', precio: 399990, link: 'https://www.paris.cl', envio: 'Gratis' },
      { tienda: 'Ripley', precio: 379990, link: 'https://www.ripley.cl', envio: '$2.990' },
    ],
  },
  {
    id: 4,
    nombre: 'Smartphone Motorola Edge 40 Neo 5G 256GB 12GB RAM',
    categoria: 'smartphone',
    imagen: 'https://placehold.co/400x300?text=Motorola+Edge+40',
    rating: 4.2,
    descripcion:
      'Smartphone con pantalla pOLED 6.55", procesador MediaTek Dimensity 7030, cámara de 50MP y Android 13.',
    stock: 15,
    ofertas: [
      { tienda: 'MercadoLibre', precio: 269990, link: 'https://www.mercadolibre.cl', envio: 'Gratis' },
      { tienda: 'Linio', precio: 279990, link: 'https://www.linio.cl', envio: '$3.990' },
      { tienda: 'Falabella', precio: 289990, link: 'https://www.falabella.com', envio: 'Gratis' },
    ],
  },
  {
    id: 5,
    nombre: 'Audífonos Sony WH-1000XM5 Noise Cancelling Inalámbrico',
    categoria: 'audífonos',
    imagen: 'https://placehold.co/400x300?text=Sony+WH-1000XM5',
    rating: 4.8,
    descripcion:
      'Audífonos over-ear con cancelación de ruido líder en la industria, hasta 30 horas de batería y audio de alta resolución.',
    stock: 25,
    ofertas: [
      { tienda: 'Falabella', precio: 279990, link: 'https://www.falabella.com', envio: 'Gratis' },
      { tienda: 'Paris', precio: 299990, link: 'https://www.paris.cl', envio: 'Gratis' },
      { tienda: 'PC Factory', precio: 269990, link: 'https://www.pcfactory.cl', envio: '$4.990' },
    ],
  },
  {
    id: 6,
    nombre: 'Audífonos JBL Tune 770NC Bluetooth Over-Ear',
    categoria: 'audífonos',
    imagen: 'https://placehold.co/400x300?text=JBL+Tune+770NC',
    rating: 4.0,
    descripcion:
      'Audífonos inalámbricos con cancelación de ruido adaptativa, hasta 70 horas de reproducción y carga rápida.',
    stock: 30,
    ofertas: [
      { tienda: 'Ripley', precio: 79990, link: 'https://www.ripley.cl', envio: 'Gratis' },
      { tienda: 'MercadoLibre', precio: 74990, link: 'https://www.mercadolibre.cl', envio: '$2.990' },
      { tienda: 'Linio', precio: 82990, link: 'https://www.linio.cl', envio: 'Gratis' },
      { tienda: 'Falabella', precio: 84990, link: 'https://www.falabella.com', envio: 'Gratis' },
    ],
  },
  {
    id: 7,
    nombre: 'Smartwatch Apple Watch Series 9 GPS 41mm Aluminio',
    categoria: 'smartwatch',
    imagen: 'https://placehold.co/400x300?text=Apple+Watch+S9',
    rating: 4.7,
    descripcion:
      'Smartwatch con chip S9, pantalla Retina siempre activa, seguimiento de salud avanzado y hasta 18 horas de batería.',
    stock: 10,
    ofertas: [
      { tienda: 'Falabella', precio: 379990, link: 'https://www.falabella.com', envio: 'Gratis' },
      { tienda: 'Paris', precio: 389990, link: 'https://www.paris.cl', envio: 'Gratis' },
      { tienda: 'Ripley', precio: 374990, link: 'https://www.ripley.cl', envio: 'Gratis' },
    ],
  },
  {
    id: 8,
    nombre: 'Smartwatch Samsung Galaxy Watch 6 44mm Bluetooth',
    categoria: 'smartwatch',
    imagen: 'https://placehold.co/400x300?text=Samsung+Watch+6',
    rating: 4.3,
    descripcion:
      'Smartwatch con pantalla Super AMOLED 1.5", análisis avanzado del sueño, seguimiento de salud y batería de 40 horas.',
    stock: 14,
    ofertas: [
      { tienda: 'Falabella', precio: 199990, link: 'https://www.falabella.com', envio: 'Gratis' },
      { tienda: 'MercadoLibre', precio: 189990, link: 'https://www.mercadolibre.cl', envio: '$2.990' },
      { tienda: 'PC Factory', precio: 194990, link: 'https://www.pcfactory.cl', envio: '$4.990' },
    ],
  },
  {
    id: 9,
    nombre: 'Monitor LG 27" IPS 4K UHD 27UK850-W USB-C',
    categoria: 'monitor',
    imagen: 'https://placehold.co/400x300?text=LG+27UK850',
    rating: 4.5,
    descripcion:
      'Monitor 4K IPS con puerto USB-C (65W PD), HDR10, cobertura 99% sRGB y compatibilidad FreeSync.',
    stock: 7,
    ofertas: [
      { tienda: 'PC Factory', precio: 349990, link: 'https://www.pcfactory.cl', envio: '$5.990' },
      { tienda: 'Falabella', precio: 369990, link: 'https://www.falabella.com', envio: 'Gratis' },
      { tienda: 'Linio', precio: 359990, link: 'https://www.linio.cl', envio: 'Gratis' },
      { tienda: 'MercadoLibre', precio: 339990, link: 'https://www.mercadolibre.cl', envio: '$3.990' },
    ],
  },
  {
    id: 10,
    nombre: 'Monitor Samsung 24" FHD IPS 75Hz LF24T350FHLXZS',
    categoria: 'monitor',
    imagen: 'https://placehold.co/400x300?text=Samsung+24+FHD',
    rating: null,
    descripcion:
      'Monitor Full HD 24" con panel IPS, tasa de refresco 75Hz, tecnología Eye Saver Mode y Flicker Free.',
    stock: 18,
    ofertas: [
      { tienda: 'Falabella', precio: 139990, link: 'https://www.falabella.com', envio: 'Gratis' },
      { tienda: 'Ripley', precio: 129990, link: 'https://www.ripley.cl', envio: '$2.990' },
      { tienda: 'Paris', precio: 134990, link: 'https://www.paris.cl', envio: 'Gratis' },
    ],
  },
  {
    id: 11,
    nombre: 'Notebook ASUS VivoBook 15 Intel Core i7-1255U 16GB 1TB SSD',
    categoria: 'notebook',
    imagen: 'https://placehold.co/400x300?text=ASUS+VivoBook+15',
    rating: 4.4,
    descripcion:
      'Notebook con procesador Intel Core i7 de 12va generación, pantalla FHD 15.6", 16GB RAM y 1TB SSD NVMe.',
    stock: 5,
    ofertas: [
      { tienda: 'PC Factory', precio: 599990, link: 'https://www.pcfactory.cl', envio: '$4.990' },
      { tienda: 'Falabella', precio: 629990, link: 'https://www.falabella.com', envio: 'Gratis' },
      { tienda: 'MercadoLibre', precio: 589990, link: 'https://www.mercadolibre.cl', envio: '$2.990' },
    ],
  },
  {
    id: 12,
    nombre: 'Smartphone Xiaomi Redmi Note 13 Pro 5G 256GB 8GB RAM',
    categoria: 'smartphone',
    imagen: 'https://placehold.co/400x300?text=Xiaomi+Redmi+Note+13',
    rating: null,
    descripcion:
      'Smartphone con cámara de 200MP, pantalla AMOLED 6.67" 120Hz, batería de 5100mAh y carga turbo de 67W.',
    stock: 22,
    ofertas: [
      { tienda: 'MercadoLibre', precio: 219990, link: 'https://www.mercadolibre.cl', envio: 'Gratis' },
      { tienda: 'Linio', precio: 229990, link: 'https://www.linio.cl', envio: '$3.990' },
      { tienda: 'Ripley', precio: 224990, link: 'https://www.ripley.cl', envio: 'Gratis' },
    ],
  },
];

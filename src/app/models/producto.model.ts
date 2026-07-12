/**
 * Una oferta de un retailer para un producto (precio, tienda y envío).
 */
export interface Oferta {
  tienda: string;
  precio: number;
  link: string;
  envio: string;
}

/**
 * Producto del catálogo con sus ofertas de distintos retailers.
 * `key` es la clave de Firebase (solo presente al consumir desde el backend);
 * `id` es el identificador de negocio usado en el catálogo y las rutas.
 */
export interface Producto {
  key?: string;
  id: number;
  nombre: string;
  categoria: string;
  imagen: string;
  rating: number | null;
  descripcion: string;
  ofertas: Oferta[];
  stock?: number;
}

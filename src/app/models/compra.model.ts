/**
 * Ítem del carrito: representa una oferta concreta (tienda + precio) elegida
 * para un producto, junto con la cantidad.
 */
export interface ItemCarrito {
  productoId: number;
  nombre: string;
  imagen: string;
  tienda: string;
  precio: number;
  link: string;
  cantidad: number;
}

/** Datos de envío capturados en el checkout (pago simulado). */
export interface DatosEnvio {
  nombre: string;
  direccion: string;
  ciudad: string;
  telefono: string;
}

/**
 * Orden de compra registrada tras un checkout exitoso.
 */
export interface Compra {
  id: number;
  fecha: string;
  email: string;
  items: ItemCarrito[];
  total: number;
  envio: DatosEnvio | null;
  estado: string;
}

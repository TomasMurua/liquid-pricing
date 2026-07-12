import { Producto } from '../../models/producto.model';

/**
 * Formatea un número como precio chileno (CLP) sin decimales.
 * @param n Monto a formatear.
 * @returns Cadena tipo `"$499.990"`.
 */
export function formatoCLP(n: number): string {
  const valor = Math.round(Number(n));
  return '$' + valor.toLocaleString('es-CL', { maximumFractionDigits: 0 });
}

/**
 * Retorna el precio más bajo entre todas las ofertas de un producto.
 * @param producto Producto con su arreglo de ofertas.
 * @returns El menor precio, o 0 si no hay ofertas.
 */
export function mejorPrecio(producto: Producto): number {
  if (!producto?.ofertas?.length) return 0;
  return Math.min(...producto.ofertas.map((o) => o.precio));
}

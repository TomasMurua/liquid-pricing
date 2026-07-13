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

/**
 * Retorna el precio más alto entre las ofertas del producto.
 * @param producto Producto con su arreglo de ofertas.
 * @returns El mayor precio, o 0 si no hay ofertas.
 */
export function precioMaximo(producto: Producto): number {
  if (!producto?.ofertas?.length) return 0;
  return Math.max(...producto.ofertas.map((o) => o.precio));
}

/**
 * Retorna el nombre de la tienda con el precio más bajo.
 * @param producto Producto con su arreglo de ofertas.
 */
export function tiendaMasBarata(producto: Producto): string {
  if (!producto?.ofertas?.length) return '';
  return producto.ofertas.reduce((min, o) => (o.precio < min.precio ? o : min)).tienda;
}

/**
 * Ahorro absoluto entre el precio más caro y el más barato del producto.
 * @param producto Producto con su arreglo de ofertas.
 */
export function ahorro(producto: Producto): number {
  return precioMaximo(producto) - mejorPrecio(producto);
}

/**
 * Ahorro porcentual respecto del precio más caro (0–100).
 * @param producto Producto con su arreglo de ofertas.
 */
export function ahorroPct(producto: Producto): number {
  const max = precioMaximo(producto);
  return max > 0 ? Math.round((ahorro(producto) / max) * 100) : 0;
}

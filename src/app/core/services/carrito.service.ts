import { Injectable, computed, signal } from '@angular/core';
import { ItemCarrito } from '../../models/compra.model';
import { Producto, Oferta } from '../../models/producto.model';

const LS_CARRITO = 'lp_carrito';

/**
 * @description
 * Carrito de compras persistido en `localStorage`. Expone `items`, `cantidad`
 * y `total` como signals para que el navbar y las vistas reaccionen a los cambios.
 */
@Injectable({ providedIn: 'root' })
export class CarritoService {
  /** Ítems actuales del carrito. */
  readonly items = signal<ItemCarrito[]>(this.leer());

  /** Cantidad total de unidades (para el badge del navbar). */
  readonly cantidad = computed(() => this.items().reduce((acc, i) => acc + i.cantidad, 0));

  /** Suma de precio × cantidad de todos los ítems. */
  readonly total = computed(() => this.items().reduce((acc, i) => acc + i.precio * i.cantidad, 0));

  /**
   * Agrega una oferta de un producto al carrito. Si ya existe un ítem con el
   * mismo producto y tienda, incrementa su cantidad.
   * @param producto Producto elegido.
   * @param oferta Oferta (tienda/precio) seleccionada.
   * @param cantidad Unidades a agregar (por defecto 1).
   */
  agregar(producto: Producto, oferta: Oferta, cantidad = 1): void {
    const items = [...this.items()];
    const idx = items.findIndex((i) => i.productoId === producto.id && i.tienda === oferta.tienda);
    if (idx >= 0) {
      items[idx] = { ...items[idx], cantidad: items[idx].cantidad + cantidad };
    } else {
      items.push({
        productoId: producto.id,
        nombre: producto.nombre,
        imagen: producto.imagen,
        tienda: oferta.tienda,
        precio: oferta.precio,
        link: oferta.link,
        cantidad,
      });
    }
    this.persistir(items);
  }

  /**
   * Cambia la cantidad de un ítem (mínimo 1).
   * @param index Posición del ítem.
   * @param nuevaCantidad Nueva cantidad.
   */
  cambiarCantidad(index: number, nuevaCantidad: number): void {
    const items = [...this.items()];
    if (items[index]) {
      items[index] = { ...items[index], cantidad: Math.max(1, nuevaCantidad) };
      this.persistir(items);
    }
  }

  /**
   * Elimina el ítem en la posición indicada.
   * @param index Posición del ítem a quitar.
   */
  quitar(index: number): void {
    const items = this.items().filter((_, i) => i !== index);
    this.persistir(items);
  }

  /** Vacía el carrito. */
  vaciar(): void {
    this.persistir([]);
  }

  private persistir(items: ItemCarrito[]): void {
    this.items.set(items);
    localStorage.setItem(LS_CARRITO, JSON.stringify(items));
  }

  private leer(): ItemCarrito[] {
    try {
      const raw = localStorage.getItem(LS_CARRITO);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  }
}

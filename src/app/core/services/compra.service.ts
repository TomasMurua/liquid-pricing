import { Injectable, inject } from '@angular/core';
import { Compra, DatosEnvio } from '../../models/compra.model';
import { AuthService } from './auth.service';
import { CarritoService } from './carrito.service';

const LS_COMPRAS = 'lp_compras';

/**
 * @description
 * Historial de compras persistido en `localStorage`. Registra la orden a partir
 * del carrito y el usuario en sesión (pago simulado, sin pasarela real).
 */
@Injectable({ providedIn: 'root' })
export class CompraService {
  private auth = inject(AuthService);
  private carrito = inject(CarritoService);

  /**
   * Registra una compra con el contenido actual del carrito y lo vacía.
   * @param envio Datos de envío capturados en el checkout.
   * @returns La orden registrada con estado "Pagado".
   */
  registrar(envio: DatosEnvio | null): Compra {
    const orden: Compra = {
      id: Date.now(),
      fecha: new Date().toISOString(),
      email: this.auth.usuarioActual()?.email ?? '',
      items: this.carrito.items(),
      total: this.carrito.total(),
      envio,
      estado: 'Pagado',
    };
    const compras = this.leer();
    compras.push(orden);
    localStorage.setItem(LS_COMPRAS, JSON.stringify(compras));
    this.carrito.vaciar();
    return orden;
  }

  /** Retorna las órdenes del usuario en sesión. */
  porUsuario(): Compra[] {
    const email = this.auth.usuarioActual()?.email;
    return email ? this.leer().filter((o) => o.email === email) : [];
  }

  private leer(): Compra[] {
    try {
      const raw = localStorage.getItem(LS_COMPRAS);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  }
}

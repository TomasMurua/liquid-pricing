import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { CompraService } from '../../core/services/compra.service';
import { formatoCLP } from '../../core/utils/formato';
import { Compra } from '../../models/compra.model';

/**
 * @description
 * Historial de compras del usuario en sesión. Muestra las órdenes de la más
 * reciente a la más antigua, con su detalle de ítems y total.
 */
@Component({
  selector: 'app-mis-compras',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="container py-4">
      <h1 class="h3 mb-4"><i class="bi bi-bag-check me-2"></i>Mis compras</h1>

      <!-- Estado vacío -->
      <div *ngIf="compras.length === 0" class="lp-card text-center py-5">
        <i class="bi bi-receipt display-4 text-muted d-block mb-3"></i>
        <p class="lp-card-title mb-1">Aún no tienes compras</p>
        <p class="text-muted mb-4">Cuando realices una compra, aparecerá aquí tu historial.</p>
        <a routerLink="/" class="btn btn-lp-accent">
          <i class="bi bi-shop me-2"></i>Ir al catálogo
        </a>
      </div>

      <!-- Listado de órdenes -->
      <div class="row g-3" *ngIf="compras.length > 0">
        <div class="col-12" *ngFor="let orden of compras">
          <div class="lp-card">
            <div class="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-3">
              <div>
                <span class="fw-semibold">Orden #{{ orden.id }}</span>
                <small class="text-muted ms-2">{{ orden.fecha | date: 'dd/MM/yyyy HH:mm' }}</small>
              </div>
              <span class="badge text-bg-success">{{ orden.estado }}</span>
            </div>

            <ul class="list-group list-group-flush mb-3">
              <li
                class="list-group-item d-flex justify-content-between align-items-start px-0"
                *ngFor="let item of orden.items"
              >
                <div class="me-2">
                  <p class="mb-0 fw-semibold">{{ item.nombre }}</p>
                  <small class="text-muted">{{ item.tienda }} · {{ item.cantidad }} u.</small>
                </div>
                <span class="text-nowrap">{{ formatoCLP(item.precio * item.cantidad) }}</span>
              </li>
            </ul>

            <div class="d-flex justify-content-between align-items-center">
              <span class="fw-bold">Total</span>
              <span class="h5 mb-0">{{ formatoCLP(orden.total) }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
})
export class MisComprasComponent {
  private compra = inject(CompraService);
  readonly formatoCLP = formatoCLP;
  readonly compras: Compra[] = [...this.compra.porUsuario()].sort((a, b) => b.id - a.id);
}

import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { formatoCLP } from '../../core/utils/formato';
import { Compra } from '../../models/compra.model';

/**
 * @description
 * Confirmación de compra (pago simulado). Lee la orden desde el estado de
 * navegación entregado por el checkout; si no la encuentra, muestra un mensaje
 * genérico con un enlace de vuelta al catálogo.
 */
@Component({
  selector: 'app-confirmacion',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="container py-4">
      <!-- Con orden -->
      <div *ngIf="orden; else sinOrden" class="mx-auto" style="max-width: 640px">
        <div class="lp-card text-center py-5">
          <i class="bi bi-check-circle-fill display-1 text-success d-block mb-3"></i>
          <h1 class="h3 mb-1">¡Pago realizado con éxito!</h1>
          <p class="text-muted mb-0">Tu compra fue registrada (pago simulado).</p>
        </div>

        <div class="lp-card mt-4">
          <div class="row g-3 mb-3">
            <div class="col-6 col-md-4">
              <small class="text-muted d-block">N° de orden</small>
              <span class="fw-semibold">#{{ orden.id }}</span>
            </div>
            <div class="col-6 col-md-4">
              <small class="text-muted d-block">Fecha</small>
              <span class="fw-semibold">{{ orden.fecha | date: 'dd/MM/yyyy HH:mm' }}</span>
            </div>
            <div class="col-6 col-md-4">
              <small class="text-muted d-block">Estado</small>
              <span class="badge text-bg-success">{{ orden.estado }}</span>
            </div>
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
            <span class="fw-bold">Total pagado</span>
            <span class="h5 mb-0">{{ formatoCLP(orden.total) }}</span>
          </div>
        </div>

        <div class="d-flex flex-column flex-sm-row gap-2 mt-4">
          <a routerLink="/mis-compras" class="btn btn-lp-accent flex-fill">
            <i class="bi bi-bag-check me-2"></i>Ver mis compras
          </a>
          <a routerLink="/" class="btn btn-outline-secondary flex-fill">
            <i class="bi bi-shop me-2"></i>Seguir comprando
          </a>
        </div>
      </div>

      <!-- Sin orden -->
      <ng-template #sinOrden>
        <div class="lp-card text-center py-5 mx-auto" style="max-width: 640px">
          <i class="bi bi-receipt display-4 text-muted d-block mb-3"></i>
          <p class="lp-card-title mb-1">No hay una orden para mostrar</p>
          <p class="text-muted mb-4">Es posible que hayas recargado la página o accedido directamente.</p>
          <a routerLink="/" class="btn btn-lp-accent">
            <i class="bi bi-shop me-2"></i>Ir al catálogo
          </a>
        </div>
      </ng-template>
    </div>
  `,
})
export class ConfirmacionComponent {
  private router = inject(Router);
  readonly formatoCLP = formatoCLP;
  readonly orden: Compra | null;

  constructor() {
    const nav = this.router.getCurrentNavigation();
    this.orden = nav?.extras?.state?.['orden'] ?? history.state?.orden ?? null;
  }
}

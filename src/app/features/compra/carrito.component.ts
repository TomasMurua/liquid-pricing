import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { CarritoService } from '../../core/services/carrito.service';
import { formatoCLP } from '../../core/utils/formato';

/**
 * @description
 * Vista del carrito de compras. Lista los ítems agregados, permite ajustar
 * cantidades, quitar productos o vaciar el carrito, y muestra el total antes
 * de avanzar al checkout.
 */
@Component({
  selector: 'app-carrito',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="container py-4">
      <h1 class="h3 mb-4"><i class="bi bi-cart3 me-2"></i>Mi carrito</h1>

      <!-- Estado vacío -->
      <div *ngIf="carrito.items().length === 0" class="lp-card text-center py-5">
        <i class="bi bi-cart-x display-4 text-muted d-block mb-3"></i>
        <p class="lp-card-title mb-1">Tu carrito está vacío</p>
        <p class="text-muted mb-4">Explora el catálogo y agrega productos para comparar precios.</p>
        <a routerLink="/" class="btn btn-lp-accent">
          <i class="bi bi-shop me-2"></i>Ir al catálogo
        </a>
      </div>

      <!-- Con ítems -->
      <div *ngIf="carrito.items().length > 0">
        <div class="row g-3">
          <div class="col-12" *ngFor="let item of carrito.items(); let i = index">
            <div class="lp-card">
              <div class="row g-3 align-items-center">
                <div class="col-4 col-sm-2">
                  <img [src]="item.imagen" [alt]="item.nombre" class="img-fluid rounded" />
                </div>

                <div class="col-8 col-sm-4">
                  <p class="lp-card-title mb-1">{{ item.nombre }}</p>
                  <span class="badge bg-light text-dark border">
                    <i class="bi bi-shop-window me-1"></i>{{ item.tienda }}
                  </span>
                  <p class="text-muted small mb-0 mt-2">{{ formatoCLP(item.precio) }} c/u</p>
                </div>

                <div class="col-6 col-sm-3">
                  <div class="input-group input-group-sm" style="max-width: 140px">
                    <button
                      type="button"
                      class="btn btn-outline-secondary"
                      (click)="carrito.cambiarCantidad(i, item.cantidad - 1)"
                      [disabled]="item.cantidad <= 1"
                      aria-label="Disminuir cantidad"
                    >
                      <i class="bi bi-dash"></i>
                    </button>
                    <input
                      type="number"
                      min="1"
                      class="form-control text-center"
                      [(ngModel)]="item.cantidad"
                      (ngModelChange)="carrito.cambiarCantidad(i, item.cantidad)"
                      aria-label="Cantidad"
                    />
                    <button
                      type="button"
                      class="btn btn-outline-secondary"
                      (click)="carrito.cambiarCantidad(i, item.cantidad + 1)"
                      aria-label="Aumentar cantidad"
                    >
                      <i class="bi bi-plus"></i>
                    </button>
                  </div>
                </div>

                <div class="col-6 col-sm-2 text-end">
                  <p class="fw-bold mb-0">{{ formatoCLP(item.precio * item.cantidad) }}</p>
                </div>

                <div class="col-12 col-sm-1 text-end">
                  <button
                    type="button"
                    class="btn btn-sm btn-outline-danger"
                    (click)="carrito.quitar(i)"
                    aria-label="Quitar producto"
                  >
                    <i class="bi bi-trash"></i>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Resumen y acciones -->
        <div class="lp-card mt-4">
          <div class="d-flex flex-column flex-sm-row justify-content-between align-items-sm-center gap-3">
            <div>
              <span class="text-muted">Total ({{ carrito.cantidad() }} unidades)</span>
              <p class="h4 mb-0">{{ formatoCLP(carrito.total()) }}</p>
            </div>
            <div class="d-flex gap-2">
              <button type="button" class="btn btn-outline-secondary" (click)="carrito.vaciar()">
                <i class="bi bi-trash me-2"></i>Vaciar carrito
              </button>
              <a
                routerLink="/checkout"
                class="btn btn-lp-accent"
                [class.disabled]="carrito.items().length === 0"
              >
                <i class="bi bi-bag-check me-2"></i>Ir a pagar
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
})
export class CarritoComponent {
  readonly carrito = inject(CarritoService);
  readonly formatoCLP = formatoCLP;
}

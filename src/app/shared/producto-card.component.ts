import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Producto } from '../models/producto.model';
import { formatoCLP, mejorPrecio } from '../core/utils/formato';

/**
 * Tarjeta presentacional de un producto del catálogo. Muestra imagen, nombre,
 * categoría, valoración, mejor precio y número de tiendas. Emite `agregar`
 * cuando el usuario pulsa el botón de agregar al carrito.
 */
@Component({
  selector: 'app-producto-card',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="col">
      <article class="lp-card h-100 d-flex flex-column">
        <img
          [src]="producto.imagen"
          [alt]="producto.nombre"
          class="img-fluid rounded mb-3"
        />

        <h3 class="lp-card-title h6">{{ producto.nombre }}</h3>

        <div class="mb-2">
          <span class="badge text-bg-light text-uppercase">{{ producto.categoria }}</span>
        </div>

        <div class="mb-2">
          <ng-container *ngIf="producto.rating != null; else sinRating">
            <span class="estrellas">
              <i *ngFor="let i of estrellas" [class]="estrellaClase(i)"></i>
            </span>
            <span class="ms-1 text-muted small">{{ producto.rating }}</span>
          </ng-container>
          <ng-template #sinRating>
            <span class="sin-rating">Sin valoraciones</span>
          </ng-template>
        </div>

        <p class="mb-1">Desde <strong>{{ formatoCLP(mejorPrecio(producto)) }}</strong></p>
        <p class="text-muted small mb-3">
          <i class="bi bi-shop"></i> {{ producto.ofertas.length }} tiendas
        </p>

        <div class="mt-auto d-flex gap-2">
          <a class="btn btn-outline-secondary flex-fill" [routerLink]="['/producto', producto.id]">
            <i class="bi bi-eye"></i> Ver detalle
          </a>
          <button type="button" class="btn btn-lp-accent flex-fill" (click)="agregar.emit(producto)">
            <i class="bi bi-cart-plus"></i> Agregar
          </button>
        </div>
      </article>
    </div>
  `,
})
export class ProductoCardComponent {
  @Input() producto!: Producto;
  @Output() agregar = new EventEmitter<Producto>();

  readonly estrellas = [1, 2, 3, 4, 5];
  readonly formatoCLP = formatoCLP;
  readonly mejorPrecio = mejorPrecio;

  /** Devuelve la clase del ícono de estrella según la valoración del producto. */
  estrellaClase(indice: number): string {
    const valor = this.producto.rating ?? 0;
    return indice <= Math.round(valor) ? 'bi bi-star-fill' : 'bi bi-star star-vacio';
  }
}

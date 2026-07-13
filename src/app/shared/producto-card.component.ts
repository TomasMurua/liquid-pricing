import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Producto } from '../models/producto.model';
import { formatoCLP, mejorPrecio, tiendaMasBarata, ahorro } from '../core/utils/formato';

/**
 * Tarjeta presentacional de un producto del catálogo. Pone el precio y el
 * ahorro entre tiendas al centro (la propuesta de valor del comparador).
 * Emite `agregar` cuando el usuario pulsa el botón de agregar al carrito.
 */
@Component({
  selector: 'app-producto-card',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="col">
      <article class="lp-card lp-card--producto h-100">
        <div class="lp-card__media">
          <img [src]="producto.imagen" [alt]="producto.nombre" loading="lazy" />
          <span class="lp-chip--cat">{{ producto.categoria }}</span>
        </div>

        <div class="lp-card__body">
          <h3 class="lp-card-title">{{ producto.nombre }}</h3>

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

          <div class="lp-precio">
            <span class="lp-precio__label">Mejor precio</span>
            <span class="lp-precio__valor">{{ formatoCLP(mejorPrecio(producto)) }}</span>
            <span class="lp-precio__tienda">en {{ tiendaMasBarata(producto) }}</span>
          </div>

          <div class="lp-metrica">
            <span class="lp-ahorro" *ngIf="ahorro(producto) > 0">
              <i class="bi bi-graph-down-arrow"></i> Ahorra {{ formatoCLP(ahorro(producto)) }}
            </span>
            <span class="lp-tiendas">
              <i class="bi bi-shop"></i>
              {{ producto.ofertas.length }} {{ producto.ofertas.length === 1 ? 'tienda' : 'tiendas' }}
            </span>
          </div>

          <div class="lp-card__acciones">
            <a class="btn btn-outline-secondary" [routerLink]="['/producto', producto.id]">
              <i class="bi bi-bar-chart-line"></i> Comparar
            </a>
            <button type="button" class="btn btn-lp-accent" (click)="agregar.emit(producto)">
              <i class="bi bi-cart-plus"></i> Agregar
            </button>
          </div>
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
  readonly tiendaMasBarata = tiendaMasBarata;
  readonly ahorro = ahorro;

  /** Devuelve la clase del ícono de estrella según la valoración del producto. */
  estrellaClase(indice: number): string {
    const valor = this.producto.rating ?? 0;
    return indice <= Math.round(valor) ? 'bi bi-star-fill' : 'bi bi-star star-vacio';
  }
}

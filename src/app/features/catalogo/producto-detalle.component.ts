import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ProductoService } from '../../core/services/producto.service';
import { CarritoService } from '../../core/services/carrito.service';
import { AuthService } from '../../core/services/auth.service';
import { formatoCLP, mejorPrecio } from '../../core/utils/formato';
import { Producto, Oferta } from '../../models/producto.model';

/**
 * Detalle de un producto: imagen, descripción y valoración, más una tabla de
 * comparación de precios entre retailers ordenada de menor a mayor. Cada oferta
 * puede agregarse al carrito (requiere sesión de cliente) o abrirse en la tienda.
 */
@Component({
  selector: 'app-producto-detalle',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="container py-4">
      <a class="btn btn-link px-0 mb-3" routerLink="/">
        <i class="bi bi-arrow-left"></i> Volver al catálogo
      </a>

      <ng-container *ngIf="cargado">
        <div *ngIf="producto; else noEncontrado" class="row g-4">
          <div class="col-12 col-md-5">
            <img [src]="producto.imagen" [alt]="producto.nombre" class="img-fluid rounded" />
          </div>

          <div class="col-12 col-md-7">
            <span class="badge text-bg-light text-uppercase mb-2">{{ producto.categoria }}</span>
            <h1 class="h3">{{ producto.nombre }}</h1>

            <div class="mb-3">
              <ng-container *ngIf="producto.rating != null; else sinRating">
                <span class="estrellas">
                  <i *ngFor="let i of estrellas" [class]="estrellaClase(i)"></i>
                </span>
                <span class="ms-1 text-muted">{{ producto.rating }}</span>
              </ng-container>
              <ng-template #sinRating>
                <span class="sin-rating">Sin valoraciones</span>
              </ng-template>
            </div>

            <p>{{ producto.descripcion }}</p>
            <p class="fs-5">Desde <strong>{{ formatoCLP(mejorPrecio(producto)) }}</strong></p>
          </div>

          <div class="col-12">
            <h2 class="h5 mt-3 mb-3">Comparación de precios</h2>
            <div class="table-responsive">
              <table class="table table-hover align-middle">
                <thead>
                  <tr>
                    <th scope="col">Tienda</th>
                    <th scope="col">Precio</th>
                    <th scope="col">Envío</th>
                    <th scope="col" class="text-end">Acción</th>
                  </tr>
                </thead>
                <tbody>
                  <tr *ngFor="let o of ofertasOrdenadas">
                    <td>
                      {{ o.tienda }}
                      <span *ngIf="esMejorPrecio(o)" class="badge text-bg-success ms-2">
                        Mejor precio
                      </span>
                    </td>
                    <td><strong>{{ formatoCLP(o.precio) }}</strong></td>
                    <td>{{ o.envio }}</td>
                    <td class="text-end">
                      <div class="d-flex gap-2 justify-content-end">
                        <a
                          class="btn btn-sm btn-outline-secondary"
                          [href]="o.link"
                          target="_blank"
                          rel="noopener"
                        >
                          <i class="bi bi-box-arrow-up-right"></i> Ir a la tienda
                        </a>
                        <button type="button" class="btn btn-sm btn-lp-accent" (click)="agregar(o)">
                          <i class="bi bi-cart-plus"></i> Agregar
                        </button>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <ng-template #noEncontrado>
          <div class="text-center text-muted py-5">
            <i class="bi bi-exclamation-circle display-6 d-block mb-2"></i>
            <p class="mb-3">Producto no encontrado.</p>
            <a class="btn btn-lp-accent" routerLink="/">Volver al catálogo</a>
          </div>
        </ng-template>
      </ng-container>
    </div>

    <div
      *ngIf="mostrarToast"
      class="toast align-items-center text-bg-success border-0 show position-fixed bottom-0 end-0 m-4"
      role="alert"
    >
      <div class="d-flex">
        <div class="toast-body"><i class="bi bi-check-circle"></i> Agregado al carrito</div>
      </div>
    </div>
  `,
})
export class ProductoDetalleComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private productoService = inject(ProductoService);
  private carrito = inject(CarritoService);
  private auth = inject(AuthService);

  producto?: Producto;
  cargado = false;
  mostrarToast = false;

  readonly estrellas = [1, 2, 3, 4, 5];
  readonly formatoCLP = formatoCLP;
  readonly mejorPrecio = mejorPrecio;

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.productoService.obtener(id).subscribe((p) => {
      this.producto = p;
      this.cargado = true;
    });
  }

  /** Ofertas del producto ordenadas por precio ascendente. */
  get ofertasOrdenadas(): Oferta[] {
    return this.producto ? [...this.producto.ofertas].sort((a, b) => a.precio - b.precio) : [];
  }

  /** Indica si una oferta corresponde al precio más bajo del producto. */
  esMejorPrecio(oferta: Oferta): boolean {
    return !!this.producto && oferta.precio === mejorPrecio(this.producto);
  }

  /** Clase del ícono de estrella según la valoración del producto. */
  estrellaClase(indice: number): string {
    const valor = this.producto?.rating ?? 0;
    return indice <= Math.round(valor) ? 'bi bi-star-fill' : 'bi bi-star star-vacio';
  }

  /**
   * Agrega la oferta indicada al carrito. Requiere sesión de cliente; de lo
   * contrario redirige al login.
   */
  agregar(oferta: Oferta): void {
    const sesion = this.auth.usuarioActual();
    if (!sesion || sesion.rol !== 'cliente') {
      this.router.navigate(['/login']);
      return;
    }
    if (!this.producto) return;
    this.carrito.agregar(this.producto, oferta);
    this.mostrarToast = true;
    setTimeout(() => (this.mostrarToast = false), 2000);
  }
}

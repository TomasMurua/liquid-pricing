import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductoCardComponent } from '../../shared/producto-card.component';
import { ProductoService } from '../../core/services/producto.service';
import { CarritoService } from '../../core/services/carrito.service';
import { AuthService } from '../../core/services/auth.service';
import { formatoCLP, mejorPrecio } from '../../core/utils/formato';
import { Producto, Oferta } from '../../models/producto.model';

/**
 * Vista principal del catálogo: carga los productos, permite filtrarlos por
 * nombre y categoría, y los muestra en una grilla de tarjetas. Agregar al
 * carrito requiere una sesión de cliente; en caso contrario redirige a login.
 */
@Component({
  selector: 'app-catalogo',
  standalone: true,
  imports: [CommonModule, FormsModule, ProductoCardComponent],
  template: `
    <section class="lp-hero hero-accent text-center py-5 mb-4">
      <div class="container">
        <h1 class="display-5 fw-bold">Compara precios y ahorra</h1>
        <p class="lead mb-0">
          Encuentra el mejor precio entre los principales retailers de Chile.
        </p>
      </div>
    </section>

    <div class="container pb-5">
      <div class="row g-3 mb-4">
        <div class="col-12 col-md-7">
          <label class="form-label" for="busqueda">Buscar producto</label>
          <div class="input-group">
            <span class="input-group-text"><i class="bi bi-search"></i></span>
            <input
              id="busqueda"
              type="text"
              class="form-control"
              placeholder="Ej: notebook, smartphone…"
              [(ngModel)]="busqueda"
            />
          </div>
        </div>
        <div class="col-12 col-md-5">
          <label class="form-label" for="categoria">Categoría</label>
          <select id="categoria" class="form-select" [(ngModel)]="categoria">
            <option value="todas">Todas las categorías</option>
            <option *ngFor="let c of categorias" [value]="c">{{ c }}</option>
          </select>
        </div>
      </div>

      <p class="text-muted">
        {{ productosFiltrados.length }}
        {{ productosFiltrados.length === 1 ? 'resultado' : 'resultados' }}
      </p>

      <div *ngIf="productosFiltrados.length > 0; else vacio" class="row row-cols-1 row-cols-sm-2 row-cols-lg-3 g-4">
        <app-producto-card
          *ngFor="let p of productosFiltrados"
          [producto]="p"
          (agregar)="onAgregar($event)"
        ></app-producto-card>
      </div>

      <ng-template #vacio>
        <div class="text-center text-muted py-5">
          <i class="bi bi-search display-6 d-block mb-2"></i>
          No encontramos productos para tu búsqueda.
        </div>
      </ng-template>
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
export class CatalogoComponent implements OnInit {
  private productoService = inject(ProductoService);
  private carrito = inject(CarritoService);
  private auth = inject(AuthService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  productos: Producto[] = [];
  busqueda = '';
  categoria = 'todas';
  mostrarToast = false;

  readonly formatoCLP = formatoCLP;
  readonly mejorPrecio = mejorPrecio;

  ngOnInit(): void {
    this.productoService.listar().subscribe((ps) => (this.productos = ps));
  }

  /** Categorías únicas presentes en el catálogo, ordenadas alfabéticamente. */
  get categorias(): string[] {
    return Array.from(new Set(this.productos.map((p) => p.categoria))).sort();
  }

  /** Productos que cumplen los filtros de nombre (insensible a mayúsculas) y categoría. */
  get productosFiltrados(): Producto[] {
    const q = this.busqueda.trim().toLowerCase();
    return this.productos.filter(
      (p) =>
        p.nombre.toLowerCase().includes(q) &&
        (this.categoria === 'todas' || p.categoria === this.categoria),
    );
  }

  /**
   * Agrega la oferta más barata del producto al carrito. Requiere sesión de
   * cliente; de lo contrario redirige al login.
   */
  onAgregar(producto: Producto): void {
    const sesion = this.auth.usuarioActual();
    if (!sesion || sesion.rol !== 'cliente') {
      this.router.navigate(['/login']);
      return;
    }
    const ofertaMinima: Oferta | undefined = [...producto.ofertas].sort(
      (a, b) => a.precio - b.precio,
    )[0];
    if (!ofertaMinima) return;
    this.carrito.agregar(producto, ofertaMinima);
    this.mostrarToast = true;
    setTimeout(() => (this.mostrarToast = false), 2000);
  }
}

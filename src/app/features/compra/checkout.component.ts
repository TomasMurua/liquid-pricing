import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CarritoService } from '../../core/services/carrito.service';
import { CompraService } from '../../core/services/compra.service';
import { formatoCLP } from '../../core/utils/formato';
import { DatosEnvio } from '../../models/compra.model';

/**
 * @description
 * Checkout con formulario reactivo de datos de envío. El pago es SIMULADO
 * (no hay pasarela real): al confirmar, registra la orden a partir del carrito
 * y redirige a la pantalla de confirmación.
 */
@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  template: `
    <div class="container py-4">
      <h1 class="h3 mb-4"><i class="bi bi-bag-check me-2"></i>Finalizar compra</h1>

      <div class="row g-4">
        <!-- Formulario de envío -->
        <div class="col-12 col-lg-7">
          <div class="lp-card">
            <h2 class="lp-card-title mb-3">Datos de envío</h2>

            <form [formGroup]="form" (ngSubmit)="pagar()" novalidate>
              <div class="mb-3">
                <label class="form-label" for="nombre">Nombre completo</label>
                <input
                  id="nombre"
                  type="text"
                  class="form-control"
                  formControlName="nombre"
                  [class.is-invalid]="campoInvalido('nombre')"
                  placeholder="Ej: Tomás Pérez"
                />
                <div class="invalid-feedback" *ngIf="campoInvalido('nombre')">
                  Ingresa tu nombre.
                </div>
              </div>

              <div class="mb-3">
                <label class="form-label" for="direccion">Dirección</label>
                <input
                  id="direccion"
                  type="text"
                  class="form-control"
                  formControlName="direccion"
                  [class.is-invalid]="campoInvalido('direccion')"
                  placeholder="Ej: Av. Siempre Viva 742"
                />
                <div class="invalid-feedback" *ngIf="campoInvalido('direccion')">
                  Ingresa tu dirección.
                </div>
              </div>

              <div class="mb-3">
                <label class="form-label" for="ciudad">Ciudad</label>
                <input
                  id="ciudad"
                  type="text"
                  class="form-control"
                  formControlName="ciudad"
                  [class.is-invalid]="campoInvalido('ciudad')"
                  placeholder="Ej: Santiago"
                />
                <div class="invalid-feedback" *ngIf="campoInvalido('ciudad')">
                  Ingresa tu ciudad.
                </div>
              </div>

              <div class="mb-3">
                <label class="form-label" for="telefono">Teléfono</label>
                <input
                  id="telefono"
                  type="tel"
                  class="form-control"
                  formControlName="telefono"
                  [class.is-invalid]="campoInvalido('telefono')"
                  placeholder="Ej: +56912345678"
                />
                <div class="invalid-feedback" *ngIf="campoInvalido('telefono')">
                  Ingresa un teléfono chileno válido (9 dígitos).
                </div>
              </div>

              <div class="alert alert-warning d-flex align-items-center" role="alert">
                <i class="bi bi-info-circle-fill me-2"></i>
                <span>Este es un <strong>pago simulado</strong>: no se procesará ningún cobro real.</span>
              </div>

              <button
                type="submit"
                class="btn btn-lp-accent w-100"
                [disabled]="form.invalid || carrito.items().length === 0"
              >
                <i class="bi bi-credit-card me-2"></i>Pagar (simulado)
              </button>
            </form>
          </div>
        </div>

        <!-- Resumen del carrito -->
        <div class="col-12 col-lg-5">
          <div class="lp-card">
            <h2 class="lp-card-title mb-3">Resumen del pedido</h2>

            <ul class="list-group list-group-flush mb-3">
              <li
                class="list-group-item d-flex justify-content-between align-items-start px-0"
                *ngFor="let item of carrito.items()"
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
              <span class="h5 mb-0">{{ formatoCLP(carrito.total()) }}</span>
            </div>

            <a routerLink="/carrito" class="btn btn-link px-0 mt-3">
              <i class="bi bi-arrow-left me-1"></i>Volver al carrito
            </a>
          </div>
        </div>
      </div>
    </div>
  `,
})
export class CheckoutComponent implements OnInit {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private compra = inject(CompraService);
  readonly carrito = inject(CarritoService);
  readonly formatoCLP = formatoCLP;

  readonly form = this.fb.group({
    nombre: ['', Validators.required],
    direccion: ['', Validators.required],
    ciudad: ['', Validators.required],
    telefono: ['', [Validators.required, Validators.pattern(/^(\+?56)?0?9\d{8}$/)]],
  });

  ngOnInit(): void {
    if (this.carrito.items().length === 0) {
      this.router.navigate(['/carrito']);
    }
  }

  /** Indica si un campo debe mostrarse como inválido (tocado o modificado). */
  campoInvalido(campo: string): boolean {
    const control = this.form.get(campo);
    return !!control && control.invalid && (control.touched || control.dirty);
  }

  /** Registra la orden (pago simulado) y navega a la confirmación con el estado. */
  pagar(): void {
    if (this.form.invalid || this.carrito.items().length === 0) {
      this.form.markAllAsTouched();
      return;
    }
    const orden = this.compra.registrar(this.form.value as DatosEnvio);
    this.router.navigate(['/confirmacion'], { state: { orden } });
  }
}

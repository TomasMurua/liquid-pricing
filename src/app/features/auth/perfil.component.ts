import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-perfil',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="container lp-section">
      <div class="row justify-content-center">
        <div class="col-md-7 col-lg-6">
          <div class="lp-card">
            <h1 class="lp-card-title text-center">
              <i class="bi bi-person-circle me-1"></i>Mi perfil
            </h1>
            <p class="text-lp-muted text-center mb-4">
              Actualiza tus datos personales de <span class="text-lp-accent fw-bold">Liquid Pricing</span>.
            </p>

            <div *ngIf="guardado" class="alert alert-lp-success py-2" role="alert">
              <i class="bi bi-check-circle-fill me-1"></i>Perfil actualizado.
            </div>

            <form [formGroup]="form" (ngSubmit)="guardar()" novalidate>
              <div class="mb-3">
                <label for="nombre" class="form-label">Nombre completo</label>
                <input
                  id="nombre"
                  type="text"
                  class="form-control"
                  formControlName="nombre"
                  autocomplete="name"
                  [class.is-invalid]="invalido('nombre')"
                  [class.is-valid]="valido('nombre')"
                />
                <div class="invalid-feedback">Ingresa tu nombre.</div>
              </div>

              <div class="mb-3">
                <label for="email" class="form-label">Correo electrónico</label>
                <input
                  id="email"
                  type="email"
                  class="form-control"
                  formControlName="email"
                  autocomplete="email"
                  [class.is-invalid]="invalido('email')"
                  [class.is-valid]="valido('email')"
                />
                <div class="invalid-feedback">
                  <span *ngIf="email.errors?.['required']">Ingresa tu correo.</span>
                  <span *ngIf="email.errors?.['email']">El correo no es válido.</span>
                </div>
              </div>

              <div class="row g-3 mb-3">
                <div class="col-sm-6">
                  <label for="rut" class="form-label">RUT</label>
                  <input id="rut" type="text" class="form-control" [value]="sesion?.rut || ''" disabled readonly />
                  <div class="form-text">No editable.</div>
                </div>
                <div class="col-sm-6">
                  <label for="rol" class="form-label">Tipo de cuenta</label>
                  <input id="rol" type="text" class="form-control text-capitalize" [value]="sesion?.rol || ''" disabled readonly />
                  <div class="form-text">No editable.</div>
                </div>
              </div>

              <div class="d-grid">
                <button type="submit" class="btn btn-lp-accent" [disabled]="form.invalid">
                  <i class="bi bi-save me-1"></i>Guardar cambios
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  `,
})
export class PerfilComponent {
  private fb = inject(FormBuilder);
  private auth = inject(AuthService);

  readonly sesion = this.auth.usuarioActual();

  guardado = false;

  readonly form = this.fb.group({
    nombre: [this.sesion?.nombre ?? '', Validators.required],
    email: [this.sesion?.email ?? '', [Validators.required, Validators.email]],
  });

  get nombre() {
    return this.form.get('nombre')!;
  }

  get email() {
    return this.form.get('email')!;
  }

  invalido(campo: string): boolean {
    const c = this.form.get(campo)!;
    return c.invalid && (c.touched || c.dirty);
  }

  valido(campo: string): boolean {
    const c = this.form.get(campo)!;
    return c.valid && (c.touched || c.dirty);
  }

  guardar(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const { nombre, email } = this.form.getRawValue();
    this.auth.actualizarPerfil({ nombre: nombre!, email: email! }).subscribe(() => {
      this.guardado = true;
    });
  }
}

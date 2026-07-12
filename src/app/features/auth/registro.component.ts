import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { rutValidator } from '../../core/validators/rut.validator';
import {
  passwordFuerteValidator,
  passwordMatchValidator,
  evaluarReglasPassword,
} from '../../core/validators/password.validators';

@Component({
  selector: 'app-registro',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  template: `
    <div class="container lp-section">
      <div class="row justify-content-center">
        <div class="col-md-7 col-lg-6">
          <div class="lp-card">
            <h1 class="lp-card-title text-center">
              <i class="bi bi-person-plus me-1"></i>Crear cuenta
            </h1>
            <p class="text-lp-muted text-center mb-4">
              Únete a <span class="text-lp-accent fw-bold">Liquid Pricing</span> y compara precios al instante.
            </p>

            <div *ngIf="exito" class="alert alert-lp-success py-2" role="alert">
              <i class="bi bi-check-circle-fill me-1"></i>¡Cuenta creada con éxito! Redirigiendo al inicio de sesión…
            </div>

            <form [formGroup]="form" (ngSubmit)="registrar()" novalidate>
              <div class="mb-3">
                <label for="nombre" class="form-label">Nombre completo</label>
                <input
                  id="nombre"
                  type="text"
                  class="form-control"
                  formControlName="nombre"
                  placeholder="Ej: Ana Pérez"
                  autocomplete="name"
                  [class.is-invalid]="invalido('nombre')"
                  [class.is-valid]="valido('nombre')"
                />
                <div class="invalid-feedback">Ingresa tu nombre.</div>
              </div>

              <div class="mb-3">
                <label for="rut" class="form-label">RUT</label>
                <input
                  id="rut"
                  type="text"
                  class="form-control"
                  formControlName="rut"
                  placeholder="11.111.111-1"
                  [class.is-invalid]="invalido('rut')"
                  [class.is-valid]="valido('rut')"
                />
                <div class="invalid-feedback">
                  <span *ngIf="rut.errors?.['required']">Ingresa tu RUT.</span>
                  <span *ngIf="rut.errors?.['rut']">El RUT ingresado no es válido.</span>
                </div>
              </div>

              <div class="mb-3">
                <label for="email" class="form-label">Correo electrónico</label>
                <input
                  id="email"
                  type="email"
                  class="form-control"
                  formControlName="email"
                  placeholder="tucorreo@ejemplo.cl"
                  autocomplete="email"
                  [class.is-invalid]="invalido('email')"
                  [class.is-valid]="valido('email')"
                />
                <div class="invalid-feedback">
                  <span *ngIf="email.errors?.['required']">Ingresa tu correo.</span>
                  <span *ngIf="email.errors?.['email']">El correo no es válido.</span>
                </div>
              </div>

              <div class="mb-3">
                <label for="password" class="form-label">Contraseña</label>
                <input
                  id="password"
                  type="password"
                  class="form-control"
                  formControlName="password"
                  placeholder="Crea una contraseña segura"
                  autocomplete="new-password"
                  [class.is-invalid]="invalido('password')"
                  [class.is-valid]="valido('password')"
                />
                <ul class="list-unstyled small mt-2 mb-0">
                  <li *ngFor="let r of reglasPassword" [class.text-success]="r.ok" [class.text-danger]="!r.ok">
                    <i class="bi me-1" [class.bi-check-circle-fill]="r.ok" [class.bi-x-circle]="!r.ok"></i>{{ r.msg }}
                  </li>
                </ul>
              </div>

              <div class="mb-3">
                <label for="confirmar" class="form-label">Confirmar contraseña</label>
                <input
                  id="confirmar"
                  type="password"
                  class="form-control"
                  formControlName="confirmar"
                  placeholder="Repite tu contraseña"
                  autocomplete="new-password"
                  [class.is-invalid]="invalido('confirmar') || mostrarMismatch"
                  [class.is-valid]="valido('confirmar') && !form.errors?.['passwordMismatch']"
                />
                <div class="invalid-feedback d-block" *ngIf="confirmar.errors?.['required'] && confirmar.touched">
                  Confirma tu contraseña.
                </div>
                <div class="invalid-feedback d-block" *ngIf="mostrarMismatch">
                  Las contraseñas no coinciden.
                </div>
              </div>

              <div class="d-grid mb-3">
                <button type="submit" class="btn btn-lp-accent" [disabled]="form.invalid || exito">
                  <i class="bi bi-person-check me-1"></i>Registrarme
                </button>
              </div>
            </form>

            <p class="text-center small mb-0">
              ¿Ya tienes cuenta? <a routerLink="/login">Inicia sesión</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  `,
})
export class RegistroComponent {
  private fb = inject(FormBuilder);
  private auth = inject(AuthService);
  private router = inject(Router);

  exito = false;

  readonly form = this.fb.group(
    {
      nombre: ['', Validators.required],
      rut: ['', [Validators.required, rutValidator]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, passwordFuerteValidator]],
      confirmar: ['', Validators.required],
    },
    { validators: passwordMatchValidator('password', 'confirmar') },
  );

  get nombre() {
    return this.form.get('nombre')!;
  }

  get rut() {
    return this.form.get('rut')!;
  }

  get email() {
    return this.form.get('email')!;
  }

  get password() {
    return this.form.get('password')!;
  }

  get confirmar() {
    return this.form.get('confirmar')!;
  }

  get reglasPassword() {
    return evaluarReglasPassword(this.password.value ?? '');
  }

  get mostrarMismatch(): boolean {
    return !!this.form.errors?.['passwordMismatch'] && this.confirmar.touched;
  }

  invalido(campo: string): boolean {
    const c = this.form.get(campo)!;
    return c.invalid && (c.touched || c.dirty);
  }

  valido(campo: string): boolean {
    const c = this.form.get(campo)!;
    return c.valid && (c.touched || c.dirty);
  }

  registrar(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const { rut, nombre, email, password } = this.form.getRawValue();
    this.auth
      .registrar({ rut: rut!, nombre: nombre!, email: email!, password: password!, rol: 'cliente' })
      .subscribe(() => {
        this.exito = true;
        setTimeout(() => this.router.navigate(['/login']), 1500);
      });
  }
}

import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  template: `
    <div class="container lp-section">
      <div class="row justify-content-center">
        <div class="col-md-6 col-lg-5">
          <div class="lp-card">
            <h1 class="lp-card-title text-center">
              <i class="bi bi-box-arrow-in-right me-1"></i>Iniciar sesión
            </h1>
            <p class="text-lp-muted text-center mb-4">
              Bienvenido de vuelta a <span class="text-lp-accent fw-bold">Liquid Pricing</span>.
            </p>

            <div *ngIf="error" class="alert alert-danger py-2" role="alert">
              <i class="bi bi-exclamation-triangle-fill me-1"></i>Credenciales incorrectas.
            </div>

            <form [formGroup]="form" (ngSubmit)="ingresar()" novalidate>
              <div class="mb-3">
                <label for="email" class="form-label">Correo electrónico</label>
                <div class="input-group">
                  <span class="input-group-text"><i class="bi bi-envelope"></i></span>
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
              </div>

              <div class="mb-3">
                <label for="password" class="form-label">Contraseña</label>
                <div class="input-group">
                  <span class="input-group-text"><i class="bi bi-lock"></i></span>
                  <input
                    id="password"
                    type="password"
                    class="form-control"
                    formControlName="password"
                    placeholder="Tu contraseña"
                    autocomplete="current-password"
                    [class.is-invalid]="invalido('password')"
                    [class.is-valid]="valido('password')"
                  />
                  <div class="invalid-feedback">Ingresa tu contraseña.</div>
                </div>
              </div>

              <div class="d-grid mb-3">
                <button type="submit" class="btn btn-lp-accent" [disabled]="form.invalid">
                  <i class="bi bi-box-arrow-in-right me-1"></i>Ingresar
                </button>
              </div>
            </form>

            <div class="d-flex justify-content-between small">
              <a routerLink="/recuperar">¿Olvidaste tu contraseña?</a>
              <a routerLink="/registro">Crear cuenta</a>
            </div>

            <hr class="lp-divider" />

            <div class="alert alert-lp-info mb-0 py-2 small">
              <div class="fw-bold mb-1"><i class="bi bi-info-circle me-1"></i>Credenciales de demo</div>
              <div>Admin: <code>admin&#64;liquid.cl</code> / <code>Admin123!</code></div>
              <div>Cliente: <code>cliente&#64;liquid.cl</code> / <code>Cliente123!</code></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
})
export class LoginComponent {
  private fb = inject(FormBuilder);
  private auth = inject(AuthService);
  private router = inject(Router);

  error = false;

  readonly form = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required],
  });

  get email() {
    return this.form.get('email')!;
  }

  get password() {
    return this.form.get('password')!;
  }

  invalido(campo: string): boolean {
    const c = this.form.get(campo)!;
    return c.invalid && (c.touched || c.dirty);
  }

  valido(campo: string): boolean {
    const c = this.form.get(campo)!;
    return c.valid && (c.touched || c.dirty);
  }

  ingresar(): void {
    this.error = false;
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const { email, password } = this.form.getRawValue();
    this.auth.login(email!, password!).subscribe((sesion) => {
      if (!sesion) {
        this.error = true;
        return;
      }
      this.router.navigate([sesion.rol === 'admin' ? '/admin/productos' : '/']);
    });
  }
}

import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-recuperar',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  template: `
    <div class="container lp-section">
      <div class="row justify-content-center">
        <div class="col-md-6 col-lg-5">
          <div class="lp-card">
            <h1 class="lp-card-title text-center">
              <i class="bi bi-key me-1"></i>Recuperar contraseña
            </h1>
            <p class="text-lp-muted text-center mb-4">
              Ingresa tu correo y te enviaremos instrucciones para restablecer tu acceso.
            </p>

            <div *ngIf="enviado" class="alert alert-lp-info py-2" role="alert">
              <i class="bi bi-envelope-check me-1"></i>Si el correo está registrado, te enviamos instrucciones para
              recuperar tu contraseña.
            </div>

            <form *ngIf="!enviado" [formGroup]="form" (ngSubmit)="enviar()" novalidate>
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

              <div class="d-grid mb-3">
                <button type="submit" class="btn btn-lp-accent" [disabled]="form.invalid">
                  <i class="bi bi-send me-1"></i>Enviar instrucciones
                </button>
              </div>
            </form>

            <p class="text-center small mb-0">
              <a routerLink="/login"><i class="bi bi-arrow-left me-1"></i>Volver a iniciar sesión</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  `,
})
export class RecuperarComponent {
  private fb = inject(FormBuilder);
  private auth = inject(AuthService);

  enviado = false;

  readonly form = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
  });

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

  enviar(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const { email } = this.form.getRawValue();
    this.auth.recuperar(email!).subscribe(() => {
      this.enviado = true;
    });
  }
}

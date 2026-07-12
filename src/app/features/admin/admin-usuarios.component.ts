import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { UsuarioService } from '../../core/services/usuario.service';
import { rutValidator } from '../../core/validators/rut.validator';
import { Usuario } from '../../models/usuario.model';

@Component({
  selector: 'app-admin-usuarios',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="d-flex justify-content-between align-items-center mb-3">
      <h2 class="lp-card-title mb-0">Mantenedor de usuarios</h2>
      <button class="btn btn-lp-accent" type="button" (click)="nuevo()">
        <i class="bi bi-person-plus me-1"></i>Nuevo usuario
      </button>
    </div>

    <div class="alert alert-success" role="alert" *ngIf="mensaje">
      <i class="bi bi-check-circle me-1"></i>{{ mensaje }}
    </div>

    <div class="lp-card p-3 mb-4" *ngIf="mostrarForm">
      <h3 class="lp-card-title h5">{{ editando ? 'Editar usuario' : 'Nuevo usuario' }}</h3>
      <form [formGroup]="form" (ngSubmit)="guardar()">
        <div class="row g-3">
          <div class="col-md-4">
            <label class="form-label">RUT</label>
            <input class="form-control" type="text" formControlName="rut" placeholder="11.111.111-1" />
            <div class="text-danger small" *ngIf="invalido('rut')">
              <span *ngIf="form.get('rut')?.errors?.['required']">El RUT es obligatorio.</span>
              <span *ngIf="form.get('rut')?.errors?.['rut']">El RUT no es válido.</span>
            </div>
          </div>

          <div class="col-md-4">
            <label class="form-label">Nombre</label>
            <input class="form-control" type="text" formControlName="nombre" />
            <div class="text-danger small" *ngIf="invalido('nombre')">El nombre es obligatorio.</div>
          </div>

          <div class="col-md-4">
            <label class="form-label">Email</label>
            <input class="form-control" type="email" formControlName="email" />
            <div class="text-danger small" *ngIf="invalido('email')">
              <span *ngIf="form.get('email')?.errors?.['required']">El email es obligatorio.</span>
              <span *ngIf="form.get('email')?.errors?.['email']">El email no es válido.</span>
            </div>
          </div>

          <div class="col-md-6">
            <label class="form-label">Contraseña</label>
            <input class="form-control" type="password" formControlName="password" />
            <div class="text-danger small" *ngIf="invalido('password')">La contraseña es obligatoria.</div>
          </div>

          <div class="col-md-6">
            <label class="form-label">Rol</label>
            <select class="form-select" formControlName="rol">
              <option value="cliente">Cliente</option>
              <option value="admin">Administrador</option>
            </select>
          </div>
        </div>

        <div class="d-flex gap-2 mt-3">
          <button class="btn btn-lp-accent" type="submit">
            <i class="bi bi-save me-1"></i>Guardar
          </button>
          <button class="btn btn-outline-secondary" type="button" (click)="cerrarForm()">Cancelar</button>
        </div>
      </form>
    </div>

    <div class="lp-card p-0">
      <div class="table-responsive">
        <table class="table table-striped table-hover align-middle mb-0">
          <thead>
            <tr>
              <th>RUT</th>
              <th>Nombre</th>
              <th>Email</th>
              <th>Rol</th>
              <th class="text-end">Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let u of usuarios">
              <td>{{ u.rut }}</td>
              <td>{{ u.nombre }}</td>
              <td>{{ u.email }}</td>
              <td>
                <span class="badge" [ngClass]="u.rol === 'admin' ? 'text-bg-primary' : 'text-bg-secondary'">
                  {{ u.rol === 'admin' ? 'Administrador' : 'Cliente' }}
                </span>
              </td>
              <td class="text-end">
                <button class="btn btn-sm btn-outline-primary me-1" type="button" (click)="editar(u)">
                  <i class="bi bi-pencil me-1"></i>Editar
                </button>
                <button class="btn btn-sm btn-outline-danger" type="button" (click)="eliminar(u)">
                  <i class="bi bi-trash me-1"></i>Eliminar
                </button>
              </td>
            </tr>
            <tr *ngIf="usuarios.length === 0">
              <td colspan="5" class="text-center text-muted py-4">No hay usuarios registrados.</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  `,
})
export class AdminUsuariosComponent implements OnInit {
  private srv = inject(UsuarioService);
  private fb = inject(FormBuilder);

  usuarios: Usuario[] = [];
  mostrarForm = false;
  editando: Usuario | null = null;
  mensaje = '';

  form = this.fb.group({
    rut: ['', [Validators.required, rutValidator]],
    nombre: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required],
    rol: this.fb.control<'admin' | 'cliente'>('cliente', Validators.required),
  });

  ngOnInit(): void {
    this.cargar();
  }

  cargar(): void {
    this.srv.listar().subscribe((lista) => (this.usuarios = lista));
  }

  nuevo(): void {
    this.editando = null;
    this.form.reset({ rut: '', nombre: '', email: '', password: '', rol: 'cliente' });
    this.mensaje = '';
    this.mostrarForm = true;
  }

  editar(u: Usuario): void {
    this.editando = u;
    this.form.reset({
      rut: u.rut,
      nombre: u.nombre,
      email: u.email,
      password: u.password,
      rol: u.rol,
    });
    this.mensaje = '';
    this.mostrarForm = true;
  }

  guardar(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const v = this.form.getRawValue();
    const usuario: Usuario = {
      key: this.editando?.key,
      rut: v.rut!,
      nombre: v.nombre!,
      email: v.email!,
      password: v.password!,
      rol: v.rol!,
    };

    const editaba = !!this.editando;
    const operacion = editaba ? this.srv.actualizar(usuario) : this.srv.crear(usuario);
    operacion.subscribe(() => {
      this.mensaje = editaba ? 'Usuario actualizado correctamente.' : 'Usuario creado correctamente.';
      this.cerrarForm();
      this.cargar();
    });
  }

  eliminar(u: Usuario): void {
    if (!confirm(`¿Eliminar al usuario "${u.nombre}"?`)) return;
    this.srv.eliminar(u).subscribe(() => {
      this.mensaje = 'Usuario eliminado.';
      this.cargar();
    });
  }

  cerrarForm(): void {
    this.mostrarForm = false;
    this.editando = null;
    this.form.reset({ rut: '', nombre: '', email: '', password: '', rol: 'cliente' });
  }

  invalido(campo: string): boolean {
    const c = this.form.get(campo);
    return !!c && c.invalid && (c.touched || c.dirty);
  }
}

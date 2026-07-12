import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ProductoService } from '../../core/services/producto.service';
import { formatoCLP, mejorPrecio } from '../../core/utils/formato';
import { Producto } from '../../models/producto.model';

@Component({
  selector: 'app-admin-productos',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="d-flex justify-content-between align-items-center mb-3">
      <h2 class="lp-card-title mb-0">Mantenedor de productos</h2>
      <button class="btn btn-lp-accent" type="button" (click)="nuevo()">
        <i class="bi bi-plus-lg me-1"></i>Nuevo producto
      </button>
    </div>

    <div class="alert alert-success" role="alert" *ngIf="mensaje">
      <i class="bi bi-check-circle me-1"></i>{{ mensaje }}
    </div>

    <div class="lp-card p-3 mb-4" *ngIf="mostrarForm">
      <h3 class="lp-card-title h5">{{ editando ? 'Editar producto' : 'Nuevo producto' }}</h3>
      <form [formGroup]="form" (ngSubmit)="guardar()">
        <div class="row g-3">
          <div class="col-md-6">
            <label class="form-label">Nombre</label>
            <input class="form-control" type="text" formControlName="nombre" />
            <div class="text-danger small" *ngIf="invalido('nombre')">El nombre es obligatorio.</div>
          </div>

          <div class="col-md-6">
            <label class="form-label">Categoría</label>
            <select class="form-select" formControlName="categoria">
              <option value="notebook">Notebook</option>
              <option value="smartphone">Smartphone</option>
              <option value="audífonos">Audífonos</option>
              <option value="smartwatch">Smartwatch</option>
              <option value="monitor">Monitor</option>
            </select>
          </div>

          <div class="col-md-8">
            <label class="form-label">Imagen (URL)</label>
            <input class="form-control" type="url" formControlName="imagen" placeholder="https://..." />
            <div class="text-danger small" *ngIf="invalido('imagen')">La URL de la imagen es obligatoria.</div>
          </div>

          <div class="col-md-2">
            <label class="form-label">Rating</label>
            <input class="form-control" type="number" formControlName="rating" min="0" max="5" step="0.1" />
            <div class="text-danger small" *ngIf="invalido('rating')">Debe estar entre 0 y 5.</div>
          </div>

          <div class="col-md-2">
            <label class="form-label">Stock</label>
            <input class="form-control" type="number" formControlName="stock" min="0" />
          </div>

          <div class="col-12">
            <label class="form-label">Descripción</label>
            <textarea class="form-control" rows="2" formControlName="descripcion"></textarea>
            <div class="text-danger small" *ngIf="invalido('descripcion')">La descripción es obligatoria.</div>
          </div>
        </div>

        <hr />

        <div class="d-flex justify-content-between align-items-center mb-2">
          <h4 class="h6 mb-0">Ofertas</h4>
          <button class="btn btn-sm btn-outline-secondary" type="button" (click)="agregarOferta()">
            <i class="bi bi-plus-lg me-1"></i>Agregar oferta
          </button>
        </div>

        <div formArrayName="ofertas">
          <div class="row g-2 align-items-end mb-2" *ngFor="let grupo of ofertas.controls; let i = index" [formGroupName]="i">
            <div class="col-md-3">
              <label class="form-label small">Tienda</label>
              <input class="form-control form-control-sm" type="text" formControlName="tienda" />
              <div class="text-danger small" *ngIf="ofertaInvalida(i, 'tienda')">Requerida.</div>
            </div>
            <div class="col-md-2">
              <label class="form-label small">Precio</label>
              <input class="form-control form-control-sm" type="number" formControlName="precio" min="0" />
              <div class="text-danger small" *ngIf="ofertaInvalida(i, 'precio')">Precio inválido.</div>
            </div>
            <div class="col-md-3">
              <label class="form-label small">Envío</label>
              <input class="form-control form-control-sm" type="text" formControlName="envio" placeholder="Gratis / $2.990" />
            </div>
            <div class="col-md-3">
              <label class="form-label small">Link</label>
              <input class="form-control form-control-sm" type="url" formControlName="link" />
            </div>
            <div class="col-md-1">
              <button
                class="btn btn-sm btn-outline-danger w-100"
                type="button"
                (click)="quitarOferta(i)"
                [disabled]="ofertas.length <= 1"
                title="Quitar oferta"
              >
                <i class="bi bi-trash"></i>
              </button>
            </div>
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
              <th>Nombre</th>
              <th>Categoría</th>
              <th>Precio desde</th>
              <th class="text-center">Nº ofertas</th>
              <th class="text-end">Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let p of productos">
              <td>{{ p.nombre }}</td>
              <td><span class="text-capitalize">{{ p.categoria }}</span></td>
              <td>{{ formatoCLP(mejorPrecio(p)) }}</td>
              <td class="text-center">{{ p.ofertas.length }}</td>
              <td class="text-end">
                <button class="btn btn-sm btn-outline-primary me-1" type="button" (click)="editar(p)">
                  <i class="bi bi-pencil me-1"></i>Editar
                </button>
                <button class="btn btn-sm btn-outline-danger" type="button" (click)="eliminar(p)">
                  <i class="bi bi-trash me-1"></i>Eliminar
                </button>
              </td>
            </tr>
            <tr *ngIf="productos.length === 0">
              <td colspan="5" class="text-center text-muted py-4">No hay productos cargados.</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  `,
})
export class AdminProductosComponent implements OnInit {
  private srv = inject(ProductoService);
  private fb = inject(FormBuilder);

  readonly formatoCLP = formatoCLP;
  readonly mejorPrecio = mejorPrecio;

  productos: Producto[] = [];
  mostrarForm = false;
  editando: Producto | null = null;
  mensaje = '';

  form = this.fb.group({
    nombre: ['', Validators.required],
    categoria: ['notebook', Validators.required],
    imagen: ['', Validators.required],
    descripcion: ['', Validators.required],
    rating: this.fb.control<number | null>(null, [Validators.min(0), Validators.max(5)]),
    stock: this.fb.control<number>(0, [Validators.min(0)]),
    ofertas: this.fb.array<FormGroup>([this.crearOferta()]),
  });

  ngOnInit(): void {
    this.cargar();
  }

  get ofertas(): FormArray<FormGroup> {
    return this.form.get('ofertas') as FormArray<FormGroup>;
  }

  cargar(): void {
    this.srv.listar().subscribe((lista) => (this.productos = lista));
  }

  nuevo(): void {
    this.editando = null;
    this.resetForm();
    this.mensaje = '';
    this.mostrarForm = true;
  }

  editar(p: Producto): void {
    this.editando = p;
    this.ofertas.clear();
    const ofertas = p.ofertas.length ? p.ofertas : [{ tienda: '', precio: 0, envio: '', link: '' }];
    ofertas.forEach((o) => this.ofertas.push(this.crearOferta(o.tienda, o.precio, o.envio, o.link)));
    this.form.patchValue({
      nombre: p.nombre,
      categoria: p.categoria,
      imagen: p.imagen,
      descripcion: p.descripcion,
      rating: p.rating,
      stock: p.stock ?? 0,
    });
    this.mensaje = '';
    this.mostrarForm = true;
  }

  agregarOferta(): void {
    this.ofertas.push(this.crearOferta());
  }

  quitarOferta(i: number): void {
    if (this.ofertas.length > 1) this.ofertas.removeAt(i);
  }

  guardar(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const v = this.form.getRawValue();
    const producto: Producto = {
      id: this.editando?.id ?? 0,
      key: this.editando?.key,
      nombre: v.nombre!,
      categoria: v.categoria!,
      imagen: v.imagen!,
      descripcion: v.descripcion!,
      rating: v.rating ?? null,
      stock: Number(v.stock ?? 0),
      ofertas: (v.ofertas as Array<{ tienda: string; precio: number; envio: string; link: string }>).map((o) => ({
        tienda: o.tienda,
        precio: Number(o.precio),
        envio: o.envio ?? '',
        link: o.link ?? '',
      })),
    };

    const editaba = !!this.editando;
    const operacion = editaba ? this.srv.actualizar(producto) : this.srv.crear(producto);
    operacion.subscribe(() => {
      this.mensaje = editaba ? 'Producto actualizado correctamente.' : 'Producto creado correctamente.';
      this.cerrarForm();
      this.cargar();
    });
  }

  eliminar(p: Producto): void {
    if (!confirm(`¿Eliminar el producto "${p.nombre}"?`)) return;
    this.srv.eliminar(p).subscribe(() => {
      this.mensaje = 'Producto eliminado.';
      this.cargar();
    });
  }

  cerrarForm(): void {
    this.mostrarForm = false;
    this.editando = null;
    this.resetForm();
  }

  invalido(campo: string): boolean {
    const c = this.form.get(campo);
    return !!c && c.invalid && (c.touched || c.dirty);
  }

  ofertaInvalida(i: number, campo: string): boolean {
    const c = this.ofertas.at(i).get(campo);
    return !!c && c.invalid && (c.touched || c.dirty);
  }

  private crearOferta(tienda = '', precio: number | null = 0, envio = '', link = ''): FormGroup {
    return this.fb.group({
      tienda: [tienda, Validators.required],
      precio: [precio, [Validators.required, Validators.min(0)]],
      envio: [envio],
      link: [link],
    });
  }

  private resetForm(): void {
    this.ofertas.clear();
    this.ofertas.push(this.crearOferta());
    this.form.reset({
      nombre: '',
      categoria: 'notebook',
      imagen: '',
      descripcion: '',
      rating: null,
      stock: 0,
    });
  }
}

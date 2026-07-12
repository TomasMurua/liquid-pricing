import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProductoService } from '../../core/services/producto.service';
import { Producto } from '../../models/producto.model';

@Component({
  selector: 'app-admin-inventario',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="d-flex justify-content-between align-items-center mb-3">
      <h2 class="lp-card-title mb-0">Inventario</h2>
      <span class="badge text-bg-dark fs-6">
        Total en inventario: {{ totalUnidades() }} unidades
      </span>
    </div>

    <div class="alert alert-success" role="alert" *ngIf="mensaje">
      <i class="bi bi-check-circle me-1"></i>{{ mensaje }}
    </div>

    <div class="lp-card p-0">
      <div class="table-responsive">
        <table class="table table-striped table-hover align-middle mb-0">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Categoría</th>
              <th style="width: 180px;">Stock actual</th>
              <th class="text-end">Acción</th>
            </tr>
          </thead>
          <tbody>
            <tr
              *ngFor="let p of productos"
              [ngClass]="{
                'table-danger': (p.stock ?? 0) === 0,
                'table-warning': (p.stock ?? 0) > 0 && (p.stock ?? 0) < 10
              }"
            >
              <td>{{ p.nombre }}</td>
              <td><span class="text-capitalize">{{ p.categoria }}</span></td>
              <td>
                <input
                  class="form-control form-control-sm"
                  type="number"
                  min="0"
                  [(ngModel)]="edits[p.id]"
                  name="stock-{{ p.id }}"
                />
              </td>
              <td class="text-end">
                <button class="btn btn-sm btn-lp-accent" type="button" (click)="guardar(p)">
                  <i class="bi bi-save me-1"></i>Guardar
                </button>
              </td>
            </tr>
            <tr *ngIf="productos.length === 0">
              <td colspan="4" class="text-center text-muted py-4">No hay productos en inventario.</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  `,
})
export class AdminInventarioComponent implements OnInit {
  private srv = inject(ProductoService);

  productos: Producto[] = [];
  edits: Record<number, number> = {};
  mensaje = '';

  ngOnInit(): void {
    this.cargar();
  }

  cargar(): void {
    this.srv.listar().subscribe((lista) => {
      this.productos = lista;
      this.edits = {};
      lista.forEach((p) => (this.edits[p.id] = p.stock ?? 0));
    });
  }

  totalUnidades(): number {
    return this.productos.reduce((total, p) => total + (p.stock ?? 0), 0);
  }

  guardar(p: Producto): void {
    const nuevoStock = Number(this.edits[p.id] ?? 0);
    this.srv.actualizar({ ...p, stock: nuevoStock }).subscribe(() => {
      this.mensaje = `Stock de "${p.nombre}" actualizado a ${nuevoStock} unidades.`;
      this.cargar();
    });
  }
}

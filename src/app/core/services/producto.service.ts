import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { Producto } from '../../models/producto.model';
import { PRODUCTOS_SEED } from '../../data/productos.seed';

/**
 * @description
 * Acceso a productos con doble fuente según `environment.useBackend`:
 * en modo estático opera sobre un arreglo en memoria a partir de los seeds;
 * en modo backend consume Firebase Realtime Database vía HttpClient con
 * GET/POST/PUT/DELETE.
 */
@Injectable({ providedIn: 'root' })
export class ProductoService {
  private http = inject(HttpClient);
  private base = `${environment.firebaseUrl}/productos`;
  private memoria: Producto[] = PRODUCTOS_SEED.map((p) => ({ ...p }));

  /**
   * Lista todos los productos.
   * @returns Observable con el arreglo de productos.
   */
  listar(): Observable<Producto[]> {
    if (!environment.useBackend) {
      return of(this.memoria.map((p) => ({ ...p })));
    }
    return this.http
      .get<Record<string, Producto> | null>(`${this.base}.json`)
      .pipe(map((obj) => this.mapear(obj)));
  }

  /**
   * Obtiene un producto por su id de negocio.
   * @param id Identificador numérico del producto.
   */
  obtener(id: number): Observable<Producto | undefined> {
    return this.listar().pipe(map((ps) => ps.find((p) => p.id === id)));
  }

  /**
   * Crea un producto (POST en modo backend).
   * @param p Datos del producto sin `key`.
   */
  crear(p: Producto): Observable<Producto> {
    if (!environment.useBackend) {
      const nuevo: Producto = { ...p, id: this.siguienteId() };
      this.memoria.push(nuevo);
      return of(nuevo);
    }
    const { key, ...datos } = { ...p, id: p.id || Date.now() };
    return this.http
      .post<{ name: string }>(`${this.base}.json`, datos)
      .pipe(map((r) => ({ ...datos, key: r.name } as Producto)));
  }

  /**
   * Actualiza un producto existente (PUT en modo backend).
   * @param p Producto con `key` (backend) o `id` (estático).
   */
  actualizar(p: Producto): Observable<Producto> {
    if (!environment.useBackend) {
      const i = this.memoria.findIndex((x) => x.id === p.id);
      if (i >= 0) this.memoria[i] = { ...p };
      return of(p);
    }
    const { key, ...datos } = p;
    return this.http.put(`${this.base}/${key}.json`, datos).pipe(map(() => p));
  }

  /**
   * Elimina un producto (DELETE en modo backend).
   * @param p Producto a eliminar.
   */
  eliminar(p: Producto): Observable<void> {
    if (!environment.useBackend) {
      this.memoria = this.memoria.filter((x) => x.id !== p.id);
      return of(void 0);
    }
    return this.http.delete<void>(`${this.base}/${p.key}.json`);
  }

  /** Convierte el mapa `{key: producto}` de Firebase en un arreglo con `key`. */
  private mapear(obj: Record<string, Producto> | null): Producto[] {
    if (!obj) return [];
    return Object.entries(obj).map(([key, val]) => ({ ...val, key }));
  }

  private siguienteId(): number {
    return this.memoria.reduce((max, p) => Math.max(max, p.id), 0) + 1;
  }
}

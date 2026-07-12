import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { Usuario } from '../../models/usuario.model';
import { USUARIOS_SEED } from '../../data/usuarios.seed';

/**
 * @description
 * Mantenedor de usuarios. En modo estático (Semana 6) persiste en
 * `localStorage` (inicializado con los seeds); en modo backend (Semana 8)
 * consume Firebase con GET/POST/PUT/DELETE.
 */
@Injectable({ providedIn: 'root' })
export class UsuarioService {
  private http = inject(HttpClient);
  private base = `${environment.firebaseUrl}/usuarios`;
  private readonly LS = 'lp_usuarios';

  /** Lista todos los usuarios. */
  listar(): Observable<Usuario[]> {
    if (!environment.useBackend) {
      return of(this.cargarLocal());
    }
    return this.http
      .get<Record<string, Usuario> | null>(`${this.base}.json`)
      .pipe(map((obj) => this.mapear(obj)));
  }

  /**
   * Crea/registra un usuario.
   * @param u Datos del usuario.
   */
  crear(u: Usuario): Observable<Usuario> {
    if (!environment.useBackend) {
      const lista = this.cargarLocal();
      lista.push({ ...u });
      this.guardarLocal(lista);
      return of(u);
    }
    const { key, ...datos } = u;
    return this.http
      .post<{ name: string }>(`${this.base}.json`, datos)
      .pipe(map((r) => ({ ...u, key: r.name })));
  }

  /**
   * Actualiza un usuario existente.
   * @param u Usuario con `key` (backend) o identificado por email (estático).
   */
  actualizar(u: Usuario): Observable<Usuario> {
    if (!environment.useBackend) {
      const lista = this.cargarLocal();
      const i = lista.findIndex((x) => x.email === u.email);
      if (i >= 0) lista[i] = { ...lista[i], ...u };
      this.guardarLocal(lista);
      return of(u);
    }
    const { key, ...datos } = u;
    return this.http.put(`${this.base}/${key}.json`, datos).pipe(map(() => u));
  }

  /**
   * Elimina un usuario.
   * @param u Usuario a eliminar.
   */
  eliminar(u: Usuario): Observable<void> {
    if (!environment.useBackend) {
      this.guardarLocal(this.cargarLocal().filter((x) => x.email !== u.email));
      return of(void 0);
    }
    return this.http.delete<void>(`${this.base}/${u.key}.json`);
  }

  private cargarLocal(): Usuario[] {
    const raw = localStorage.getItem(this.LS);
    if (raw) {
      try {
        return JSON.parse(raw);
      } catch {
        /* cae al seed */
      }
    }
    const inicial = USUARIOS_SEED.map((u) => ({ ...u }));
    this.guardarLocal(inicial);
    return inicial;
  }

  private guardarLocal(arr: Usuario[]): void {
    localStorage.setItem(this.LS, JSON.stringify(arr));
  }

  private mapear(obj: Record<string, Usuario> | null): Usuario[] {
    if (!obj) return [];
    return Object.entries(obj).map(([key, val]) => ({ ...val, key }));
  }
}

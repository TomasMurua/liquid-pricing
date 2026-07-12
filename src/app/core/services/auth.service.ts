import { Injectable, computed, inject, signal } from '@angular/core';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { Sesion, Usuario } from '../../models/usuario.model';
import { UsuarioService } from './usuario.service';

const LS_SESION = 'lp_sesion';

/**
 * @description
 * Gestiona la sesión (en `localStorage`) y la autenticación. Expone la sesión
 * como signal para que el navbar refleje el estado de login y el rol.
 */
@Injectable({ providedIn: 'root' })
export class AuthService {
  private usuarios = inject(UsuarioService);

  /** Sesión activa (o `null` si no hay). */
  readonly sesion = signal<Sesion | null>(this.leerSesion());

  /** `true` si la sesión activa es de rol admin. */
  readonly esAdmin = computed(() => this.sesion()?.rol === 'admin');

  /**
   * Intenta autenticar por email (insensible a mayúsculas) y contraseña.
   * @param email Correo del usuario.
   * @param password Contraseña.
   * @returns Observable con la sesión creada, o `null` si las credenciales fallan.
   */
  login(email: string, password: string): Observable<Sesion | null> {
    const correo = email.trim().toLowerCase();
    return this.usuarios.listar().pipe(
      map((lista) => {
        const u = lista.find((x) => x.email.toLowerCase() === correo && x.password === password);
        if (!u) return null;
        const s: Sesion = { rut: u.rut, nombre: u.nombre, email: u.email, rol: u.rol };
        this.setSesion(s);
        return s;
      }),
    );
  }

  /**
   * Registra un nuevo usuario (siempre con rol cliente).
   * @param u Datos del formulario de registro.
   */
  registrar(u: Usuario): Observable<Usuario> {
    return this.usuarios.crear({ ...u, rol: 'cliente' });
  }

  /**
   * Verifica si un email existe (para la recuperación de contraseña).
   * @param email Correo a verificar.
   */
  recuperar(email: string): Observable<boolean> {
    const correo = email.trim().toLowerCase();
    return this.usuarios.listar().pipe(map((lista) => lista.some((u) => u.email.toLowerCase() === correo)));
  }

  /**
   * Actualiza nombre/email del perfil en sesión y lo persiste.
   * @param cambios Campos a actualizar.
   */
  actualizarPerfil(cambios: Partial<Usuario>): Observable<Usuario | null> {
    const actual = this.sesion();
    if (!actual) return of(null);
    return this.usuarios.listar().pipe(
      map((lista) => {
        const u = lista.find((x) => x.email.toLowerCase() === actual.email.toLowerCase());
        if (!u) return null;
        const actualizado = { ...u, ...cambios };
        this.usuarios.actualizar(actualizado).subscribe();
        const s: Sesion = {
          rut: actualizado.rut,
          nombre: actualizado.nombre,
          email: actualizado.email,
          rol: actualizado.rol,
        };
        this.setSesion(s);
        return actualizado;
      }),
    );
  }

  /** Retorna la sesión activa. */
  usuarioActual(): Sesion | null {
    return this.sesion();
  }

  /** Cierra la sesión. */
  logout(): void {
    localStorage.removeItem(LS_SESION);
    this.sesion.set(null);
  }

  private setSesion(s: Sesion): void {
    localStorage.setItem(LS_SESION, JSON.stringify(s));
    this.sesion.set(s);
  }

  private leerSesion(): Sesion | null {
    try {
      const raw = localStorage.getItem(LS_SESION);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  }
}

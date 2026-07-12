/** Roles disponibles en la aplicación. */
export type Rol = 'admin' | 'cliente';

/**
 * Usuario registrado. `key` es la clave de Firebase (modo backend).
 */
export interface Usuario {
  key?: string;
  rut: string;
  nombre: string;
  email: string;
  password: string;
  rol: Rol;
}

/**
 * Sesión activa: copia del usuario sin la contraseña.
 */
export interface Sesion {
  rut: string;
  nombre: string;
  email: string;
  rol: Rol;
}

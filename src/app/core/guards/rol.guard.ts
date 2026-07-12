import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { Rol } from '../../models/usuario.model';

/**
 * Guard por rol. Se usa con `data: { rol: 'admin' | 'cliente' }` en la ruta.
 * Si la sesión no tiene el rol requerido, redirige al login.
 */
export const rolGuard: CanActivateFn = (route) => {
  const auth = inject(AuthService);
  const router = inject(Router);
  const requerido = route.data['rol'] as Rol;
  const sesion = auth.usuarioActual();
  if (sesion && sesion.rol === requerido) return true;
  return router.createUrlTree(['/login']);
};

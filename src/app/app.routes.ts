import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { rolGuard } from './core/guards/rol.guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./features/catalogo/catalogo.component').then((m) => m.CatalogoComponent),
  },
  {
    path: 'login',
    loadComponent: () => import('./features/auth/login.component').then((m) => m.LoginComponent),
  },
  {
    path: 'registro',
    loadComponent: () => import('./features/auth/registro.component').then((m) => m.RegistroComponent),
  },
  {
    path: 'recuperar',
    loadComponent: () => import('./features/auth/recuperar.component').then((m) => m.RecuperarComponent),
  },
  {
    path: 'perfil',
    canActivate: [authGuard],
    loadComponent: () => import('./features/auth/perfil.component').then((m) => m.PerfilComponent),
  },
  {
    path: 'producto/:id',
    loadComponent: () =>
      import('./features/catalogo/producto-detalle.component').then((m) => m.ProductoDetalleComponent),
  },
  {
    path: 'carrito',
    canActivate: [authGuard],
    loadComponent: () => import('./features/compra/carrito.component').then((m) => m.CarritoComponent),
  },
  {
    path: 'checkout',
    canActivate: [rolGuard],
    data: { rol: 'cliente' },
    loadComponent: () => import('./features/compra/checkout.component').then((m) => m.CheckoutComponent),
  },
  {
    path: 'confirmacion',
    canActivate: [authGuard],
    loadComponent: () => import('./features/compra/confirmacion.component').then((m) => m.ConfirmacionComponent),
  },
  {
    path: 'mis-compras',
    canActivate: [rolGuard],
    data: { rol: 'cliente' },
    loadComponent: () => import('./features/compra/mis-compras.component').then((m) => m.MisComprasComponent),
  },
  {
    path: 'admin/productos',
    canActivate: [rolGuard],
    data: { rol: 'admin' },
    loadComponent: () => import('./features/admin/admin-productos.component').then((m) => m.AdminProductosComponent),
  },
  {
    path: 'admin/usuarios',
    canActivate: [rolGuard],
    data: { rol: 'admin' },
    loadComponent: () => import('./features/admin/admin-usuarios.component').then((m) => m.AdminUsuariosComponent),
  },
  {
    path: 'admin/inventario',
    canActivate: [rolGuard],
    data: { rol: 'admin' },
    loadComponent: () =>
      import('./features/admin/admin-inventario.component').then((m) => m.AdminInventarioComponent),
  },
  { path: '**', redirectTo: '' },
];

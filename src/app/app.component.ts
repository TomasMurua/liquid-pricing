import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AuthService } from './core/services/auth.service';
import { CarritoService } from './core/services/carrito.service';

/**
 * @description
 * Componente raíz: contiene el navbar dinámico (según sesión y rol) integrado
 * en toda la aplicación y el `router-outlet` donde se cargan las vistas.
 */
@Component({
  selector: 'app-root',
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  protected auth = inject(AuthService);
  protected carrito = inject(CarritoService);
  private router = inject(Router);

  /** Destino del logo según el rol de la sesión. */
  brandLink(): string {
    return this.auth.esAdmin() ? '/admin/productos' : '/';
  }

  /** Cierra la sesión y vuelve al login. */
  salir(event: Event): void {
    event.preventDefault();
    this.auth.logout();
    this.router.navigate(['/login']);
  }
}

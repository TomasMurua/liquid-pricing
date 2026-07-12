import { Usuario } from '../models/usuario.model';

/**
 * Usuarios semilla con los dos roles del sistema (admin y cliente).
 * Credenciales demo usadas para las pruebas y la presentación.
 */
export const USUARIOS_SEED: Usuario[] = [
  { rut: '11.111.111-1', nombre: 'Admin Demo', email: 'admin@liquid.cl', password: 'Admin123!', rol: 'admin' },
  { rut: '22.222.222-2', nombre: 'Cliente Demo', email: 'cliente@liquid.cl', password: 'Cliente123!', rol: 'cliente' },
];

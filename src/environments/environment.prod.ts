/**
 * Entorno de producción (Semana 8): consumo desde Firebase Realtime Database.
 * `useBackend: true` hace que los servicios consuman los JSON vía HttpClient
 * con GET/POST/PUT/DELETE.
 */
export const environment = {
  production: true,
  useBackend: true,
  firebaseUrl: 'https://liquid-pricing-default-rtdb.firebaseio.com',
};

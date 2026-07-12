import { TestBed } from '@angular/core/testing';
import { CarritoService } from './carrito.service';
import { Producto } from '../../models/producto.model';

describe('CarritoService', () => {
  let service: CarritoService;

  const producto = { id: 1, nombre: 'Notebook X', imagen: '' } as Producto;
  const oferta = { tienda: 'Falabella', precio: 1000, link: '', envio: 'Gratis' };

  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({ providers: [CarritoService] });
    service = TestBed.inject(CarritoService);
  });

  it('agrega el mismo producto+tienda deduplicando y sumando cantidad/total', () => {
    service.agregar(producto, oferta);
    service.agregar(producto, oferta);
    expect(service.items().length).toBe(1);
    expect(service.cantidad()).toBe(2);
    expect(service.total()).toBe(2000);
  });

  it('quita un ítem del carrito', () => {
    service.agregar(producto, oferta);
    service.quitar(0);
    expect(service.items().length).toBe(0);
    expect(service.total()).toBe(0);
  });
});

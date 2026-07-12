import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { ProductoService } from './producto.service';
import { environment } from '../../../environments/environment';
import { PRODUCTOS_SEED } from '../../data/productos.seed';

describe('ProductoService', () => {
  let service: ProductoService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ProductoService, provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(ProductoService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
    environment.useBackend = false;
  });

  it('en modo estático devuelve los productos semilla', (done) => {
    environment.useBackend = false;
    service.listar().subscribe((ps) => {
      expect(ps.length).toBe(PRODUCTOS_SEED.length);
      done();
    });
  });

  it('en modo backend hace GET a Firebase y convierte el mapa a un arreglo con key', () => {
    environment.useBackend = true;
    let resultado: any[] = [];
    service.listar().subscribe((ps) => (resultado = ps));

    const req = httpMock.expectOne(`${environment.firebaseUrl}/productos.json`);
    expect(req.request.method).toBe('GET');
    req.flush({
      '-Nabc': { id: 1, nombre: 'X', categoria: 'notebook', imagen: '', rating: null, descripcion: '', ofertas: [] },
    });

    expect(resultado.length).toBe(1);
    expect(resultado[0].key).toBe('-Nabc');
  });
});

import { FormControl } from '@angular/forms';
import { rutValidator, rutValido } from './rut.validator';

describe('rutValidator (RUT chileno, módulo 11)', () => {
  it('acepta RUTs con dígito verificador correcto', () => {
    expect(rutValido('11.111.111-1')).toBe(true);
    expect(rutValido('12.345.678-5')).toBe(true);
  });

  it('rechaza un RUT con dígito verificador incorrecto', () => {
    expect(rutValidator(new FormControl('11.111.111-2'))).toEqual({ rut: true });
  });

  it('deja pasar el valor vacío (lo cubre required)', () => {
    expect(rutValidator(new FormControl(''))).toBeNull();
  });
});

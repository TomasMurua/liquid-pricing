import { FormControl, FormGroup } from '@angular/forms';
import {
  passwordFuerteValidator,
  passwordMatchValidator,
  evaluarReglasPassword,
} from './password.validators';

describe('passwordFuerteValidator (5 reglas de seguridad)', () => {
  it('acepta una contraseña que cumple las 5 reglas', () => {
    expect(passwordFuerteValidator(new FormControl('Aa1!aaaa'))).toBeNull();
  });

  it('rechaza una contraseña débil', () => {
    expect(passwordFuerteValidator(new FormControl('abc'))).toEqual({ passwordDebil: true });
  });

  it('evaluarReglasPassword marca el estado de cada una de las 5 reglas', () => {
    const reglas = evaluarReglasPassword('abc');
    expect(reglas.length).toBe(5);
    expect(reglas.find((r) => r.id === 'min')?.ok).toBe(false);
    expect(reglas.find((r) => r.id === 'numero')?.ok).toBe(false);
  });
});

describe('passwordMatchValidator', () => {
  it('detecta cuando la confirmación no coincide', () => {
    const grupo = new FormGroup({
      password: new FormControl('Aa1!aaaa'),
      confirmar: new FormControl('distinta'),
    });
    expect(passwordMatchValidator('password', 'confirmar')(grupo)).toEqual({ passwordMismatch: true });
  });

  it('no marca error cuando coinciden', () => {
    const grupo = new FormGroup({
      password: new FormControl('Aa1!aaaa'),
      confirmar: new FormControl('Aa1!aaaa'),
    });
    expect(passwordMatchValidator('password', 'confirmar')(grupo)).toBeNull();
  });
});

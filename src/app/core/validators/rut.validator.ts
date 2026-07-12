import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

/**
 * Valida un RUT chileno mediante el algoritmo del módulo 11.
 * @param rut RUT con o sin puntos y guion (ej: `"11.111.111-1"`).
 * @returns `true` si el dígito verificador es correcto.
 */
export function rutValido(rut: string): boolean {
  const limpio = String(rut).replace(/[.\-\s]/g, '').toUpperCase();
  if (limpio.length < 2) return false;
  const cuerpo = limpio.slice(0, -1);
  const dv = limpio.slice(-1);
  if (!/^\d+$/.test(cuerpo)) return false;

  let suma = 0;
  let mul = 2;
  for (let i = cuerpo.length - 1; i >= 0; i--) {
    suma += +cuerpo[i] * mul;
    mul = mul === 7 ? 2 : mul + 1;
  }
  const res = 11 - (suma % 11);
  const dvEsperado = res === 11 ? '0' : res === 10 ? 'K' : String(res);
  return dv === dvEsperado;
}

/**
 * Validator de Angular para RUT chileno. Deja pasar el valor vacío
 * (esa responsabilidad es de `Validators.required`).
 */
export const rutValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
  const v = control.value;
  if (!v) return null;
  return rutValido(v) ? null : { rut: true };
};

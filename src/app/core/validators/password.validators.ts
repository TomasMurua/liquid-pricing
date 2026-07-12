import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

/** Resultado de evaluar una regla de contraseña (para el feedback en vivo). */
export interface ReglaPassword {
  id: string;
  msg: string;
  ok: boolean;
}

const REGLAS: { id: string; msg: string; test: (v: string) => boolean }[] = [
  { id: 'min', msg: 'Mínimo 8 caracteres', test: (v) => v.length >= 8 },
  { id: 'max', msg: 'Máximo 30 caracteres', test: (v) => v.length <= 30 },
  { id: 'mayus_minus', msg: 'Mayúscula y minúscula', test: (v) => /[a-z]/.test(v) && /[A-Z]/.test(v) },
  { id: 'numero', msg: 'Al menos un número', test: (v) => /\d/.test(v) },
  { id: 'especial', msg: 'Un carácter especial', test: (v) => /[^A-Za-z0-9]/.test(v) },
];

/**
 * Evalúa las 5 reglas de seguridad contra un valor, para mostrar el checklist.
 * @param v Contraseña a evaluar.
 * @returns Lista de reglas con su estado `ok`.
 */
export function evaluarReglasPassword(v: string): ReglaPassword[] {
  const valor = v ?? '';
  return REGLAS.map((r) => ({ id: r.id, msg: r.msg, ok: r.test(valor) }));
}

/**
 * Validator que exige el cumplimiento de las 5 reglas de seguridad.
 * Deja pasar el vacío (lo cubre `Validators.required`).
 */
export const passwordFuerteValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
  const v = control.value;
  if (!v) return null;
  return REGLAS.some((r) => !r.test(v)) ? { passwordDebil: true } : null;
};

/**
 * Validator de grupo que verifica que dos campos de contraseña coincidan.
 * @param campoA Nombre del control de contraseña.
 * @param campoB Nombre del control de confirmación.
 */
export function passwordMatchValidator(campoA: string, campoB: string): ValidatorFn {
  return (group: AbstractControl): ValidationErrors | null => {
    const a = group.get(campoA)?.value;
    const b = group.get(campoB)?.value;
    if (b == null || b === '') return null;
    return a === b ? null : { passwordMismatch: true };
  };
}

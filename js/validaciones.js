// js/validaciones.js
export const reglasPassword = [
  { id: "min", test: v => v.length >= 8, msg: "Mínimo 8 caracteres" },
  { id: "max", test: v => v.length <= 30, msg: "Máximo 30 caracteres" },
  { id: "mayus_minus", test: v => /[a-z]/.test(v) && /[A-Z]/.test(v), msg: "Mayúscula y minúscula" },
  { id: "numero", test: v => /\d/.test(v), msg: "Al menos un número" },
  { id: "especial", test: v => /[^A-Za-z0-9]/.test(v), msg: "Un carácter especial" },
];
export const validarPassword = v => reglasPassword.map(r => ({ ...r, ok: r.test(v) }));
export const passwordValida = v => reglasPassword.every(r => r.test(v));
export const emailValido = v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
export const requerido = v => v != null && String(v).trim() !== "";

export function rutValido(rut) {
  const limpio = String(rut).replace(/[.\-\s]/g, "").toUpperCase();
  if (limpio.length < 2) return false;
  const cuerpo = limpio.slice(0, -1), dv = limpio.slice(-1);
  if (!/^\d+$/.test(cuerpo)) return false;
  let suma = 0, mul = 2;
  for (let i = cuerpo.length - 1; i >= 0; i--) { suma += +cuerpo[i] * mul; mul = mul === 7 ? 2 : mul + 1; }
  const res = 11 - (suma % 11);
  const dvEsperado = res === 11 ? "0" : res === 10 ? "K" : String(res);
  return dv === dvEsperado;
}

// Pinta feedback Bootstrap en un input
export function marcar(input, ok) {
  input.classList.toggle("is-valid", ok);
  input.classList.toggle("is-invalid", !ok);
  return ok;
}

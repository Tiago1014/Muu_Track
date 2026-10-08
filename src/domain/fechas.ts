// Fecha de referencia fija de la demo: así los datos salen siempre iguales.
export const HOY = '2026-10-08'

const DIA_MS = 86_400_000

function aMs(fecha: string): number {
  const [a, m, d] = fecha.split('-').map(Number)
  return Date.UTC(a, m - 1, d)
}

export function diasEntre(desde: string, hasta: string): number {
  return Math.round((aMs(hasta) - aMs(desde)) / DIA_MS)
}

export function sumarDias(fecha: string, dias: number): string {
  return new Date(aMs(fecha) + dias * DIA_MS).toISOString().slice(0, 10)
}

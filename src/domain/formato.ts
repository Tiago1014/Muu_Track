import type { Animal, Grupo } from './tipos'

/** dd/mm a partir de AAAA-MM-DD */
export function fechaCorta(fecha: string): string {
  return `${fecha.slice(8, 10)}/${fecha.slice(5, 7)}`
}

/** Número con coma decimal, como se escribe en Uruguay. */
export function decimal(n: number, cifras = 1): string {
  const texto = Math.abs(n).toFixed(cifras).replace('.', ',')
  const esCero = Number(texto.replace(',', '.')) === 0
  return n < 0 && !esCero ? `−${texto}` : texto
}

export function conSigno(n: number): string {
  if (n > 0) return `+${Math.round(n)}`
  if (n < 0) return `−${Math.abs(Math.round(n))}`
  return '0'
}

export function nombreCategoria(animal: Pick<Animal, 'categoria' | 'sexo' | 'descarte'>): string {
  switch (animal.categoria) {
    case 'ternero':
      return animal.sexo === 'hembra' ? 'Ternera' : 'Ternero'
    case 'novillo':
      return 'Novillo'
    case 'vaquillona':
      return 'Vaquillona'
    case 'vaca':
      return animal.descarte ? 'Vaca de descarte' : 'Vaca'
  }
}

export const GRUPOS: Record<Grupo, { nombre: string; plural: string; fondo: string; texto: string }> = {
  listo: { nombre: 'Listo para vender', plural: 'Listos para vender', fondo: 'bg-campo', texto: 'text-campo-oscuro' },
  creciendo: { nombre: 'Creciendo bien', plural: 'Creciendo bien', fondo: 'bg-blue-700', texto: 'text-blue-800' },
  atrasado: { nombre: 'Atrasado', plural: 'Atrasados', fondo: 'bg-orange-700', texto: 'text-orange-800' },
}

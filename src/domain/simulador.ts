import { HOY, diasEntre } from './fechas'
import { gananciaDiaria, ultimoPesaje } from './reglas'
import type { Animal, Categoria } from './tipos'

export const PESO_TIPICO: Record<Categoria, number> = {
  ternero: 140,
  novillo: 380,
  vaquillona: 300,
  vaca: 430,
}

export const GANANCIA_TIPICA: Record<Categoria, number> = {
  ternero: 0.75,
  novillo: 0.55,
  vaquillona: 0.55,
  vaca: 0,
}

const VARIACION = 0.02 // ±2% al medir
const MARGEN = 0.1 // ±10% que se le muestra al productor

type AnimalMedible = Pick<Animal, 'categoria' | 'pesajes'>

/** Peso simulado: último peso + ganancia típica × días desde el último pesaje, ±2%. */
export function pesoSimulado(animal: AnimalMedible, hoy = HOY, azar: () => number = Math.random): number {
  const variacion = 1 + (azar() * 2 - 1) * VARIACION
  const ultimo = ultimoPesaje(animal)
  if (!ultimo) return Math.round(PESO_TIPICO[animal.categoria] * variacion)

  const ganancia = gananciaDiaria(animal) ?? GANANCIA_TIPICA[animal.categoria]
  const dias = Math.max(0, diasEntre(ultimo.fecha, hoy))
  return Math.round((ultimo.kg + ganancia * dias) * variacion)
}

export function rangoPeso(kg: number): { min: number; max: number } {
  return { min: Math.round(kg * (1 - MARGEN)), max: Math.round(kg * (1 + MARGEN)) }
}

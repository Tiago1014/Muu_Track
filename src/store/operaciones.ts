import { HOY } from '../domain/fechas'
import type { Animal, Categoria, Nota, Sexo } from '../domain/tipos'

const SEXO_POR_CATEGORIA: Record<Categoria, Sexo> = {
  ternero: 'macho',
  novillo: 'macho',
  vaquillona: 'hembra',
  vaca: 'hembra',
}

const EDAD_POR_CATEGORIA: Record<Categoria, number> = {
  ternero: 6,
  novillo: 24,
  vaquillona: 20,
  vaca: 60,
}

/** Animal nuevo, todavía sin pesajes (el primero se agrega al guardar la medición). */
export function animalNuevo(caravana: number, categoria: Categoria): Animal {
  return {
    caravana,
    categoria,
    sexo: SEXO_POR_CATEGORIA[categoria],
    edadMeses: EDAD_POR_CATEGORIA[categoria],
    potrero: 'Potrero del Monte',
    descarte: false,
    pesajes: [],
  }
}

/** Guarda un pesaje. Si ya hay uno de la misma fecha, lo reemplaza (un pesaje por día). */
export function conPesaje(
  animales: Animal[],
  caravana: number,
  kg: number,
  notas: Nota[],
  fecha = HOY,
): Animal[] {
  return animales.map((a) => {
    if (a.caravana !== caravana) return a
    const otros = a.pesajes.filter((p) => p.fecha !== fecha)
    return { ...a, pesajes: [...otros, { fecha, kg, notas }].sort((x, y) => x.fecha.localeCompare(y.fecha)) }
  })
}

export function conAnimal(animales: Animal[], animal: Animal): Animal[] {
  if (animales.some((a) => a.caravana === animal.caravana)) return animales
  return [...animales, animal].sort((a, b) => a.caravana - b.caravana)
}

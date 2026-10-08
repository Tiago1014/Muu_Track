import { generarRodeo } from '../domain/semilla'
import type { Animal } from '../domain/tipos'

// Si cambian los datos de ejemplo, se sube la versión y cada celular carga los nuevos.
export const CLAVE = 'muutrack:v1'

type Almacenamiento = Pick<Storage, 'getItem' | 'setItem' | 'removeItem'>

function localStorageSeguro(): Almacenamiento | null {
  try {
    return window.localStorage
  } catch {
    return null
  }
}

export function guardar(animales: Animal[], almacen: Almacenamiento | null = localStorageSeguro()): void {
  try {
    almacen?.setItem(CLAVE, JSON.stringify(animales))
  } catch {
    // Sin espacio o modo privado: la app sigue andando con los datos en memoria.
  }
}

/** Lee el rodeo guardado; si no hay nada (o está dañado), carga los datos de ejemplo. */
export function cargar(almacen: Almacenamiento | null = localStorageSeguro()): Animal[] {
  try {
    const crudo = almacen?.getItem(CLAVE)
    if (crudo) {
      const datos = JSON.parse(crudo)
      if (Array.isArray(datos) && datos.length > 0) return datos as Animal[]
    }
  } catch {
    // Datos dañados: se vuelve a los de ejemplo.
  }
  const inicial = generarRodeo()
  guardar(inicial, almacen)
  return inicial
}

/** Borra lo guardado y vuelve a cargar los datos de ejemplo ("Reiniciar demo"). */
export function reiniciar(almacen: Almacenamiento | null = localStorageSeguro()): Animal[] {
  try {
    almacen?.removeItem(CLAVE)
  } catch {
    // Igual se regeneran abajo.
  }
  return cargar(almacen)
}

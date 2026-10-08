import { HOY, diasEntre } from './fechas'
import type { Animal, Categoria, Grupo, Pesaje, Potrero } from './tipos'

export const PESO_VENTA: Record<Categoria, number> = {
  ternero: 180,
  novillo: 470,
  vaquillona: 380,
  vaca: 420, // solo vacas de descarte
}

export const VENTANA_DIAS = 60
export const UMBRAL_ATRASADO = 0.2 // kg por día
export const DIAS_AVISO_POTRERO = 45

export function ultimoPesaje(animal: Pick<Animal, 'pesajes'>): Pesaje | undefined {
  return animal.pesajes[animal.pesajes.length - 1]
}

/** Peso de venta del animal, o null si no aplica (vaca que no es de descarte). */
export function pesoVenta(animal: Pick<Animal, 'categoria' | 'descarte'>): number | null {
  if (animal.categoria === 'vaca' && !animal.descarte) return null
  return PESO_VENTA[animal.categoria]
}

/**
 * Ganancia diaria: (último peso − peso de hace unos 60 días) ÷ días entre los dos pesajes.
 * "Hace unos 60 días" = el pesaje anterior más cercano a 60 días (hasta 75).
 * Si no hay ninguno en esa ventana, se usan los dos últimos. Devuelve null con menos de 2 pesajes.
 */
export function gananciaDiaria(animal: Pick<Animal, 'pesajes'>): number | null {
  const p = animal.pesajes
  if (p.length < 2) return null
  const ultimo = p[p.length - 1]
  const anteriores = p.slice(0, -1)

  let base = anteriores[anteriores.length - 1]
  let mejor = Infinity
  for (const a of anteriores) {
    const dias = diasEntre(a.fecha, ultimo.fecha)
    if (dias > VENTANA_DIAS + 15) continue
    const distancia = Math.abs(dias - VENTANA_DIAS)
    if (distancia < mejor) {
      mejor = distancia
      base = a
    }
  }

  const dias = diasEntre(base.fecha, ultimo.fecha)
  return dias > 0 ? (ultimo.kg - base.kg) / dias : null
}

export function grupoDe(animal: Animal): Grupo {
  const ultimo = ultimoPesaje(animal)
  const venta = pesoVenta(animal)
  if (ultimo && venta !== null && ultimo.kg >= venta) return 'listo'

  const aplicaAtraso = animal.categoria !== 'vaca' || animal.descarte
  const ganancia = gananciaDiaria(animal)
  if (aplicaAtraso && animal.pesajes.length >= 3 && ganancia !== null && ganancia < UMBRAL_ATRASADO) {
    return 'atrasado'
  }
  return 'creciendo'
}

/** Kilos que le faltan para el peso de venta (0 si ya llegó), o null si no aplica. */
export function kgParaVenta(animal: Animal): number | null {
  const venta = pesoVenta(animal)
  const ultimo = ultimoPesaje(animal)
  if (venta === null || !ultimo) return null
  return Math.max(0, venta - ultimo.kg)
}

export function contarPorGrupo(animales: Animal[]): Record<Grupo, number> {
  const cuenta: Record<Grupo, number> = { listo: 0, creciendo: 0, atrasado: 0 }
  for (const a of animales) cuenta[grupoDe(a)]++
  return cuenta
}

/** Días desde el pesaje más reciente de cualquier animal del potrero. */
export function diasSinPesarPotrero(animales: Animal[], potrero: Potrero, hoy = HOY): number | null {
  let ultima: string | null = null
  for (const a of animales) {
    if (a.potrero !== potrero) continue
    const f = ultimoPesaje(a)?.fecha
    if (f && (!ultima || f > ultima)) ultima = f
  }
  return ultima ? diasEntre(ultima, hoy) : null
}

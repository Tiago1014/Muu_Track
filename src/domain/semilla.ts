import { HOY, sumarDias } from './fechas'
import { PESO_VENTA } from './reglas'
import { NOTAS, POTREROS } from './tipos'
import type { Animal, Categoria, Pesaje, Potrero, Sexo } from './tipos'

const SEMILLA = 20261008
export const INICIO_DATOS = '2026-04-01'

function mulberry32(semilla: number): () => number {
  let s = semilla
  return () => {
    s = (s + 0x6d2b79f5) | 0
    let t = Math.imul(s ^ (s >>> 15), 1 | s)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

interface Parametros {
  final: [number, number] // peso del último pesaje (salvo los "listos")
  ganancia: [number, number] // kg por día
  separacion: [number, number] // días entre pesajes
  piso: number // peso mínimo creíble hacia atrás
  edad: [number, number]
}

const PARAMETROS: Record<Categoria, Parametros> = {
  ternero: { final: [140, 165], ganancia: [0.6, 0.85], separacion: [30, 36], piso: 45, edad: [4, 9] },
  novillo: { final: [330, 430], ganancia: [0.4, 0.7], separacion: [30, 45], piso: 200, edad: [20, 30] },
  vaquillona: { final: [280, 345], ganancia: [0.4, 0.7], separacion: [30, 45], piso: 150, edad: [14, 26] },
  vaca: { final: [400, 480], ganancia: [-0.05, 0.1], separacion: [30, 45], piso: 250, edad: [36, 120] },
}

// Las vacas de descarte se están engordando para vender, por eso ganan peso.
const DESCARTE: Pick<Parametros, 'final' | 'ganancia'> = { final: [340, 395], ganancia: [0.35, 0.5] }

type Especial = 'listo' | 'atrasado'

interface Plan {
  categoria: Categoria
  descarte: boolean
  especial?: Especial
  caravana?: number
}

/** La composición exacta del rodeo: 35 vacas, 30 terneros, 15 novillos y 10 vaquillonas. */
function armarPlanes(): Plan[] {
  const planes: Plan[] = []
  for (let i = 0; i < 35; i++) planes.push({ categoria: 'vaca', descarte: i < 6 })
  for (let i = 0; i < 30; i++) {
    const especial: Especial | undefined = i < 2 ? 'listo' : i === 2 ? 'atrasado' : undefined
    planes.push({ categoria: 'ternero', descarte: false, especial })
  }
  for (let i = 0; i < 15; i++) {
    const especial: Especial | undefined = i < 3 ? 'listo' : i < 5 ? 'atrasado' : undefined
    planes.push({ categoria: 'novillo', descarte: false, especial, caravana: i === 3 ? 1234 : undefined })
  }
  for (let i = 0; i < 10; i++) {
    planes.push({ categoria: 'vaquillona', descarte: false, especial: i === 0 ? 'atrasado' : undefined })
  }
  return planes
}

export function generarRodeo(semilla = SEMILLA): Animal[] {
  const azar = mulberry32(semilla)
  const entero = (min: number, max: number) => min + Math.floor(azar() * (max - min + 1))
  const real = (min: number, max: number) => min + azar() * (max - min)
  const elegir = <T>(lista: T[]): T => lista[Math.floor(azar() * lista.length)]

  const planes = armarPlanes()
  const usadas = new Set<number>(planes.flatMap((p) => (p.caravana ? [p.caravana] : [])))

  const animales = planes.map((plan): Animal => {
    let caravana = plan.caravana
    while (caravana === undefined) {
      const c = entero(1000, 9999)
      if (!usadas.has(c)) {
        usadas.add(c)
        caravana = c
      }
    }

    // Los casos especiales van a potreros que se pesan seguido; el Chico queda sin pesar.
    const potrero: Potrero = plan.especial
      ? elegir(POTREROS.filter((p) => p !== 'Potrero Chico'))
      : elegir(POTREROS)

    const base = PARAMETROS[plan.categoria]
    const esDescarte = plan.categoria === 'vaca' && plan.descarte
    const params = esDescarte ? { ...base, ...DESCARTE } : base
    const sexo: Sexo =
      plan.categoria === 'novillo'
        ? 'macho'
        : plan.categoria === 'ternero'
          ? elegir<Sexo>(['macho', 'hembra'])
          : 'hembra'

    const pesoFinal =
      plan.especial === 'listo'
        ? PESO_VENTA[plan.categoria] + entero(3, 25)
        : plan.caravana === 1234
          ? 410
          : entero(params.final[0], params.final[1])

    const notasPosibles = NOTAS.filter((n) => n !== 'Preñada' || sexo === 'hembra')

    const generarPesajes = (): Pesaje[] => {
      for (let intento = 0; intento < 200; intento++) {
        const ganancia = real(params.ganancia[0], params.ganancia[1])
        const ultima =
          potrero === 'Potrero Chico' ? sumarDias(HOY, -entero(46, 60)) : sumarDias(HOY, -entero(3, 40))
        const cantidad = entero(4, 6)
        const lista: Pesaje[] = [{ fecha: ultima, kg: pesoFinal, notas: [] }]

        while (lista.length < cantidad) {
          const salto = entero(params.separacion[0], params.separacion[1])
          const fecha = sumarDias(lista[0].fecha, -salto)
          if (fecha < INICIO_DATOS) break
          // Los "atrasados" se quedan clavados en los últimos 3 pesajes.
          const gana = plan.especial === 'atrasado' && lista.length < 3 ? 0 : ganancia
          const kg = Math.round(lista[0].kg - gana * salto) + entero(-1, 1)
          if (kg < params.piso) break
          lista.unshift({ fecha, kg, notas: [] })
        }

        if (lista.length >= 4) {
          for (const p of lista.slice(0, -1)) {
            if (azar() < 0.3) p.notas = [elegir(notasPosibles)]
          }
          return lista
        }
      }
      throw new Error('No se pudieron generar pesajes para el animal ' + caravana)
    }

    return {
      caravana,
      categoria: plan.categoria,
      sexo,
      edadMeses: entero(params.edad[0], params.edad[1]),
      potrero,
      descarte: esDescarte,
      pesajes: generarPesajes(),
    }
  })

  return animales.sort((a, b) => a.caravana - b.caravana)
}

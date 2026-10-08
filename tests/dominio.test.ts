import { describe, expect, it } from 'vitest'
import { HOY, diasEntre } from '../src/domain/fechas'
import {
  contarPorGrupo,
  diasSinPesarPotrero,
  gananciaDiaria,
  grupoDe,
  kgParaVenta,
  ultimoPesaje,
} from '../src/domain/reglas'
import { INICIO_DATOS, generarRodeo } from '../src/domain/semilla'
import { pesoSimulado, rangoPeso } from '../src/domain/simulador'
import type { Animal } from '../src/domain/tipos'

const rodeo = generarRodeo()
const porCaravana = (n: number) => rodeo.find((a) => a.caravana === n)!

function animalDe(pesajes: [string, number][], extra: Partial<Animal> = {}): Animal {
  return {
    caravana: 1,
    categoria: 'novillo',
    sexo: 'macho',
    edadMeses: 24,
    potrero: 'El Bajo',
    descarte: false,
    pesajes: pesajes.map(([fecha, kg]) => ({ fecha, kg, notas: [] })),
    ...extra,
  }
}

describe('datos de ejemplo', () => {
  it('salen siempre iguales con la misma semilla', () => {
    expect(generarRodeo()).toEqual(rodeo)
  })

  it('hay 90 animales con la composición del PRD', () => {
    expect(rodeo).toHaveLength(90)
    const cuenta = (c: string) => rodeo.filter((a) => a.categoria === c).length
    expect(cuenta('vaca')).toBe(35)
    expect(cuenta('ternero')).toBe(30)
    expect(cuenta('novillo')).toBe(15)
    expect(cuenta('vaquillona')).toBe(10)
    expect(rodeo.filter((a) => a.descarte)).toHaveLength(6)
  })

  it('las caravanas son de 4 dígitos y no se repiten', () => {
    const caravanas = rodeo.map((a) => a.caravana)
    expect(new Set(caravanas).size).toBe(90)
    for (const c of caravanas) {
      expect(c).toBeGreaterThanOrEqual(1000)
      expect(c).toBeLessThanOrEqual(9999)
    }
  })

  it('cada animal tiene de 4 a 6 pesajes separados 30 a 45 días, desde abril hasta hoy', () => {
    for (const a of rodeo) {
      expect(a.pesajes.length).toBeGreaterThanOrEqual(4)
      expect(a.pesajes.length).toBeLessThanOrEqual(6)
      expect(a.pesajes[0].fecha >= INICIO_DATOS).toBe(true)
      expect(ultimoPesaje(a)!.fecha <= HOY).toBe(true)
      for (let i = 1; i < a.pesajes.length; i++) {
        const dias = diasEntre(a.pesajes[i - 1].fecha, a.pesajes[i].fecha)
        expect(dias).toBeGreaterThanOrEqual(30)
        expect(dias).toBeLessThanOrEqual(45)
      }
    }
  })

  it('los grupos dan 5 listos / 81 creciendo bien / 4 atrasados', () => {
    expect(contarPorGrupo(rodeo)).toEqual({ listo: 5, creciendo: 81, atrasado: 4 })
  })

  it('la caravana 1234 es un novillo atrasado, sin ganar peso en 60 días', () => {
    const a = porCaravana(1234)
    expect(a.categoria).toBe('novillo')
    expect(grupoDe(a)).toBe('atrasado')
    expect(gananciaDiaria(a)!).toBeLessThan(0.2)
  })

  it('los listos son 3 novillos y 2 terneros', () => {
    const listos = rodeo.filter((a) => grupoDe(a) === 'listo')
    expect(listos.filter((a) => a.categoria === 'novillo')).toHaveLength(3)
    expect(listos.filter((a) => a.categoria === 'ternero')).toHaveLength(2)
    expect(listos).toHaveLength(5)
  })

  it('el Potrero Chico no se pesa hace más de 45 días y los demás sí', () => {
    expect(diasSinPesarPotrero(rodeo, 'Potrero Chico')!).toBeGreaterThan(45)
    for (const p of ['Potrero del Monte', 'La Cañada', 'El Bajo'] as const) {
      expect(diasSinPesarPotrero(rodeo, p)!).toBeLessThanOrEqual(45)
    }
  })
})

describe('reglas de negocio', () => {
  it('la ganancia diaria usa el pesaje de hace unos 60 días', () => {
    const a = animalDe([
      ['2026-06-01', 300],
      ['2026-07-11', 330],
      ['2026-08-10', 350],
    ])
    // Anteriores a 70 y 30 días del último: el de 70 es el más cercano a 60.
    expect(gananciaDiaria(a)).toBeCloseTo((350 - 300) / 70, 5)
  })

  it('sin pesajes en la ventana usa los dos últimos', () => {
    const a = animalDe([
      ['2026-01-01', 200],
      ['2026-08-01', 400],
      ['2026-08-31', 418],
    ])
    expect(gananciaDiaria(a)).toBeCloseTo(18 / 30, 5)
  })

  it('con menos de 2 pesajes no hay ganancia', () => {
    expect(gananciaDiaria(animalDe([['2026-08-01', 300]]))).toBeNull()
  })

  it('una vaca que no es de descarte nunca es listo ni atrasada', () => {
    const vaca = animalDe(
      [
        ['2026-06-01', 480],
        ['2026-07-05', 480],
        ['2026-08-10', 480],
      ],
      { categoria: 'vaca', sexo: 'hembra' },
    )
    expect(grupoDe(vaca)).toBe('creciendo')
    expect(kgParaVenta(vaca)).toBeNull()
  })

  it('un animal con menos de 3 pesajes no puede ser atrasado', () => {
    const a = animalDe([
      ['2026-07-01', 400],
      ['2026-08-10', 400],
    ])
    expect(grupoDe(a)).toBe('creciendo')
  })

  it('llegar al peso de venta lo pasa a listo y le faltan 0 kg', () => {
    const a = animalDe([
      ['2026-07-01', 440],
      ['2026-08-10', 470],
    ])
    expect(grupoDe(a)).toBe('listo')
    expect(kgParaVenta(a)).toBe(0)
  })
})

describe('peso simulado', () => {
  const animal = animalDe([
    ['2026-07-01', 400],
    ['2026-08-10', 424], // 0,6 kg por día
  ])

  it('suma la ganancia típica por los días desde el último pesaje', () => {
    // 59 días desde el 10/08 hasta el 08/10 → 424 + 0,6 × 59 = 459,4
    expect(pesoSimulado(animal, HOY, () => 0.5)).toBe(459)
  })

  it('varía como máximo ±2%', () => {
    expect(pesoSimulado(animal, HOY, () => 0)).toBe(Math.round(459.4 * 0.98))
    expect(pesoSimulado(animal, HOY, () => 1)).toBe(Math.round(459.4 * 1.02))
  })

  it('un animal nuevo usa el peso típico de su categoría', () => {
    expect(pesoSimulado({ categoria: 'ternero', pesajes: [] }, HOY, () => 0.5)).toBe(140)
    expect(pesoSimulado({ categoria: 'novillo', pesajes: [] }, HOY, () => 0.5)).toBe(380)
  })

  it('el rango es ±10% del peso estimado', () => {
    expect(rangoPeso(420)).toEqual({ min: 378, max: 462 })
  })
})

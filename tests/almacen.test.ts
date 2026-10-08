import { describe, expect, it } from 'vitest'
import { generarRodeo } from '../src/domain/semilla'
import { CLAVE, cargar, guardar, reiniciar } from '../src/store/almacen'
import { animalNuevo, conAnimal, conPesaje } from '../src/store/operaciones'

function falsoStorage(inicial: Record<string, string> = {}) {
  const datos = { ...inicial }
  return {
    datos,
    getItem: (k: string) => datos[k] ?? null,
    setItem: (k: string, v: string) => void (datos[k] = v),
    removeItem: (k: string) => void delete datos[k],
  }
}

describe('almacenamiento local', () => {
  it('la primera vez carga los datos de ejemplo y los guarda', () => {
    const s = falsoStorage()
    expect(cargar(s)).toEqual(generarRodeo())
    expect(JSON.parse(s.datos[CLAVE])).toHaveLength(90)
  })

  it('lo guardado se recupera tal cual', () => {
    const s = falsoStorage()
    const rodeo = conPesaje(generarRodeo(), 1234, 415, ['Rengo'])
    guardar(rodeo, s)
    expect(cargar(s)).toEqual(rodeo)
  })

  it('con datos dañados vuelve a los de ejemplo', () => {
    expect(cargar(falsoStorage({ [CLAVE]: '{no es json' }))).toHaveLength(90)
  })

  it('reiniciar demo borra lo guardado y recarga los de ejemplo', () => {
    const s = falsoStorage()
    guardar(conPesaje(generarRodeo(), 1234, 999, []), s)
    expect(reiniciar(s)).toEqual(generarRodeo())
    expect(cargar(s)).toEqual(generarRodeo())
  })

  it('anda aunque no haya almacenamiento', () => {
    expect(cargar(null)).toHaveLength(90)
  })
})

describe('operaciones sobre el rodeo', () => {
  it('guardar un pesaje lo agrega al final del animal', () => {
    const antes = generarRodeo()
    const despues = conPesaje(antes, 1234, 415, ['Vacunado'])
    const a = despues.find((x) => x.caravana === 1234)!
    const previo = antes.find((x) => x.caravana === 1234)!
    expect(a.pesajes).toHaveLength(previo.pesajes.length + 1)
    expect(a.pesajes.at(-1)).toEqual({ fecha: '2026-10-08', kg: 415, notas: ['Vacunado'] })
  })

  it('dos pesajes el mismo día se reemplazan', () => {
    let rodeo = conPesaje(generarRodeo(), 1234, 415, [])
    rodeo = conPesaje(rodeo, 1234, 420, [])
    const a = rodeo.find((x) => x.caravana === 1234)!
    expect(a.pesajes.filter((p) => p.fecha === '2026-10-08')).toHaveLength(1)
    expect(a.pesajes.at(-1)!.kg).toBe(420)
  })

  it('un animal nuevo se agrega una sola vez', () => {
    const base = generarRodeo()
    const libre = [1000, 1001, 1002].find((n) => !base.some((a) => a.caravana === n))!
    const uno = conAnimal(base, animalNuevo(libre, 'ternero'))
    expect(uno).toHaveLength(91)
    expect(conAnimal(uno, animalNuevo(libre, 'ternero'))).toHaveLength(91)
  })
})

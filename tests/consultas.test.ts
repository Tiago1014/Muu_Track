import { describe, expect, it } from 'vitest'
import { avisos, ultimosPesados } from '../src/domain/consultas'
import { conSigno, decimal, fechaCorta, nombreCategoria } from '../src/domain/formato'
import { ultimoPesaje } from '../src/domain/reglas'
import { generarRodeo } from '../src/domain/semilla'

const rodeo = generarRodeo()

describe('consultas', () => {
  it('últimos pesados: 5 animales, del pesaje más reciente al más viejo', () => {
    const lista = ultimosPesados(rodeo)
    expect(lista).toHaveLength(5)
    const fechas = lista.map((a) => ultimoPesaje(a)!.fecha)
    expect(fechas).toEqual([...fechas].sort().reverse())
  })

  it('el inicio muestra los 3 avisos del PRD', () => {
    const lista = avisos(rodeo)
    expect(lista).toHaveLength(3)
    expect(lista[0].texto).toBe('5 animales llegaron al peso de venta. Tocá para verlos.')
    expect(lista[0].a).toBe('/rodeo?grupo=listo')
    expect(lista[1].texto).toBe('El animal 1234 no ganó peso en 60 días. Conviene revisarlo.')
    expect(lista[1].a).toBe('/animal/1234')
    expect(lista[2].texto).toBe('Hace más de 45 días que no pesás el Potrero Chico.')
  })
})

describe('formato', () => {
  it('fecha corta y decimales con coma', () => {
    expect(fechaCorta('2026-08-12')).toBe('12/08')
    expect(decimal(0.62)).toBe('0,6')
    expect(decimal(-0.04)).toBe('0,0')
    expect(decimal(-0.5)).toBe('−0,5')
  })

  it('signos de la diferencia de peso', () => {
    expect(conSigno(18)).toBe('+18')
    expect(conSigno(-4)).toBe('−4')
  })

  it('nombres de categoría', () => {
    expect(nombreCategoria({ categoria: 'ternero', sexo: 'hembra', descarte: false })).toBe('Ternera')
    expect(nombreCategoria({ categoria: 'vaca', sexo: 'hembra', descarte: true })).toBe('Vaca de descarte')
  })
})

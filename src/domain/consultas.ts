import { HOY } from './fechas'
import { DIAS_AVISO_POTRERO, diasSinPesarPotrero, grupoDe, ultimoPesaje } from './reglas'
import { POTREROS } from './tipos'
import type { Animal, Potrero } from './tipos'

/** Los animales pesados más recientemente (para la lista "Últimos pesados"). */
export function ultimosPesados(animales: Animal[], cantidad = 5): Animal[] {
  return animales
    .filter((a) => a.pesajes.length > 0)
    .sort((a, b) => {
      const porFecha = ultimoPesaje(b)!.fecha.localeCompare(ultimoPesaje(a)!.fecha)
      return porFecha !== 0 ? porFecha : a.caravana - b.caravana
    })
    .slice(0, cantidad)
}

export interface Aviso {
  id: string
  texto: string
  a: string // ruta a la que lleva la tarjeta
}

const CON_ARTICULO: Record<Potrero, string> = {
  'Potrero del Monte': 'el Potrero del Monte',
  'La Cañada': 'La Cañada',
  'El Bajo': 'El Bajo',
  'Potrero Chico': 'el Potrero Chico',
}

/** Avisos del inicio: cada uno lleva a una decisión concreta. */
export function avisos(animales: Animal[], hoy = HOY): Aviso[] {
  const lista: Aviso[] = []

  const listos = animales.filter((a) => grupoDe(a) === 'listo').length
  if (listos > 0) {
    lista.push({
      id: 'listos',
      texto:
        listos === 1
          ? '1 animal llegó al peso de venta. Tocá para verlo.'
          : `${listos} animales llegaron al peso de venta. Tocá para verlos.`,
      a: '/rodeo?grupo=listo',
    })
  }

  const atrasados = animales.filter((a) => grupoDe(a) === 'atrasado')
  const atrasado = atrasados.find((a) => a.caravana === 1234) ?? atrasados[0]
  if (atrasado) {
    lista.push({
      id: 'atrasado',
      texto: `El animal ${atrasado.caravana} no ganó peso en 60 días. Conviene revisarlo.`,
      a: `/animal/${atrasado.caravana}`,
    })
  }

  for (const potrero of POTREROS) {
    const dias = diasSinPesarPotrero(animales, potrero, hoy)
    if (dias !== null && dias > DIAS_AVISO_POTRERO) {
      lista.push({
        id: `potrero-${potrero}`,
        texto: `Hace más de ${DIAS_AVISO_POTRERO} días que no pesás ${CON_ARTICULO[potrero]}.`,
        a: '/pesar',
      })
    }
  }

  return lista
}

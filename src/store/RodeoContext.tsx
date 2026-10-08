import { createContext, useCallback, useContext, useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import type { Animal, Categoria, Nota } from '../domain/tipos'
import { cargar, guardar, reiniciar as reiniciarAlmacen } from './almacen'
import { animalNuevo, conAnimal, conPesaje } from './operaciones'

interface RodeoContexto {
  animales: Animal[]
  buscar: (caravana: number) => Animal | undefined
  registrarAnimal: (caravana: number, categoria: Categoria) => void
  guardarPesaje: (caravana: number, kg: number, notas: Nota[]) => void
  reiniciarDemo: () => void
}

const Contexto = createContext<RodeoContexto | null>(null)

export function RodeoProvider({ children }: { children: ReactNode }) {
  const [animales, setAnimales] = useState<Animal[]>(() => cargar())

  const actualizar = useCallback((siguiente: (previo: Animal[]) => Animal[]) => {
    setAnimales((previo) => {
      const nuevo = siguiente(previo)
      guardar(nuevo)
      return nuevo
    })
  }, [])

  const valor = useMemo<RodeoContexto>(
    () => ({
      animales,
      buscar: (caravana) => animales.find((a) => a.caravana === caravana),
      registrarAnimal: (caravana, categoria) =>
        actualizar((previo) => conAnimal(previo, animalNuevo(caravana, categoria))),
      guardarPesaje: (caravana, kg, notas) => actualizar((previo) => conPesaje(previo, caravana, kg, notas)),
      reiniciarDemo: () => setAnimales(reiniciarAlmacen()),
    }),
    [animales, actualizar],
  )

  return <Contexto.Provider value={valor}>{children}</Contexto.Provider>
}

export function useRodeo(): RodeoContexto {
  const valor = useContext(Contexto)
  if (!valor) throw new Error('useRodeo debe usarse dentro de RodeoProvider')
  return valor
}

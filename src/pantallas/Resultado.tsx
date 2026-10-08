import { useState } from 'react'
import { Link, Navigate, useLocation, useNavigate, useParams } from 'react-router-dom'
import { conSigno, decimal, fechaCorta, nombreCategoria } from '../domain/formato'
import { HOY, diasEntre } from '../domain/fechas'
import { ultimoPesaje } from '../domain/reglas'
import { rangoPeso } from '../domain/simulador'
import { NOTAS } from '../domain/tipos'
import type { Nota } from '../domain/tipos'
import { useRodeo } from '../store/RodeoContext'

function textoRitmo(porDia: number): string {
  if (Math.abs(porDia) < 0.05) return 'no cambió de peso'
  return `${porDia > 0 ? 'gana' : 'pierde'} ${decimal(Math.abs(porDia))} kg por día`
}

export default function Resultado() {
  const caravana = Number(useParams().caravana)
  const kg = (useLocation().state as { kg?: number } | null)?.kg
  const { buscar, guardarPesaje } = useRodeo()
  const navigate = useNavigate()
  const [notas, setNotas] = useState<Nota[]>([])

  const animal = buscar(caravana)
  if (!animal) return <Navigate to="/pesar" replace />
  if (kg === undefined) return <Navigate to={`/medir/${caravana}`} replace />

  const { min, max } = rangoPeso(kg)
  const previo = ultimoPesaje(animal)
  const dias = previo ? diasEntre(previo.fecha, HOY) : 0

  const alternar = (nota: Nota) =>
    setNotas((actuales) => (actuales.includes(nota) ? actuales.filter((n) => n !== nota) : [...actuales, nota]))

  const guardar = () => {
    guardarPesaje(caravana, kg, notas)
    navigate(`/animal/${caravana}`, { replace: true })
  }

  return (
    <section className="px-5 pb-6">
      <p className="text-4xl font-extrabold">{caravana}</p>
      <p className="text-xl font-semibold text-gray-700">{nombreCategoria(animal)}</p>

      <p className="mt-4 text-7xl font-extrabold text-campo-oscuro">{kg} kg</p>
      <p className="mt-1 text-xl font-bold">
        ± 10% · entre {min} y {max} kg
      </p>
      <p className="mt-3 rounded-xl border-2 border-gray-800 p-3 text-lg font-semibold">
        Es una estimación. No reemplaza la balanza oficial.
      </p>

      <p className="mt-4 text-xl font-semibold">
        {previo ? (
          <>
            {conSigno(kg - previo.kg)} kg desde el {fechaCorta(previo.fecha)}
            {dias > 0 && <> · {textoRitmo((kg - previo.kg) / dias)}</>}
          </>
        ) : (
          'Es el primer pesaje de este animal.'
        )}
      </p>

      <h2 className="mt-6 text-xl font-bold">Notas</h2>
      <div className="mt-2 flex flex-wrap gap-2">
        {NOTAS.map((n) => {
          const activa = notas.includes(n)
          return (
            <button
              key={n}
              onClick={() => alternar(n)}
              aria-pressed={activa}
              className={`min-h-14 rounded-full border-2 px-5 text-lg font-bold ${
                activa ? 'border-campo bg-campo text-white' : 'border-gray-800 bg-white'
              }`}
            >
              {n}
            </button>
          )
        })}
      </div>

      <button onClick={guardar} className="mt-6 min-h-16 w-full rounded-xl bg-campo text-2xl font-extrabold text-white">
        Guardar
      </button>
      <Link
        to={`/medir/${caravana}`}
        replace
        className="mt-3 flex min-h-16 w-full items-center justify-center rounded-xl border-2 border-gray-800 text-xl font-bold"
      >
        Medir de nuevo
      </Link>
    </section>
  )
}

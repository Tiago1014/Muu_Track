import { Link } from 'react-router-dom'
import { avisos } from '../domain/consultas'
import { GRUPOS } from '../domain/formato'
import { contarPorGrupo } from '../domain/reglas'
import type { Grupo } from '../domain/tipos'
import { useRodeo } from '../store/RodeoContext'

const ORDEN: Grupo[] = ['listo', 'creciendo', 'atrasado']

export default function Inicio() {
  const { animales } = useRodeo()
  const cuenta = contarPorGrupo(animales)
  const lista = avisos(animales)

  return (
    <section className="px-5 pb-6">
      <h1 className="text-3xl font-bold">Buen día, Don Carlos</h1>

      <Link
        to="/pesar"
        className="mt-5 flex min-h-24 items-center justify-center rounded-2xl bg-campo px-4 text-center text-2xl font-extrabold text-white shadow"
      >
        Pesar un animal
      </Link>

      <h2 className="mt-8 text-2xl font-bold">Avisos</h2>
      <ul className="mt-3 space-y-3">
        {lista.map((aviso) => (
          <li key={aviso.id}>
            <Link
              to={aviso.a}
              className="flex min-h-16 items-center rounded-xl border-2 border-gray-800 bg-white p-4 text-lg font-semibold"
            >
              {aviso.texto}
            </Link>
          </li>
        ))}
      </ul>

      <h2 className="mt-8 text-2xl font-bold">Tu rodeo</h2>
      <div className="mt-3 grid grid-cols-3 gap-3">
        {ORDEN.map((grupo) => (
          <Link
            key={grupo}
            to={`/rodeo?grupo=${grupo}`}
            className={`flex min-h-28 flex-col items-center justify-center rounded-xl p-2 text-center text-white ${GRUPOS[grupo].fondo}`}
          >
            <span className="text-4xl font-extrabold">{cuenta[grupo]}</span>
            <span className="text-base font-semibold leading-tight">{GRUPOS[grupo].plural}</span>
          </Link>
        ))}
      </div>
    </section>
  )
}

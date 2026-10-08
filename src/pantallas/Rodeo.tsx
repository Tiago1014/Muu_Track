import { Link, useSearchParams } from 'react-router-dom'
import { decimal, GRUPOS, nombreCategoria } from '../domain/formato'
import { contarPorGrupo, gananciaDiaria, grupoDe, ultimoPesaje } from '../domain/reglas'
import type { Categoria, Grupo } from '../domain/tipos'
import { useRodeo } from '../store/RodeoContext'

const ORDEN: Grupo[] = ['listo', 'creciendo', 'atrasado']

const FILTROS: { id: Categoria | 'todos'; nombre: string }[] = [
  { id: 'todos', nombre: 'Todos' },
  { id: 'vaca', nombre: 'Vacas' },
  { id: 'ternero', nombre: 'Terneros' },
  { id: 'novillo', nombre: 'Novillos' },
  { id: 'vaquillona', nombre: 'Vaquillonas' },
]

export default function Rodeo() {
  const { animales } = useRodeo()
  const [params, setParams] = useSearchParams()

  const pedido = params.get('grupo') as Grupo | null
  const grupo: Grupo = pedido && ORDEN.includes(pedido) ? pedido : 'listo'
  const cat = FILTROS.find((f) => f.id === params.get('cat'))?.id ?? 'todos'

  const elegir = (cambios: Record<string, string>) => {
    const siguiente = new URLSearchParams(params)
    for (const [k, v] of Object.entries(cambios)) siguiente.set(k, v)
    setParams(siguiente, { replace: true })
  }

  const cuenta = contarPorGrupo(animales)
  const filas = animales.filter((a) => grupoDe(a) === grupo && (cat === 'todos' || a.categoria === cat))

  return (
    <section className="px-5 pb-6">
      <h1 className="text-3xl font-bold">Tu rodeo</h1>

      <div role="tablist" className="mt-4 grid grid-cols-3 gap-2">
        {ORDEN.map((g) => {
          const activo = g === grupo
          return (
            <button
              key={g}
              role="tab"
              aria-selected={activo}
              onClick={() => elegir({ grupo: g })}
              className={`min-h-20 rounded-xl px-1 text-base font-bold leading-tight ${
                activo ? `${GRUPOS[g].fondo} text-white` : `border-2 border-gray-800 bg-white ${GRUPOS[g].texto}`
              }`}
            >
              {GRUPOS[g].plural} ({cuenta[g]})
            </button>
          )
        })}
      </div>

      <div className="mt-4 flex gap-2 overflow-x-auto pb-1">
        {FILTROS.map((f) => (
          <button
            key={f.id}
            onClick={() => elegir({ cat: f.id })}
            aria-pressed={f.id === cat}
            className={`min-h-14 shrink-0 rounded-full border-2 px-5 text-lg font-bold ${
              f.id === cat ? 'border-gray-900 bg-gray-900 text-white' : 'border-gray-800 bg-white'
            }`}
          >
            {f.nombre}
          </button>
        ))}
      </div>

      {filas.length === 0 ? (
        <p className="mt-6 text-lg font-semibold">No hay animales en este grupo.</p>
      ) : (
        <ul className="mt-4 space-y-3">
          {filas.map((a) => {
            const ganancia = gananciaDiaria(a)
            return (
              <li key={a.caravana}>
                <Link
                  to={`/animal/${a.caravana}`}
                  className="flex min-h-16 items-center justify-between gap-3 rounded-xl border-2 border-gray-800 px-4 py-2"
                >
                  <span>
                    <span className="block text-2xl font-extrabold">{a.caravana}</span>
                    <span className="block text-base font-semibold text-gray-700">{nombreCategoria(a)}</span>
                  </span>
                  <span className="text-right">
                    <span className="block text-xl font-extrabold">{ultimoPesaje(a)?.kg} kg</span>
                    <span className="block text-base font-semibold text-gray-700">
                      {ganancia === null ? 'Sin datos' : `${decimal(ganancia)} kg/día`}
                    </span>
                  </span>
                </Link>
              </li>
            )
          })}
        </ul>
      )}
    </section>
  )
}

import { Link, useParams } from 'react-router-dom'
import EtiquetaGrupo from '../componentes/EtiquetaGrupo'
import GraficoPeso from '../componentes/GraficoPeso'
import { decimal, fechaCorta, nombreCategoria } from '../domain/formato'
import { gananciaDiaria, grupoDe, kgParaVenta, pesoVenta, ultimoPesaje } from '../domain/reglas'
import { useRodeo } from '../store/RodeoContext'

export default function Ficha() {
  const caravana = Number(useParams().caravana)
  const { buscar } = useRodeo()
  const animal = buscar(caravana)

  if (!animal) {
    return (
      <section className="px-5">
        <p className="text-xl font-bold">No encontramos ese animal.</p>
        <Link to="/pesar" className="mt-4 flex min-h-14 items-center justify-center rounded-xl bg-campo text-lg font-bold text-white">
          Buscar otro
        </Link>
      </section>
    )
  }

  const ultimo = ultimoPesaje(animal)
  const ganancia = gananciaDiaria(animal)
  const faltan = kgParaVenta(animal)
  const venta = pesoVenta(animal)
  const historial = [...animal.pesajes].reverse()

  return (
    <section className="px-5 pb-6">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-5xl font-extrabold">{animal.caravana}</p>
          <p className="mt-1 text-xl font-semibold text-gray-700">
            {nombreCategoria(animal)} · {animal.edadMeses} meses
          </p>
          <p className="text-lg text-gray-700">{animal.potrero}</p>
        </div>
        <EtiquetaGrupo grupo={grupoDe(animal)} />
      </div>

      <div className="mt-5 grid grid-cols-3 gap-3 text-center">
        <div className="rounded-xl border-2 border-gray-800 p-3">
          <p className="text-3xl font-extrabold">{ultimo?.kg ?? '—'}</p>
          <p className="text-base font-semibold">kg ahora</p>
        </div>
        <div className="rounded-xl border-2 border-gray-800 p-3">
          <p className="text-3xl font-extrabold">{ganancia === null ? '—' : decimal(Math.abs(ganancia))}</p>
          <p className="text-base font-semibold">
            {ganancia === null ? 'Sin datos' : ganancia < 0 ? 'Pierde kg por día' : 'Gana kg por día'}
          </p>
        </div>
        <div className="rounded-xl border-2 border-gray-800 p-3">
          {venta === null ? (
            <p className="text-base font-bold">No se vende por peso</p>
          ) : faltan === 0 ? (
            <p className="text-xl font-extrabold text-campo-oscuro">Listo para vender</p>
          ) : (
            <>
              <p className="text-3xl font-extrabold">{faltan}</p>
              <p className="text-base font-semibold">kg faltan para venta</p>
            </>
          )}
        </div>
      </div>

      <h2 className="mt-6 text-2xl font-bold">Peso por fecha</h2>
      <div className="mt-2">
        <GraficoPeso pesajes={animal.pesajes} pesoVenta={venta} />
      </div>
      {venta !== null && <p className="text-base font-semibold text-orange-800">Línea punteada: peso de venta ({venta} kg)</p>}

      <h2 className="mt-6 text-2xl font-bold">Pesajes</h2>
      <ul className="mt-2 divide-y-2 divide-gray-300 border-y-2 border-gray-300">
        {historial.map((p) => (
          <li key={p.fecha} className="flex min-h-14 items-center justify-between gap-3 py-2">
            <span className="text-lg font-bold">{fechaCorta(p.fecha)}</span>
            <span className="text-lg font-extrabold">{p.kg} kg</span>
            <span className="flex-1 text-right text-base text-gray-700">{p.notas.join(', ')}</span>
          </li>
        ))}
      </ul>

      <Link
        to={`/medir/${animal.caravana}`}
        className="mt-6 flex min-h-16 items-center justify-center rounded-xl bg-campo text-2xl font-extrabold text-white"
      >
        Pesar de nuevo
      </Link>
    </section>
  )
}

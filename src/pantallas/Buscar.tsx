import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ultimosPesados } from '../domain/consultas'
import { nombreCategoria } from '../domain/formato'
import { ultimoPesaje } from '../domain/reglas'
import type { Categoria } from '../domain/tipos'
import { useRodeo } from '../store/RodeoContext'

const TECLAS = ['1', '2', '3', '4', '5', '6', '7', '8', '9', 'borrar', '0', 'ok'] as const

const CATEGORIAS: { id: Categoria; nombre: string }[] = [
  { id: 'ternero', nombre: 'Ternero' },
  { id: 'novillo', nombre: 'Novillo' },
  { id: 'vaquillona', nombre: 'Vaquillona' },
  { id: 'vaca', nombre: 'Vaca' },
]

export default function Buscar() {
  const { animales, buscar, registrarAnimal } = useRodeo()
  const navigate = useNavigate()
  const [numero, setNumero] = useState('')
  const [noExiste, setNoExiste] = useState(false)
  const [eligiendo, setEligiendo] = useState(false)

  const cambiar = (siguiente: (previo: string) => string) => {
    setNumero(siguiente)
    setNoExiste(false)
    setEligiendo(false)
  }

  const tocar = (tecla: (typeof TECLAS)[number]) => {
    if (tecla === 'borrar') return cambiar((n) => n.slice(0, -1))
    if (tecla === 'ok') return confirmar()
    cambiar((n) => (n.length < 4 ? n + tecla : n))
  }

  const confirmar = () => {
    if (numero.length !== 4) return
    if (buscar(Number(numero))) navigate(`/medir/${numero}`)
    else setNoExiste(true)
  }

  const crearYMedir = (categoria: Categoria) => {
    registrarAnimal(Number(numero), categoria)
    navigate(`/medir/${numero}`)
  }

  return (
    <section className="px-5 pb-6">
      <h1 className="text-3xl font-bold">¿Qué animal vas a pesar?</h1>

      <output
        aria-label="Número de caravana"
        className="mt-4 flex min-h-20 items-center justify-center rounded-xl border-2 border-gray-800 text-5xl font-extrabold tracking-widest"
      >
        {numero || <span className="text-gray-400">· · · ·</span>}
      </output>

      {noExiste && (
        <div className="mt-4 rounded-xl border-2 border-orange-700 p-4" role="alert">
          <p className="text-lg font-bold">No encontramos ese número. ¿Es un animal nuevo?</p>
          {!eligiendo ? (
            <div className="mt-3 grid grid-cols-2 gap-3">
              <button
                onClick={() => setEligiendo(true)}
                className="min-h-14 rounded-xl bg-campo text-lg font-bold text-white"
              >
                Sí, es nuevo
              </button>
              <button
                onClick={() => cambiar(() => '')}
                className="min-h-14 rounded-xl border-2 border-gray-800 text-lg font-bold"
              >
                No, corregir
              </button>
            </div>
          ) : (
            <>
              <p className="mt-3 text-lg font-semibold">¿Qué es?</p>
              <div className="mt-2 grid grid-cols-2 gap-3">
                {CATEGORIAS.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => crearYMedir(c.id)}
                    className="min-h-16 rounded-xl bg-campo text-xl font-bold text-white"
                  >
                    {c.nombre}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      )}

      {!noExiste && (
        <div className="mt-4 grid grid-cols-3 gap-3">
          {TECLAS.map((t) => {
            const esOk = t === 'ok'
            return (
              <button
                key={t}
                onClick={() => tocar(t)}
                disabled={esOk && numero.length !== 4}
                aria-label={t === 'borrar' ? 'Borrar' : esOk ? 'Buscar' : t}
                className={`min-h-16 rounded-xl text-3xl font-bold disabled:opacity-40 ${
                  esOk ? 'bg-campo text-white' : 'border-2 border-gray-800 bg-white'
                }`}
              >
                {t === 'borrar' ? '⌫' : esOk ? 'Ir' : t}
              </button>
            )
          })}
        </div>
      )}

      <h2 className="mt-8 text-2xl font-bold">Últimos pesados</h2>
      <ul className="mt-3 space-y-3">
        {ultimosPesados(animales).map((a) => (
          <li key={a.caravana}>
            <button
              onClick={() => navigate(`/medir/${a.caravana}`)}
              className="flex min-h-16 w-full items-center justify-between rounded-xl border-2 border-gray-800 px-4 text-left"
            >
              <span className="text-2xl font-extrabold">{a.caravana}</span>
              <span className="text-base font-semibold">
                {nombreCategoria(a)} · {ultimoPesaje(a)!.kg} kg
              </span>
            </button>
          </li>
        ))}
      </ul>
    </section>
  )
}

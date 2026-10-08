import { useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useRodeo } from '../store/RodeoContext'

const MS_PARA_REINICIAR = 3000

/** Logo provisorio. Mantenerlo apretado 3 segundos ofrece "Reiniciar demo" (para usar entre entrevistas). */
export default function Logo() {
  const { reiniciarDemo } = useRodeo()
  const navigate = useNavigate()
  const [abierto, setAbierto] = useState(false)
  const temporizador = useRef<number | undefined>(undefined)

  const empezar = () => {
    window.clearTimeout(temporizador.current)
    temporizador.current = window.setTimeout(() => setAbierto(true), MS_PARA_REINICIAR)
  }
  const cancelar = () => window.clearTimeout(temporizador.current)

  const reiniciar = () => {
    reiniciarDemo()
    setAbierto(false)
    navigate('/')
  }

  return (
    <>
      <div
        data-testid="logo"
        className="flex select-none items-center gap-2 [-webkit-touch-callout:none]"
        onPointerDown={empezar}
        onPointerUp={cancelar}
        onPointerLeave={cancelar}
        onPointerCancel={cancelar}
        onContextMenu={(e) => e.preventDefault()}
      >
        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-campo text-xl font-extrabold text-white">
          M
        </span>
        <span className="text-xl font-extrabold text-campo-oscuro">Muu Track</span>
      </div>

      {abierto && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/60 p-5" role="dialog" aria-modal>
          <div className="w-full max-w-sm rounded-2xl bg-white p-6">
            <h2 className="text-2xl font-bold">Reiniciar demo</h2>
            <p className="mt-2">Se borra lo guardado y vuelven los datos de ejemplo.</p>
            <button
              onClick={reiniciar}
              className="mt-5 min-h-14 w-full rounded-xl bg-orange-700 text-lg font-bold text-white"
            >
              Reiniciar demo
            </button>
            <button
              onClick={() => setAbierto(false)}
              className="mt-3 min-h-14 w-full rounded-xl border-2 border-gray-400 text-lg font-bold"
            >
              Cancelar
            </button>
          </div>
        </div>
      )}
    </>
  )
}

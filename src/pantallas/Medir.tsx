import { useEffect, useRef, useState } from 'react'
import { Link, Navigate, useNavigate, useParams } from 'react-router-dom'
import SiluetaVacuno from '../componentes/Siluetas'
import { pesoSimulado } from '../domain/simulador'
import { useRodeo } from '../store/RodeoContext'

const MS_MEDICION = 2000

export default function Medir() {
  const caravana = Number(useParams().caravana)
  const { buscar } = useRodeo()
  const navigate = useNavigate()
  const animal = buscar(caravana)

  const video = useRef<HTMLVideoElement>(null)
  const temporizador = useRef<number | undefined>(undefined)
  const [camara, setCamara] = useState<'probando' | 'ok' | 'no'>('probando')
  const [midiendo, setMidiendo] = useState(false)

  useEffect(() => {
    let activo = true
    let flujo: MediaStream | undefined

    if (!navigator.mediaDevices?.getUserMedia) {
      setCamara('no')
      return
    }
    navigator.mediaDevices
      .getUserMedia({ video: { facingMode: 'environment' }, audio: false })
      .then((s) => {
        if (!activo) return s.getTracks().forEach((t) => t.stop())
        flujo = s
        if (video.current) video.current.srcObject = s
        setCamara('ok')
      })
      .catch(() => activo && setCamara('no'))

    return () => {
      activo = false
      flujo?.getTracks().forEach((t) => t.stop())
      window.clearTimeout(temporizador.current)
    }
  }, [])

  if (!animal) return <Navigate to="/pesar" replace />

  const medir = () => {
    if (midiendo) return
    setMidiendo(true)
    temporizador.current = window.setTimeout(() => {
      navigate(`/resultado/${caravana}`, { state: { kg: pesoSimulado(animal) }, replace: true })
    }, MS_MEDICION)
  }

  return (
    <div className="fixed inset-0 z-30 overflow-hidden bg-black">
      <video
        ref={video}
        autoPlay
        playsInline
        muted
        className={`absolute inset-0 h-full w-full object-cover ${camara === 'ok' ? '' : 'hidden'}`}
      />
      {camara !== 'ok' && <div className="absolute inset-0 bg-gradient-to-b from-sky-200 to-green-300" />}

      <div className="absolute inset-x-0 top-0 flex items-start justify-between gap-3 p-4 pt-[max(1rem,env(safe-area-inset-top))]">
        <Link to="/pesar" className="flex min-h-14 items-center rounded-xl bg-black/70 px-4 text-lg font-bold text-white">
          ← Volver
        </Link>
        <p className="flex-1 rounded-xl bg-black/70 p-3 text-center text-lg font-semibold text-white">
          Parate a 3 o 4 metros. Que se vea el animal entero de costado.
        </p>
      </div>

      <div className="pointer-events-none absolute inset-x-0 top-1/2 -translate-y-1/2 px-6">
        <div className="relative mx-auto w-full max-w-md">
          {camara !== 'ok' && <SiluetaVacuno color="#5b3a22" className="absolute inset-0 w-full" />}
          <SiluetaVacuno opacidad={0.5} className="relative w-full" />
          {midiendo && (
            <div className="absolute inset-y-0 w-1 animate-[barrido_2s_linear_forwards] bg-campo shadow-[0_0_14px_6px_rgba(120,230,130,0.8)]" />
          )}
        </div>
      </div>

      <div className="absolute inset-x-0 bottom-0 flex flex-col items-center gap-3 p-6 pb-[max(1.5rem,env(safe-area-inset-bottom))]">
        {midiendo && <p className="rounded-xl bg-black/70 px-5 py-2 text-2xl font-bold text-white">Midiendo…</p>}
        <button
          onClick={medir}
          disabled={midiendo}
          aria-label="Medir"
          className="h-24 w-24 rounded-full border-4 border-white bg-campo text-xl font-extrabold text-white shadow-lg disabled:opacity-60"
        >
          Medir
        </button>
      </div>
    </div>
  )
}

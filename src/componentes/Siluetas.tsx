interface Props {
  className?: string
  color?: string
  opacidad?: number
}

/** Vacuno de costado, mirando a la derecha. Sirve de guía en la cámara y de ilustración de respaldo. */
export default function SiluetaVacuno({ className, color = '#ffffff', opacidad = 1 }: Props) {
  return (
    <svg viewBox="0 0 320 180" className={className} aria-hidden fill={color} fillOpacity={opacidad}>
      <rect x="62" y="48" width="188" height="66" rx="30" />
      <rect x="80" y="100" width="15" height="62" rx="6" />
      <rect x="110" y="100" width="15" height="62" rx="6" />
      <rect x="206" y="100" width="15" height="62" rx="6" />
      <rect x="232" y="100" width="15" height="62" rx="6" />
      <path d="M236 52 L282 44 Q312 46 312 78 Q310 104 284 104 Q262 104 248 96 Z" />
      <path d="M268 46 L262 28 L280 40 Z" />
      <path d="M62 62 Q36 70 38 120 Q40 128 46 120 Q46 84 66 76 Z" />
    </svg>
  )
}

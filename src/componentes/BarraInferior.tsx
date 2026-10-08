import { NavLink } from 'react-router-dom'
import type { ReactNode } from 'react'

const icono = 'h-7 w-7'

const items: { a: string; texto: string; icono: ReactNode }[] = [
  {
    a: '/',
    texto: 'Inicio',
    icono: (
      <svg viewBox="0 0 24 24" className={icono} fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
        <path d="M3 11.5 12 4l9 7.5M5.5 10v9.5h13V10" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    a: '/pesar',
    texto: 'Pesar',
    icono: (
      <svg viewBox="0 0 24 24" className={icono} fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
        <path d="M4 8h3l1.5-2h7L17 8h3v11H4z" strokeLinejoin="round" />
        <circle cx="12" cy="13" r="3.2" />
      </svg>
    ),
  },
  {
    a: '/rodeo',
    texto: 'Rodeo',
    icono: (
      <svg viewBox="0 0 24 24" className={icono} fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
        <path d="M4 7h16M4 12h16M4 17h16" strokeLinecap="round" />
      </svg>
    ),
  },
]

export default function BarraInferior() {
  return (
    <nav
      aria-label="Menú principal"
      className="fixed inset-x-0 bottom-0 z-20 grid grid-cols-3 border-t-2 border-gray-300 bg-white pb-[env(safe-area-inset-bottom)]"
    >
      {items.map((item) => (
        <NavLink
          key={item.a}
          to={item.a}
          end={item.a === '/'}
          className={({ isActive }) =>
            `flex min-h-16 flex-col items-center justify-center gap-0.5 text-base font-semibold ${
              isActive ? 'bg-campo text-white' : 'text-gray-800'
            }`
          }
        >
          {item.icono}
          {item.texto}
        </NavLink>
      ))}
    </nav>
  )
}

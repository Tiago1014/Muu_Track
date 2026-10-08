import { GRUPOS } from '../domain/formato'
import type { Grupo } from '../domain/tipos'

export default function EtiquetaGrupo({ grupo }: { grupo: Grupo }) {
  const g = GRUPOS[grupo]
  return <span className={`inline-block rounded-full px-3 py-1 text-base font-bold text-white ${g.fondo}`}>{g.nombre}</span>
}

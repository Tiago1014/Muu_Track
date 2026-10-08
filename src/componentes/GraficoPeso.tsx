import { CartesianGrid, Line, LineChart, ReferenceLine, ResponsiveContainer, XAxis, YAxis } from 'recharts'
import { fechaCorta } from '../domain/formato'
import type { Pesaje } from '../domain/tipos'

interface Props {
  pesajes: Pesaje[]
  pesoVenta: number | null
}

export default function GraficoPeso({ pesajes, pesoVenta }: Props) {
  const datos = pesajes.map((p) => ({ fecha: fechaCorta(p.fecha), kg: p.kg }))
  const pesos = pesajes.map((p) => p.kg)
  const minimo = Math.floor((Math.min(...pesos) - 10) / 10) * 10
  const maximo = Math.ceil((Math.max(...pesos, pesoVenta ?? 0) + 10) / 10) * 10

  return (
    <div className="h-60 w-full" role="img" aria-label="Gráfico del peso por fecha">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={datos} margin={{ top: 12, right: 16, bottom: 4, left: 0 }}>
          <CartesianGrid stroke="#d1d5db" strokeDasharray="3 3" />
          <XAxis dataKey="fecha" tick={{ fontSize: 14, fill: '#1a1a1a' }} />
          <YAxis domain={[minimo, maximo]} width={46} tick={{ fontSize: 14, fill: '#1a1a1a' }} />
          <Line
            type="monotone"
            dataKey="kg"
            stroke="#2f6b34"
            strokeWidth={3}
            dot={{ r: 4, fill: '#2f6b34' }}
            isAnimationActive={false}
          />
          {pesoVenta !== null && (
            <ReferenceLine
              y={pesoVenta}
              stroke="#c2410c"
              strokeWidth={2}
              strokeDasharray="6 4"
              label={{ value: 'Venta', position: 'insideTopLeft', fill: '#c2410c', fontSize: 14 }}
            />
          )}
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}

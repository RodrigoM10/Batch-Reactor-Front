"use client"

import { useMemo, useState } from "react"
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts"

interface HeatRatesChartProps {
  data: Array<{ 
    time: number; 
    heatGenerated?: number; 
    heatRemoved?: number
   }>;
   unitMeasure:"min" | "seg"
}

export function HeatRatesChart({ data,unitMeasure }: HeatRatesChartProps) {
  // Procesar datos
  const processedData = useMemo(() => {
    if (!data || data.length === 0) return []
    const hasHeatRateData = data.some(d => d.heatGenerated !== undefined && d.heatRemoved !== undefined)
    if (!hasHeatRateData) return []
    return data
  }, [data])

  if (processedData.length === 0) {
    return (
      <div className="h-[500px] flex items-center justify-center">
        <p className="text-gray-500">No hay datos de tasas de calor disponibles para mostrar.</p>
      </div>
    )
  }

  // Zoom en eje X (tiempo)
  const times = useMemo(() => processedData.map(d => d.time), [processedData])
  const initialMin = Math.min(...times)
  const initialMax = Math.max(...times)
  const [xMin, setXMin] = useState<number>(initialMin)
  const [xMax, setXMax] = useState<number>(initialMax)
  const [xInterval, setXInterval] = useState<number>(parseFloat(((initialMax - initialMin) / 5).toFixed(2)))

  // Generar ticks de tiempo
  const xTicks = xInterval > 0
    ? Array.from(
        { length: Math.floor((xMax - xMin) / xInterval) + 1 },
        (_, i) => Number((xMin + i * xInterval).toFixed(2))
      )
    : undefined

  // Filtrar datos según rango de tiempo
  const filtered = useMemo(
    () => processedData.filter(d => d.time >= xMin && d.time <= xMax),
    [processedData, xMin, xMax]
  )

  // Dominio Y para calor
  const allValues = useMemo(
    () => filtered.flatMap(d => [d.heatGenerated || 0, d.heatRemoved || 0]),
    [filtered]
  )
  const minValue = Math.min(...allValues)
  const maxValue = Math.max(...allValues)
  const yDomain: [number, number] = [
    minValue < 0 ? Math.floor(minValue * 1.1) : 0,
    Math.ceil(maxValue * 1.1),
  ]

  // Formateo tooltip
  const formatTime = (v: number) => v < 0.1 ? `${(v * 60).toFixed(1)}` : `${v.toFixed(1)}`

  return (
    <div>
      <h3 className="text-xl font-semibold text-center mb-4">Tasas de Generación y Remoción de Calor</h3>
      <div className="h-[500px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={filtered} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="time"
              type="number"
              domain={[xMin, xMax]}
              ticks={xTicks}
              label={{ value: `Tiempo (${unitMeasure})`, position: 'insideBottomRight', offset: -5, fontWeight: "bold" }}
              tickFormatter={v => v.toFixed(1)}
              style={{ fontWeight: "bold" }}
            />
            <YAxis
              domain={yDomain}
              label={{ value: `Tasa de Calor (cal/${unitMeasure})`, angle: -90, position: 'insideLeft', fontWeight: "bold" }}
              tickFormatter={v => v.toFixed(0)}
              style={{ fontWeight: "bold" }}
            />
            <Tooltip
              formatter={(v: number) => `${v.toFixed(2)} cal/${unitMeasure}`}
              labelFormatter={l => `Tiempo: ${formatTime(l)} ${unitMeasure}`}
            />
            <Legend />
            <Area
              type="monotone"
              dataKey="heatGenerated"
              name="Calor Generado (Qg)"
              stroke="#ff7300"
              fill="#ff7300"
              fillOpacity={0.3}
              strokeWidth={2}
            />
            <Area
              type="monotone"
              dataKey="heatRemoved"
              name="Calor Removido (Qr)"
              stroke="#0088fe"
              fill="#0088fe"
              fillOpacity={0.3}
              strokeWidth={2}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
      {/* Controles de zoom en tiempo */}
      <div className="mb-4 mt-4 flex space-x-4 items-center justify-end">
        <label className="flex flex-col text-sm">
          Mín Tiempo
          <input
            type="number"
            value={xMin}
            onChange={e => setXMin(+e.target.value)}
            className="ml-1 border rounded px-2 py-1 w-24"
          />
        </label>
        <label className="flex flex-col text-sm">
          Máx Tiempo
          <input
            type="number"
            value={xMax}
            onChange={e => setXMax(+e.target.value)}
            className="ml-1 border rounded px-2 py-1 w-24"
          />
        </label>
        <label className="flex flex-col text-sm">
          Intervalo
          <input
            type="number"
            value={xInterval}
            onChange={e => setXInterval(+e.target.value)}
            className="ml-1 border rounded px-2 py-1 w-24"
          />
        </label>
      </div>
    </div>
  )
}

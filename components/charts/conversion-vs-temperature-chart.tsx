// ConversionVsTemperatureChart.tsx

"use client"

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts"
import { useMemo, useState } from "react"

interface ConversionVsTemperatureChartProps {
  data: Array<{ temperature: number; conversion: number }>;
}

export function ConversionVsTemperatureChart({ data }: ConversionVsTemperatureChartProps) {
  // Datos de temperatura (eje X)
  const temps = useMemo(() => data.map(d => d.temperature), [data])
  const computedMin = useMemo(() => Math.floor(Math.min(...temps) - 2), [temps])
  const computedMax = useMemo(() => Math.ceil(Math.max(...temps) + 2), [temps])

  // Estado de zoom en eje X (temperatura)
  const [xMin, setXMin] = useState<number>(computedMin)
  const [xMax, setXMax] = useState<number>(computedMax)
  const [xInterval, setXInterval] = useState<number>(
    Number(((computedMax - computedMin) / 5).toFixed(0))
  )

  // Ticks de temperatura según intervalo
  const xTicks = xInterval > 0
    ? Array.from(
        { length: Math.floor((xMax - xMin) / xInterval) + 1 },
        (_, i) => Number((xMin + i * xInterval).toFixed(0))
      )
    : undefined

  // Filtrar datos según rango de temperatura
  const filtered = useMemo(
    () => data.filter(d => d.temperature >= xMin && d.temperature <= xMax),
    [data, xMin, xMax]
  )

  // Cálculo dominio para conversión (eje Y)
  const maxConv = useMemo(
    () => Math.max(...data.map(d => d.conversion)),
    [data]
  )
  const yMax = Math.min(maxConv * 1.1, 1)

  return (
    <div>
      {/* Gráfico */}
      <div className="h-[500px] ">
        <h3 className="text-xl font-semibold text-center mb-4">
          Conversión vs Temperatura
        </h3>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={filtered} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="temperature"
              type="number"
              domain={[xMin, xMax]}
              ticks={xTicks}
              label={{ value: "Temperatura (K)", position: "insideBottomRight", offset: -5, style: { fontWeight: "bold" } }}
              tickFormatter={value => value.toFixed(0)}
              style={{ fontWeight: "bold" }}
            />
            <YAxis
              dataKey="conversion"
              type="number"
              domain={[0, yMax]}
              label={{ value: "Conversión", angle: -90, position: "insideLeft", style: { fontWeight: "bold" }, dx: -15 }}
              tickFormatter={value => value.toFixed(4)}
              style={{ fontWeight: "bold" }}
            />
            <Tooltip
              formatter={(value: number) => value.toFixed(4)}
              labelFormatter={(label: number) => `Temperatura: ${label.toFixed(0)} K`}
            />
            <Legend />
            <Line
              type="monotone"
              dataKey="conversion"
              name="Conversión (X)"
              stroke="#8884d8"
              activeDot={{ r: 8 }}
              dot={{ r: 1 }}
              strokeWidth={2}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Controles de zoom en temperatura */}
      <div className="mb-4 mt-10 flex space-x-4 items-center justify-end">
        <label className="flex flex-col text-sm">
          Mín Temp
          <input
            type="number"
            value={xMin}
            onChange={e => setXMin(parseFloat(e.target.value))}
            className="ml-1 border rounded px-2 py-1 w-24"
          />
        </label>
        <label className="flex flex-col text-sm">
          Máx Tempa
          <input
            type="number"
            value={xMax}
            onChange={e => setXMax(parseFloat(e.target.value))}
            className="ml-1 border rounded px-2 py-1 w-24"
          />
        </label>
        <label className="flex flex-col text-sm">
          Intervalo
          <input
            type="number"
            value={xInterval}
            onChange={e => setXInterval(parseFloat(e.target.value))}
            className="ml-1 border rounded px-2 py-1 w-24"
          />
        </label>
      </div>
    </div>
  )
}

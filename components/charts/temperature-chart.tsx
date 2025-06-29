
"use client"

import { useMemo, useState } from "react"
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

interface TemperatureChartProps {
  data: Array<{ time: number; temperature: number; coolingTemperature?: number }>;
  energyMode: "adiabatic" | "icq";
  unitMeasure: "min" | "seg";
}

export function TemperatureChart({ data, energyMode, unitMeasure }: TemperatureChartProps) {
  // Rango inicial de tiempo para el zoom
  const times = useMemo(() => data.map(d => d.time), [data])
  const initialMin = Math.min(...times)
  const initialMax = Math.max(...times)
  const [xMin, setXMin] = useState<number>(initialMin)
  const [xMax, setXMax] = useState<number>(initialMax)
  const [xInterval, setXInterval] = useState<number>(
    parseFloat(((initialMax - initialMin) / 5).toFixed(2))
  )

  // Ticks de tiempo según intervalo
  const xTicks = xInterval > 0
    ? Array.from(
        { length: Math.floor((xMax - xMin) / xInterval) + 1 },
        (_, i) => Number((xMin + i * xInterval).toFixed(2))
      )
    : undefined

  // Filtrar datos según rango de tiempo para zoom dinámico
  const filteredData = useMemo(
    () => data.filter(d => d.time >= xMin && d.time <= xMax),
    [data, xMin, xMax]
  )

  // Cálculo del dominio de temperatura (eje Y)
  const temps = useMemo(() => data.map(d => d.temperature), [data])
  let minTemp = Math.floor(Math.min(...temps) - 2)
  const maxTemp = Math.ceil(Math.max(...temps) + 2)
  if (energyMode === "icq") {
    const cools = data.map(d => d.coolingTemperature ?? Infinity)
    const minCool = Math.floor(Math.min(...cools) - 2)
    minTemp = Math.max(0, Math.min(minTemp, minCool))
  }

  // Formateo de tiempo para tooltip
  const formatTime = (v: number) =>
    v < 0.1 ? `${(v * 60).toFixed(1)}` : `${v.toFixed(1)}`

  return (
    <div>
      {/* Gráfico con zoom */}
      <div className="h-[500px] mb-4">
        <h3 className="text-xl font-semibold text-center mb-4">Temperatura vs Tiempo</h3>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={filteredData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="time"
              type="number"
              domain={[xMin, xMax]}
              ticks={xTicks}
              label={{ value: `Tiempo (${unitMeasure})`, position: "insideBottomRight", offset: -5, style: { fontWeight: "bold" }}}
              tickFormatter={v => v.toFixed(1)}
              style={{ fontWeight: "bold" }}
            />
            <YAxis
              label={{ value: "Temperatura (K)", angle: -90, position: "insideLeft", style: { fontWeight: "bold" }}}
              domain={[minTemp, maxTemp]}
              tickFormatter={v => v.toFixed(0)}
              style={{ fontWeight: "bold" }}
            />
            <Tooltip
              formatter={(v: number) => v.toFixed(2)}
              labelFormatter={l => `Tiempo: ${formatTime(l)} ${unitMeasure}`}
            />
            <Legend />
            <Line
              type="monotone"
              dataKey="temperature"
              name="Temperatura del Reactor"
              stroke="#ff7300"
              dot={{ r: 1 }}
              activeDot={{ r: 6 }}
              strokeWidth={2}
            />
            {energyMode === "icq" && (
              <Line
                type="monotone"
                dataKey="coolingTemperature"
                name="Temp. de Enfriamiento"
                stroke="#0088fe"
                strokeDasharray="5 5"
                dot={false}
                strokeWidth={2}
              />
            )}
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Controles de Zoom */}
      <div className="mb-4 mt-10 flex space-x-4 items-center justify-end">
        <label className="flex flex-col text-sm">
          Mín Tiempo
          <input
            type="number"
            value={xMin}
            onChange={e => setXMin(parseFloat(e.target.value))}
            className="ml-1 border rounded px-2 py-1 w-24"
          />
        </label>
        <label className="flex flex-col text-sm">
          Máx Tiempo
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

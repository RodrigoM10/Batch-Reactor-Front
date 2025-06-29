// ConversionChart.tsx

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
  ReferenceLine,
} from "recharts"
import { useMemo, useState } from "react"

interface ConversionChartProps {
  data: Array<{ time: number; conversion: number; equilibrium?: number }>;
  equilibriumConversion?: number;
  unitMeasure: "min" | "seg";
}

export function ConversionChart({
  data,
  equilibriumConversion,
  unitMeasure,
}: ConversionChartProps) {
  // Convertir los datos para mostrar el tiempo en segundos
  const dataInSeconds = useMemo(
    () => data.map((point) => ({ ...point, timeInSeconds: point.time })),
    [data]
  )

  // Calcular valores automáticos base
  const computedMin = useMemo(
    () => Math.min(...dataInSeconds.map((d) => d.timeInSeconds)),
    [dataInSeconds]
  )
  const computedMax = useMemo(
    () => Math.max(...dataInSeconds.map((d) => d.timeInSeconds)),
    [dataInSeconds]
  )

  // Estados para inputs de eje X
  const [xAxisMin, setXAxisMin] = useState<number>(computedMin)
  const [xAxisMax, setXAxisMax] = useState<number>(computedMax)
  const [xAxisTickInterval, setXAxisTickInterval] = useState<number>(
    Number(((computedMax - computedMin) / 5).toFixed(2))
  )

  // Generar ticks
  const xTicks = xAxisTickInterval
    ? Array.from(
        { length: Math.floor((xAxisMax - xAxisMin) / xAxisTickInterval) + 1 },
        (_, i) => Number((xAxisMin + i * xAxisTickInterval).toFixed(2))
      )
    : undefined

  // Filtrar datos según rango X para zoom dinámico
  const filteredData = useMemo(
    () =>
      dataInSeconds.filter(
        (point) => point.timeInSeconds >= xAxisMin && point.timeInSeconds <= xAxisMax
      ),
    [dataInSeconds, xAxisMin, xAxisMax]
  )

  // Calcular el máximo valor para el eje Y
  const maxConversion = data.length > 0 ? Math.max(...data.map((d) => d.conversion || 0)) : 0
  const yMax = equilibriumConversion
    ? Math.min(Math.max(equilibriumConversion * 1.1, maxConversion * 1.1), 1)
    : Math.min(maxConversion * 1.1, 1)

  // Formatear la conversión para el tooltip
  const formatConversion = (value: number) => value.toFixed(4)

  return (
    <div>
      {/* Gráfico */}
      <div className="h-[500px]">
        <h3 className="text-xl font-semibold text-center mb-4">
          Conversión en función del tiempo de reacción
        </h3>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={filteredData}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="timeInSeconds"
              type="number"
              domain={[xAxisMin, xAxisMax]}
              ticks={xTicks}
              tickCount={xTicks ? xTicks.length : undefined}
              label={{ value: `Tiempo (${unitMeasure})`, position: "insideBottomRight", offset: -5, fontWeight: "bold" }}
              tickFormatter={(value) => value.toFixed(1)}
              style={{ fontWeight: "bold" }}
            />
            <YAxis
              label={{ value: "Conversión X_A", angle: -90, position: "insideLeft", fontWeight: "bold" }}
              domain={[0, yMax]}
              tickFormatter={(value) => value.toFixed(2)}
              style={{ fontWeight: "bold" }}
            />
            <Tooltip
              formatter={(value: number) => formatConversion(value)}
              labelFormatter={(label: number) => `Tiempo: ${label.toFixed(2)} ${unitMeasure}`}
            />
            <Legend />
            <Line
              type="monotone"
              dataKey="conversion"
              name="Conversión de A"
              stroke="#0066cc"
              activeDot={{ r: 8 }}
              dot={false}
              strokeWidth={2}
            />
            {filteredData[0]?.equilibrium && (
              <Line
                type="monotone"
                dataKey="equilibrium"
                name="Conversión de Equilibrio"
                stroke="#ff0000"
                strokeDasharray="5 5"
                dot={false}
                strokeWidth={2}
              />
            )}
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Controles para eje X */}
      <div className="mb-4 mt-10 flex space-x-1 items-center justify-end">
        <label className="flex flex-col text-sm">
          Mín X
          <input
            type="number"
            value={xAxisMin}
            onChange={(e) => setXAxisMin(parseFloat(e.target.value))}
            className="ml-1 border rounded px-2 py-1 w-24"
          />
        </label>
        <label className="flex flex-col text-sm">
          Máx X
          <input
            type="number"
            value={xAxisMax}
            onChange={(e) => setXAxisMax(parseFloat(e.target.value))}
            className="ml-1 border rounded px-2 py-1 w-24"
          />
        </label>
        <label className="flex flex-col text-sm">
          Intervalo
          <input
            type="number"
            value={xAxisTickInterval}
            onChange={(e) => setXAxisTickInterval(parseFloat(e.target.value))}
            className="ml-1 border rounded px-2 py-1 w-24"
          />
        </label>
      </div>
    </div>
  )
}

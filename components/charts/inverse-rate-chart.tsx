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

interface InverseRateDataPoint {
  time?: number 
  conversion: number
  inverseRate?: number
}

interface InverseRateChartProps {
  data: InverseRateDataPoint[]
  unitMeasure: "min" | "seg"
}

export function InverseRateChart({ data, unitMeasure }: InverseRateChartProps) {
  const validData = useMemo(
    () =>
      data.filter(
        (d) =>
          d.conversion !== undefined &&
          d.conversion > 0 &&
          d.inverseRate !== undefined &&
          d.inverseRate > 0,
      ),
    [data],
  )

  const hasInverseRateData = validData.length > 0

  if (!hasInverseRateData) {
    return (
      <div className="flex h-[500px] items-center justify-center">
        <p className="text-gray-500">
          No hay datos de velocidad inversa de reacción disponibles para mostrar.
        </p>
      </div>
    )
  }

  const computedMinConversion = useMemo(
    () => Math.min(...validData.map((d) => d.conversion)),
    [validData],
  )
  const computedMaxConversion = useMemo(
    () => Math.max(...validData.map((d) => d.conversion)),
    [validData],
  )

  const [xAxisMin, setXAxisMin] = useState<number>(
    Number(computedMinConversion.toFixed(2)),
  )
  const [xAxisMax, setXAxisMax] = useState<number>(
    Number(computedMaxConversion.toFixed(2)),
  )
  const [xAxisTickInterval, setXAxisTickInterval] = useState<number>(() => {
    const initialInterval = (computedMaxConversion - computedMinConversion) / 5
    return Number(initialInterval > 0 ? initialInterval.toFixed(2) : 0.1)
  })

 
  const xTicks = useMemo(() => {
    if (xAxisTickInterval <= 0 || xAxisMax <= xAxisMin) {
      return undefined 
    }
    const ticks = Array.from(
      {
        length: Math.floor((xAxisMax - xAxisMin) / xAxisTickInterval) + 1,
      },
      (_, i) => Number((xAxisMin + i * xAxisTickInterval).toFixed(2)),
    )
  
    if (ticks[ticks.length - 1] < xAxisMax) {
      ticks.push(Number(xAxisMax.toFixed(2)))
    }
    return ticks
  }, [xAxisMin, xAxisMax, xAxisTickInterval])

  const filteredDataForChart = useMemo(
    () =>
      validData.filter(
        (point) =>
          point.conversion >= xAxisMin && point.conversion <= xAxisMax,
      ),
    [validData, xAxisMin, xAxisMax],
  )

  const maxInverseRate = useMemo(
    () => Math.max(...validData.map((d) => d.inverseRate || 0)),
    [validData],
  )

  const p95 = useMemo(
    () => percentile(validData.map((d) => d.inverseRate || 0), 95),
    [validData],
  )

  const yMax = maxInverseRate > p95 * 2 ? p95 * 1.5 : maxInverseRate * 1.1

  return (
    <div>
      <div className="h-[500px]">
        <h3 className="mb-4 text-center text-xl font-semibold">
          Velocidad de Reaccón Inversa (Diagrama de Levenspiel)
        </h3>
        <ResponsiveContainer width="100%" height="90%">
          <LineChart
            data={filteredDataForChart} // Usar los datos filtrados para el gráfico
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="conversion"
              type="number" // Especificar type="number" para dominios numéricos
              domain={[xAxisMin, xAxisMax]} // Aplicar el dominio del usuario
              ticks={xTicks} // Aplicar los ticks generados
              tickCount={xTicks ? xTicks.length : undefined} // Asegurar que tickCount coincida
              label={{
                value: "Conversion (X)",
                position: "insideBottomRight",
                offset: -5,
                fontWeight: "bold",
              }}
              tickFormatter={(value) => value.toFixed(2)}
              style={{ fontWeight: "bold" }}
            />
            <YAxis
              label={{
                value: `1/r [L·${unitMeasure}/mol]`,
                angle: -90,
                position: "insideLeft",
                fontWeight: "bold",
              }}
              domain={[0, yMax]}
              tickFormatter={(value) => value.toFixed(1)}
              style={{ fontWeight: "bold" }}
            />
            <Tooltip
              formatter={(value: number) => value.toFixed(4)}
              labelFormatter={(label: number) => `Conversión: ${label.toFixed(4)}`}
            />
            <Legend />
            <Line
              type="monotone"
              dataKey="inverseRate"
              name="Inversa de la velocidad de reacción"
              stroke="#8884d8"
              dot={{ r: 1 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Controles para el usuario */}
      <div className="mb-4 mt-10 flex items-center justify-end space-x-1">
        <label className="flex flex-col text-sm">
          Mín X (Conversión)
          <input
            type="number"
            value={xAxisMin}
            onChange={(e) => setXAxisMin(parseFloat(e.target.value))}
            className="ml-1 w-24 rounded border px-2 py-1"
            step="0.01" // Permite entrada de decimales
          />
        </label>
        <label className="flex flex-col text-sm">
          Máx X (Conversión)
          <input
            type="number"
            value={xAxisMax}
            onChange={(e) => setXAxisMax(parseFloat(e.target.value))}
            className="ml-1 w-24 rounded border px-2 py-1"
            step="0.01" // Permite entrada de decimales
          />
        </label>
        <label className="flex flex-col text-sm">
          Intervalo
          <input
            type="number"
            value={xAxisTickInterval}
            onChange={(e) =>
              setXAxisTickInterval(parseFloat(e.target.value))
            }
            className="ml-1 w-24 rounded border px-2 py-1"
            step="0.01" // Permite entrada de decimales
          />
        </label>
      </div>
    </div>
  )
}

function percentile(arr: number[], p: number) {
  if (arr.length === 0) return 0
  if (arr.length === 1) return arr[0]

  const sorted = [...arr].sort((a, b) => a - b)
  // Calcula el índice en base a 0 para asegurar que apunte a un elemento válido
  const index = Math.max(0, Math.ceil((p / 100) * sorted.length) - 1)
  return sorted[index]
}
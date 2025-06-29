"use client"

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"

interface InverseRateChartProps {
  data: any[]
  unitMeasure:"min"|"seg"
}

export function InverseRateChart({ data, unitMeasure}: InverseRateChartProps) {
  const hasInverseRateData = data.some((d) => d.inverseRate !== undefined && d.inverseRate > 0)

  if (!hasInverseRateData) {
    return (
      <div className="h-[500px] flex items-center justify-center">
        <p className="text-gray-500">No hay datos de tasa inversa disponibles para mostrar.</p>
      </div>
    )
  }

  const filteredData = data.filter((point) => point.conversion > 0 && point.inverseRate !== undefined)

  const maxInverseRate = Math.max(...filteredData.map((d) => d.inverseRate || 0))

  const p95 = percentile(
    filteredData.map((d) => d.inverseRate || 0),
    95,
  )
  const yMax = maxInverseRate > p95 * 2 ? p95 * 1.5 : maxInverseRate * 1.1

  return (
    <div className="h-[500px]">
      <h3 className="text-xl font-semibold text-center mb-4">Velocidad de Reaccón Inversa</h3>
      <ResponsiveContainer width="100%" height="90%">
        <LineChart data={filteredData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="conversion"
            label={{ value: "Conversion (X)", position: "insideBottomRight", offset: -5, fontWeight: "bold" }}
            domain={[0, 1]}
            tickFormatter={(value) => value.toFixed(2)}
            style={{ fontWeight: "bold" }}
          />
          <YAxis
            label={{ value: `1/r [L·${unitMeasure}/mol]`, angle: -90, position: "insideLeft", fontWeight: "bold" }}
            domain={[0, yMax]}
            tickFormatter={(value) => value.toFixed(1)}
            style={{ fontWeight: "bold" }}
          />
          <Tooltip
            formatter={(value: number) => value.toFixed(4)}
            labelFormatter={(label: number) => `Conversión: ${label.toFixed(4)}`}
          />
          <Legend />
          <Line type="monotone" dataKey="inverseRate" name="Tasa de Reacción Inversa" stroke="#8884d8" dot={{ r: 1 }} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}

function percentile(arr: number[], p: number) {
  if (arr.length === 0) return 0
  if (arr.length === 1) return arr[0]

  const sorted = [...arr].sort((a, b) => a - b)
  const index = Math.ceil((p / 100) * sorted.length) - 1

  return sorted[index]
}

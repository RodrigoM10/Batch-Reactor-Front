"use client"

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"

interface ConversionVsTemperatureChartProps {
  data: any[]
}

export function ConversionVsTemperatureChart({ data }: ConversionVsTemperatureChartProps) {
  // Calcular los límites del dominio para el eje X (temperatura)
  const minTemp = Math.floor(Math.min(...data.map((d) => d.temperature)) - 2)
  const maxTemp = Math.ceil(Math.max(...data.map((d) => d.temperature)) + 2)

  // Calcular el máximo valor para el eje Y (conversión)
  const maxConversion = Math.max(...data.map((d) => d.conversion || 0))
  const yMax = Math.min(maxConversion * 1.1, 1)

  return (
    <div className="h-[500px]">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="temperature"
            label={{ value: "Temperatura (K)", position: "insideBottomRight", offset: -5 }}
            domain={[minTemp, maxTemp]}
            tickFormatter={(value) => value.toFixed(0)}
          />
          <YAxis
            dataKey="conversion"
            label={{ value: "Conversion", angle: -90, position: "insideLeft" }}
            domain={[0, yMax]}
            tickFormatter={(value) => value.toFixed(2)}
          />
          <Tooltip
            formatter={(value: number) => value.toFixed(4)}
            labelFormatter={(label: number) => `Temperatura: ${label.toFixed(2)} K`}
          />
          <Legend />
          <Line
            type="monotone"
            dataKey="conversion"
            name="Conversión (X)"
            stroke="#8884d8"
            activeDot={{ r: 8 }}
            dot={{ r: 1 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}

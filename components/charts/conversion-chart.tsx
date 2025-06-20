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
import { useMemo } from "react"

interface ConversionChartProps {
  data: any[]
  equilibriumConversion?: number
}

export function ConversionChart({ data, equilibriumConversion }: ConversionChartProps) {
  // Convertir los datos para mostrar el tiempo en segundos
  const dataInSeconds = useMemo(() => {
    return data.map((point) => ({
      ...point,
      timeInSeconds: point.time 
    }))
  }, [data])

  // Calcular el máximo valor para el eje Y basado en la conversión de equilibrio o los datos
  const maxConversion = data.length > 0 ? Math.max(...data.map((d) => d.conversion || 0)) : 0
  const yMax = equilibriumConversion
    ? Math.min(Math.max(equilibriumConversion * 1.1, maxConversion * 1.1), 1)
    : Math.min(maxConversion * 1.1, 1)

  // Formatear la conversión para el tooltip (4 decimales)
  const formatConversion = (value: number) => {
    return value.toFixed(4)
  }

  return (
    <div className="h-[500px]">
      <h3 className="text-xl font-semibold text-center mb-4">
        Conversión en función del tiempo de reacción 
      </h3>
      <ResponsiveContainer width="100%" height="100%">
        
        <LineChart data={dataInSeconds} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="timeInSeconds"
            label={{ value: "Tiempo (min)", position: "insideBottomRight", offset: -5 }}
            tickFormatter={(value) => value.toFixed(1)}
          />
          <YAxis
            label={{ value: "Conversión X_A", angle: -90, position: "insideLeft" }}
            domain={[0, yMax]}
            tickFormatter={(value) => value.toFixed(2)}
          />
          <Tooltip
            formatter={(value: number) => formatConversion(value)}
            labelFormatter={(label: number) => `Tiempo: ${label.toFixed(2)} s`}
          />
          <Legend />
          {equilibriumConversion && (
            <ReferenceLine
              y={equilibriumConversion}
              label={{
                value: `${equilibriumConversion.toFixed(4)}`,
                position: "insideTopRight",
                fill: "red",
                fontSize: 12,
              }}
              stroke="red"
              strokeDasharray="3 3"
            />
          )}
          <Line
            type="monotone"
            dataKey="conversion"
            name="Conversión de A"
            stroke="#0066cc"
            activeDot={{ r: 8 }}
            dot={false}
            strokeWidth={2}
          />
          {data[0]?.equilibrium && (
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
  )
}

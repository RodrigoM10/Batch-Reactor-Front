"use client"

import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"
import { useMemo } from "react"

interface HeatRatesChartProps {
  data: any[]
}

export function HeatRatesChart({ data }: HeatRatesChartProps) {
  // Procesar los datos para asegurar que tenemos las tasas de calor
  const processedData = useMemo(() => {
    if (!data || data.length === 0) return []

    // Verificar si ya tenemos datos de tasas de calor
    const hasHeatRateData = data.some((d) => d.heatGenerated !== undefined && d.heatRemoved !== undefined)

    if (hasHeatRateData) {
      console.log("Datos de tasas de calor encontrados:", data.slice(0, 3))
      return data
    }

    // Si no hay datos, devolver array vacío
    console.warn("No se encontraron datos de tasas de calor en los datos proporcionados")
    return []
  }, [data])

  // Si no hay datos, mostrar mensaje
  if (processedData.length === 0) {
    return (
      <div className="h-[500px] flex items-center justify-center">
        <p className="text-gray-500">No hay datos de tasas de calor disponibles para mostrar.</p>
      </div>
    )
  }

  // Determinar el rango de valores para el eje Y
  const allValues = processedData.flatMap((d) => [d.heatGenerated || 0, d.heatRemoved || 0])
  const minValue = Math.min(...allValues)
  const maxValue = Math.max(...allValues)
  const yDomain = [
    minValue < 0 ? Math.floor(minValue * 1.1) : 0, // Si hay valores negativos, ajustar el mínimo
    Math.ceil(maxValue * 1.1), // Añadir un 10% de margen al máximo
  ]

  // Formatear el tiempo para el tooltip
  const formatTime = (value: number) => {
    if (value < 0.1) {
      return `${(value * 60).toFixed(1)} s`
    }
    return `${value.toFixed(1)} min`
  }

  return (
    <div className="h-[500px]">
      <h3 className="text-xl font-semibold text-center mb-4">Tasas de Generación y Remoción de Calor</h3>
      <ResponsiveContainer width="100%" height="90%">
        <AreaChart data={processedData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="time"
            label={{ value: "Tiempo (min)", position: "insideBottomRight", offset: -5 }}
            tickFormatter={(value) => value.toFixed(1)}
          />
          <YAxis
            label={{ value: "Tasa de Calor (cal/s)", angle: -90, position: "insideLeft" }}
            domain={yDomain}
            tickFormatter={(value) => value.toFixed(0)}
          />
          <Tooltip
            formatter={(value: number) => value.toFixed(2) + " cal/s"}
            labelFormatter={(label: number) => `Tiempo: ${formatTime(label)}`}
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
  )
}

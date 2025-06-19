"use client"

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"

interface TemperatureChartProps {
  data: any[]
  energyMode: "adiabatic" | "icq"
}

export function TemperatureChart({ data, energyMode }: TemperatureChartProps) {
  // Calcular los límites del dominio para el eje Y
  const minTemp = Math.floor(Math.min(...data.map((d) => d.temperature)) - 2)
  const maxTemp = Math.ceil(Math.max(...data.map((d) => d.temperature)) + 2)

  // Si hay temperatura de enfriamiento, ajustar el mínimo
  if (energyMode === "icq" && data[0]?.coolingTemperature) {
    const minCoolingTemp = Math.floor(
      Math.min(...data.map((d) => d.coolingTemperature || Number.POSITIVE_INFINITY)) - 2,
    )
    const minTempValue = Math.min(minTemp, minCoolingTemp)
    // Asegurar que el mínimo no sea menor que 0
    const adjustedMinTemp = Math.max(0, minTempValue)
    return renderChart(adjustedMinTemp, maxTemp)
  }

  return renderChart(minTemp, maxTemp)

  function renderChart(minTemp: number, maxTemp: number) {
    // Formatear el tiempo para el tooltip (menos decimales)
    const formatTime = (value: number) => {
      if (value < 0.1) {
        return `${(value * 60).toFixed(1)} s`
      }
      return `${value.toFixed(1)} min`
    }

    return (
      <div className="h-[500px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="time"
              label={{ value: "Time (min)", position: "insideBottomRight", offset: -5 }}
              tickFormatter={(value) => value.toFixed(1)}
            />
            <YAxis
              label={{ value: "Temperatura (K)", angle: -90, position: "insideLeft" }}
              domain={[minTemp, maxTemp]}
              tickFormatter={(value) => value.toFixed(0)}
            />
            <Tooltip
              formatter={(value: number) => value.toFixed(2)}
              labelFormatter={(label: number) => `Tiempo: ${formatTime(label)}`}
            />
            <Legend />
            <Line
              type="monotone"
              dataKey="temperature"
              name="Temperatura del Reactor (K)"
              stroke="#ff7300"
              activeDot={{ r: 8 }}
              dot={{ r: 1 }}
            />
            {energyMode === "icq" && (
              <Line
                type="monotone"
                dataKey="coolingTemperature"
                name="Temperatura de Enfriamiento (K)"
                stroke="#0088fe"
                strokeDasharray="5 5"
                dot={false}
              />
            )}
          </LineChart>
        </ResponsiveContainer>
      </div>
    )
  }
}

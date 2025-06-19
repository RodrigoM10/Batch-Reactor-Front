
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
import { useMemo } from "react"

interface ConcentrationChartProps {
  data: any[]
}

export function ConcentrationChart({ data }: ConcentrationChartProps) {
  // Verificar y procesar los datos para asegurar que tenemos concentraciones
  const processedData = useMemo(() => {
    if (!data || data.length === 0) return []

    // Verificar si ya tenemos datos de concentración
    const hasConcentrationData = data.some(
      (d) =>
        d.concentrationA !== undefined ||
        d.concentrationB !== undefined ||
        d.concentrationC !== undefined ||
        d.concentrationD !== undefined,
    )

    if (hasConcentrationData) {
      // Asegurar que todos los puntos tengan valores para todas las concentraciones
      return data.map((point) => ({
        ...point,
        concentrationA: point.concentrationA || 0,
        concentrationB: point.concentrationB || 0,
        concentrationC: point.concentrationC || 0,
        concentrationD: point.concentrationD || 0,
      }))
    }

    // Si no hay datos de concentración, intentar calcularlos a partir de la conversión
    if (data[0]?.conversion !== undefined && data[0]?.time !== undefined) {
      console.log("Calculando concentraciones a partir de la conversión")

      // Estimar la concentración inicial (usar el primer punto o un valor por defecto)
      const initialConcentration = data[0]?.concentration || 1.0

      return data.map((point) => ({
        ...point,
        concentrationA: initialConcentration * (1 - (point.conversion || 0)),
        concentrationB: initialConcentration * (1 - (point.conversion || 0)),
        concentrationC: initialConcentration * (point.conversion || 0),
        concentrationD: 0, // Asumimos que D no participa si no hay datos
      }))
    }

    return data
  }, [data])

  // Verificar si hay datos de concentración después del procesamiento
  const hasConcentrationData = processedData.some(
    (d) =>
      (d.concentrationA !== undefined && d.concentrationA > 0) ||
      (d.concentrationB !== undefined && d.concentrationB > 0) ||
      (d.concentrationC !== undefined && d.concentrationC > 0) ||
      (d.concentrationD !== undefined && d.concentrationD > 0),
  )

  // Mostrar mensaje si no hay datos
  if (!hasConcentrationData || processedData.length === 0) {
    return (
      <div className="h-[500px] flex items-center justify-center">
        <p className="text-gray-500">No hay datos de concentración disponibles para mostrar.</p>
      </div>
    )
  }

  // Determinar el valor mínimo y máximo general entre todas las concentraciones
  const allConcentrations = processedData.reduce((acc, d) => {
    if (d.concentrationA !== undefined) acc.push(d.concentrationA)
    if (d.concentrationB !== undefined) acc.push(d.concentrationB)
    if (d.concentrationC !== undefined) acc.push(d.concentrationC)
    if (d.concentrationD !== undefined) acc.push(d.concentrationD)
    return acc
  }, [])

  const minConcentration = Math.min(...allConcentrations)
  const maxConcentration = Math.max(...allConcentrations)

  // Ajustar el dominio del eje Y
  // Si el mínimo es muy cercano a 0, mantener el inicio en 0
  // Si hay valores negativos (aunque no debería en concentraciones), ajustar el mínimo
  const yMin = minConcentration < 0.001 ? 0 : minConcentration * 0.9 // Un pequeño margen inferior
  const yMax = maxConcentration * 1.1 // Un pequeño margen superior

  // Verificar qué componentes tienen datos para mostrar
  const showComponentA = processedData.some((d) => (d.concentrationA || 0) > 0)
  const showComponentB = processedData.some((d) => (d.concentrationB || 0) > 0)
  const showComponentC = processedData.some((d) => (d.concentrationC || 0) > 0)
  const showComponentD = processedData.some((d) => (d.concentrationD || 0) > 0)

  // Formatear el tiempo para el tooltip
  const formatTime = (value: number) => {
    if (value < 0.1) {
      return `${(value * 60).toFixed(1)} s`
    }
    return `${value.toFixed(1)} min`
  }

  console.log("Datos procesados para el gráfico:", processedData.slice(0, 3))

  return (
    <div className="h-[500px]">
      <h3 className="text-xl font-semibold text-center mb-4">
        Concentraciones de Reactivos y Productos vs. Tiempo
      </h3>
      <ResponsiveContainer width="100%" height="90%">
        <LineChart
          data={processedData}
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="time"
            label={{ value: "Tiempo (min)", position: "insideBottomRight", offset: -5 }}
            tickFormatter={(value) => value.toFixed(1)}
          />
          <YAxis
            label={{ value: "Concentración (mol/L)", angle: -90, position: "insideLeft" }}
            domain={[yMin, yMax]} // Aquí ajustamos el dominio
            tickFormatter={(value) => value.toFixed(value < 0.01 ? 4 : 2)} // Ajuste de formato para valores pequeños
          />
          <Tooltip
            formatter={(value: number) => value.toFixed(4)}
            labelFormatter={(label: number) => `Tiempo: ${formatTime(label)}`}
          />
          <Legend />
          {showComponentA && (
            <Line
              type="monotone"
              dataKey="concentrationA"
              name="[A] (Reactivo)"
              stroke="#ff0000"
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 6 }}
            />
          )}
          {showComponentB && (
            <Line
              type="monotone"
              dataKey="concentrationB"
              name="[B] (Reactivo)"
              stroke="#0000ff"
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 6 }}
            />
          )}
          {showComponentC && (
            <Line
              type="monotone"
              dataKey="concentrationC"
              name="[C] (Producto)"
              stroke="#00cc00"
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 6 }}
            />
          )}
          {showComponentD && (
            <Line
              type="monotone"
              dataKey="concentrationD"
              name="[D] (Producto)"
              stroke="#cc00cc"
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 6 }}
            />
          )}
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}

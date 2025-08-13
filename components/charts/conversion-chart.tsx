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
  Label,
} from "recharts"
import { useMemo, useState } from "react"

interface ConversionChartProps {
  data: Array<{ time: number; conversion: number; equilibrium?: number }>;
  equilibriumConversion?: number;
  finalConversion?: number;
  unitMeasure: "min" | "seg";
}

export function ConversionChart({
  data,
  finalConversion,
  unitMeasure,
}: ConversionChartProps) {
  const dataInSeconds = useMemo(
    () => data.map((point) => ({ ...point, timeInSeconds: point.time })),
    [data]
  )

  const computedMin = useMemo(
    // Añadido control para array vacío para evitar Math.min() en array vacío.
    () => (dataInSeconds.length > 0 ? Math.min(...dataInSeconds.map((d) => d.timeInSeconds)) : 0),
    [dataInSeconds]
  )
  const computedMax = useMemo(
    // Añadido control para array vacío y valor por defecto.
    () => (dataInSeconds.length > 0 ? Math.max(...dataInSeconds.map((d) => d.timeInSeconds)) : 1),
    [dataInSeconds]
  )


  const [xAxisMin, setXAxisMin] = useState<number>(computedMin)
  const [xAxisMax, setXAxisMax] = useState<number>(computedMax)
  const [xAxisTickInterval, setXAxisTickInterval] = useState<number>(

    Number(((computedMax - computedMin) / 5 || 0.1).toFixed(2)) 
  )

  const xTicks = xAxisTickInterval
    ? Array.from(
        { length: Math.floor((xAxisMax - xAxisMin) / xAxisTickInterval) + 1 },
        (_, i) => Number((xAxisMin + i * xAxisTickInterval).toFixed(2))
      )
    : undefined

  const filteredData = useMemo(
    () =>
      dataInSeconds.filter(
        (point) => point.timeInSeconds >= xAxisMin && point.timeInSeconds <= xAxisMax
      ),
    [dataInSeconds, xAxisMin, xAxisMax]
  )

  const maxConversion = data.length > 0 ? Math.max(...data.map((d) => d.conversion || 0)) : 0

  let calculatedYMax = 0;
  calculatedYMax = maxConversion;

  if (filteredData[0].equilibrium !== undefined && filteredData[0].equilibrium !== null) {
      calculatedYMax = Math.max(calculatedYMax, filteredData[0].equilibrium);
  } else if (finalConversion !== undefined && finalConversion !== null) {
      calculatedYMax = Math.max(calculatedYMax, finalConversion);
  }
  const yMax = Math.min(Math.max(calculatedYMax * 1.1, 0.1), 1);

  const formatConversion = (value: number) => value.toFixed(4)

  return (
    <div>
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
            {filteredData[0].equilibrium !== undefined && filteredData[0].equilibrium !== null && (
             <ReferenceLine
                  y={filteredData[0].equilibrium}
                  stroke="#ff0000"
                  strokeDasharray="5 5"
                  strokeWidth={2}
                >
                <Label
                  value={`Conversión de equilibrio: ${filteredData[0].equilibrium.toFixed(3)}`}
                  position="bottom" 
                  offset={10} 
                  fill="#ff0000" 
                  style={{ fontWeight: "bold" }} 
                />
              </ReferenceLine>
            )}
          </LineChart>
        </ResponsiveContainer>
      </div>

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
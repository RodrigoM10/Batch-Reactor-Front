// ConcentrationChart.tsx

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
import { useMemo, useState, useEffect } from "react" // Importamos useEffect

interface ConcentrationChartProps {
  data: any[]
  unitMeasure: "min" | "seg"
}

export function ConcentrationChart({ data, unitMeasure }: ConcentrationChartProps) {
  // Verificar y procesar los datos para asegurar que tenemos concentraciones
  const processedData = useMemo(() => {
    if (!data || data.length === 0) return []

    // Si ya tiene concentraciones, usar esas directamente, asegurando que sean números o 0
    const hasConcKeys = data.some(
      (d) =>
        d.concentrationA !== undefined ||
        d.concentrationB !== undefined ||
        d.concentrationC !== undefined ||
        d.concentrationD !== undefined,
    )

    if (hasConcKeys) {
      return data.map((point) => ({
        ...point,
        concentrationA: typeof point.concentrationA === 'number' ? point.concentrationA : 0,
        concentrationB: typeof point.concentrationB === 'number' ? point.concentrationB : 0,
        concentrationC: typeof point.concentrationC === 'number' ? point.concentrationC : 0,
        concentrationD: typeof point.concentrationD === 'number' ? point.concentrationD : 0,
      }));
    }

    // Si no tiene concentraciones pero tiene conversión, calcularlas
    // Esto es una suposición sobre cómo se calculan C_A, C_B, etc. a partir de la conversión
    // Basado en tu código anterior, parece que se asumía CA0 = CB0 = 1 para este cálculo.
    // Si tu lógica es diferente, ajústala.
    if (data[0]?.conversion !== undefined && data[0]?.time !== undefined) {
      // Necesitas una concentración inicial real para calcular esto correctamente.
      // Aquí asumo un valor predeterminado si no está en `data[0]`.
      const initialConcA = data[0]?.C_A0 || data[0]?.initialConcentrationA || 1.0;
      const initialConcB = data[0]?.C_B0 || data[0]?.initialConcentrationB || 1.0;
      const initialConcC = data[0]?.C_C0 || data[0]?.initialConcentrationC || 0; // C y D suelen iniciar en 0
      const initialConcD = data[0]?.C_D0 || data[0]?.initialConcentrationD || 0;

      return data.map((point) => ({
        ...point,
        // Esto asume una estequiometría simple A + B -> C + D
        // Deberías ajustar esto según la estequiometría real de tu simulación
        concentrationA: initialConcA * (1 - (point.conversion || 0)),
        concentrationB: initialConcB * (1 - (point.conversion || 0)),
        concentrationC: initialConcC + (initialConcA * (point.conversion || 0)), // Asume formación
        concentrationD: initialConcD + (initialConcA * (point.conversion || 0)), // Asume formación
        time: point.time, // Asegura que el tiempo se propaga
      }));
    }

    return data; // Retorna los datos tal cual si ninguna de las condiciones anteriores se cumple
  }, [data])

  // Sincronizar estados de zoom con los datos iniciales
  useEffect(() => {
    if (processedData.length > 0) {
      const times = processedData.map((d) => d.time);
      const newComputedMin = Math.min(...times);
      const newComputedMax = Math.max(...times);

      setXAxisMin(newComputedMin);
      setXAxisMax(newComputedMax);
      setXAxisTickInterval(Number(((newComputedMax - newComputedMin) / 5).toFixed(2)) || 1);
    }
  }, [processedData]);


  // Filtrar ausencia de datos
  const hasConcData = processedData.some(
    (d) =>
      (d.concentrationA || 0) > 0 ||
      (d.concentrationB || 0) > 0 ||
      (d.concentrationC || 0) > 0 ||
      (d.concentrationD || 0) > 0,
  )

  if (!hasConcData || processedData.length === 0) {
    return (
      <div className="h-[500px] flex items-center justify-center">
        <p className="text-gray-500">No hay datos de concentración disponibles para mostrar.</p>
      </div>
    )
  }

  // Calcular dominio de tiempo para eje X
  const times = processedData.map((d) => d.time)
  const computedMin = Math.min(...times) // Redundante si se usa useEffect, pero se mantiene para claridad del useMemo
  const computedMax = Math.max(...times)

  // Estados para inputs eje X (zoom) (gestionados por useEffect)
  const [xAxisMin, setXAxisMin] = useState<number>(computedMin)
  const [xAxisMax, setXAxisMax] = useState<number>(computedMax)
  const [xAxisTickInterval, setXAxisTickInterval] = useState<number>(
    Number(((computedMax - computedMin) / 5).toFixed(2)) || 1 // Añadido || 1 para evitar NaN/Infinito
  )

  // Generar ticks eje X
  const xTicks = useMemo(() => {
    if (!xAxisTickInterval || xAxisTickInterval <= 0) return undefined;
    const ticks = [];
    for (let i = xAxisMin; i <= xAxisMax; i += xAxisTickInterval) {
      ticks.push(Number(i.toFixed(2)));
    }
    return ticks;
  }, [xAxisMin, xAxisMax, xAxisTickInterval]);


  // Filtrar processedData según rango X
  const filteredData = useMemo(
    () =>
      processedData.filter(
        (pt) => pt.time >= xAxisMin && pt.time <= xAxisMax
      ),
    [processedData, xAxisMin, xAxisMax]
  )

  // Dominio Y basado en concentraciones
  const allConc = filteredData.flatMap((d) => [d.concentrationA, d.concentrationB, d.concentrationC, d.concentrationD])
    .filter(val => typeof val === 'number' && !isNaN(val)); // Filtrar undefined/NaN

  const minConc = allConc.length > 0 ? Math.min(...allConc) : 0;
  const maxConc = allConc.length > 0 ? Math.max(...allConc) : 1;

  // Ajuste de dominio Y: Asegurarse de que yMin no sea negativo y yMax tenga un pequeño margen
  const yMin = minConc < 0.001 && minConc >= 0 ? 0 : Math.max(0, minConc * 0.9); // No ir por debajo de 0
  const yMax = maxConc > 0 ? maxConc * 1.1 : 1.1; // Si maxConc es 0, dar un rango mínimo

  // Mostrar componentes
  const showA = filteredData.some((d) => (d.concentrationA || 0) > 0)
  const showB = filteredData.some((d) => (d.concentrationB || 0) > 0)
  const showC = filteredData.some((d) => (d.concentrationC || 0) > 0)
  const showD = filteredData.some((d) => (d.concentrationD || 0) > 0)

  // Formatos
  // formatTime ya no convierte a segundos si unitMeasure es "min"
  const formatTime = (v: number) => `${v.toFixed(1)}`;
  const formatVal = (v: number) => v.toFixed(v < 0.01 && v !== 0 ? 4 : 2); // Si es muy pequeño pero no 0, 4 decimales. Si es 0 o más grande, 2 decimales.


  return (
    <div>
      {/* Gráfico */}
      <div className="h-[500px]">
        <h3 className="text-xl font-semibold text-center mb-4">
          Concentraciones vs Tiempo
        </h3>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={filteredData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="time"
              type="number"
              domain={[xAxisMin, xAxisMax]}
              ticks={xTicks}
              label={{ value: `Tiempo (${unitMeasure})`, position: "insideBottomRight", offset: -5, style: { fontWeight: "bold" }}}
              tickFormatter={(v) => v.toFixed(1)}
              style={{ fontWeight: "bold" }}
            />
            <YAxis
              label={{
                value: "Concentración (mol/L)",
                angle: -90,
                position: "insideLeft",
                // ***** CAMBIO CLAVE AQUÍ: AUMENTAR dx para mover la etiqueta hacia la izquierda *****
                dx: -20, // Ajusta este valor. Un valor más negativo lo moverá más a la izquierda.
                style: { fontWeight: "bold" }
              }}
              domain={[yMin, yMax]}
              tickFormatter={formatVal}
              style={{ fontWeight: "bold" }}
            />
            <Tooltip
              formatter={(val: number) => val.toFixed(4)}
              labelFormatter={(l: number) => `Tiempo: ${formatTime(l)} ${unitMeasure}`}
            />
            <Legend />
            {showA && <Line type="monotone" dataKey="concentrationA" name="[A]" stroke="#ff0000" dot={false} strokeWidth={2} />}
            {showB && <Line type="monotone" dataKey="concentrationB" name="[B]" stroke="#0000ff" dot={false} strokeWidth={2} />}
            {showC && <Line type="monotone" dataKey="concentrationC" name="[C]" stroke="#00cc00" dot={false} strokeWidth={2} />}
            {showD && <Line type="monotone" dataKey="concentrationD" name="[D]" stroke="#cc00cc" dot={false} strokeWidth={2} />}
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Controles para eje X */}
      <div className="mb-4 mt-10 flex space-x-2 items-center justify-end">
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
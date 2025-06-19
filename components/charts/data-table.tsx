"use client"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useMemo } from "react"

interface DataTableProps {
  data: any[]
  operationType: "isothermic" | "non-isothermic"
  energyMode: "adiabatic" | "icq"
}

export function DataTable({ data, operationType, energyMode }: DataTableProps) {
  // Seleccionar puntos significativos de los datos
  const significantPoints = useMemo(() => {
    if (!data || data.length === 0) return []

    const minTargetCount = 10 // Mínimo de puntos a mostrar
    const maxTargetCount = 15 // Máximo de puntos a mostrar

    // Si hay menos puntos que el mínimo, mostrarlos todos
    if (data.length <= minTargetCount) return data

    const result = new Map() // Usamos un Map para evitar duplicados y mantener el orden inicial
    result.set(data[0].time, data[0]) // Siempre incluir el primer punto

    // Si el último punto es diferente al primero, incluirlo también
    if (data[data.length - 1].time !== data[0].time) {
      result.set(data[data.length - 1].time, data[data.length - 1])
    }


    // Buscar puntos con cambios significativos en la conversión
    // Calculamos un umbral basado en el rango total de conversión
    const minConversion = Math.min(...data.map(d => d.conversion));
    const maxConversion = Math.max(...data.map(d => d.conversion));
    const conversionRange = maxConversion - minConversion;

    // Un umbral de cambio significativo: 2% del rango total de conversión, mínimo 0.01
    const significantChangeThreshold = Math.max(conversionRange * 0.02, 0.01);


    let lastSignificantTime = data[0].time;
    for (let i = 1; i < data.length - 1; i++) {
        const currentTime = data[i].time;
        const currentConversion = data[i].conversion;
        const lastSignificantPoint = result.get(lastSignificantTime);

        if (lastSignificantPoint) {
            const conversionChange = Math.abs(currentConversion - lastSignificantPoint.conversion);

            // Incluir puntos si hay un cambio significativo en la conversión
            if (conversionChange >= significantChangeThreshold) {
                result.set(currentTime, data[i]);
                lastSignificantTime = currentTime;
                // Si ya alcanzamos el máximo, podemos detener la búsqueda de cambios significativos
                if (result.size >= maxTargetCount) break;
            }
        }
    }


    // Si no tenemos suficientes puntos, añadir más a intervalos regulares hasta alcanzar minTargetCount
    if (result.size < minTargetCount) {
        const pointsToAdd = minTargetCount - result.size;
        // Calcular un intervalo para distribuir los puntos restantes
        const interval = Math.max(1, Math.floor(data.length / (pointsToAdd + 1)));

        for (let i = 1; i <= pointsToAdd; i++) {
            const index = i * interval;
            // Asegurarse de que el índice esté dentro de los límites y el punto no esté ya incluido
            if (index > 0 && index < data.length - 1 && !result.has(data[index].time)) {
                result.set(data[index].time, data[index]);
            }
            // Detener si ya alcanzamos minTargetCount
             if (result.size >= minTargetCount) break;
        }
    }

    // Si todavía tenemos más de maxTargetCount puntos (lo cual es poco probable con la lógica actual,
    // pero es una red de seguridad), podríamos aplicar otra lógica para reducirlos,
    // por ejemplo, priorizando los puntos con mayor cambio entre sí.
    // Por simplicidad en esta iteración, nos enfocaremos en asegurar el mínimo y limitar el máximo
    // por la lógica de añadir puntos. Si la búsqueda de significativos excede el máximo,
    // ya rompimos el bucle.

    // Convertir el Map a un array y ordenar por tiempo
    const finalPoints = Array.from(result.values()).sort((a, b) => a.time - b.time);

    // Asegurarse de que no superamos el máximo de puntos, tomando los primeros maxTargetCount
    return finalPoints.slice(0, maxTargetCount);


  }, [data])

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-center mb-4">
        Concentraciones en el tiempo
      </h2>

      <div className="rounded-md border overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-center font-medium">Tiempo (min)</TableHead>
              <TableHead className="text-center font-medium">[A] (mol/L)</TableHead>
              <TableHead className="text-center font-medium">[B] (mol/L)</TableHead>
              <TableHead className="text-center font-medium">[C] (mol/L)</TableHead>
              <TableHead className="text-center font-medium">[D] (mol/L)</TableHead>
              {operationType === "non-isothermic" && (
                <TableHead className="text-center font-medium">Temperatura (K)</TableHead>
              )}
              {operationType === "non-isothermic" && energyMode === "icq" && (
                <TableHead className="text-center font-medium">Temp. Enfriamiento (K)</TableHead>
              )}
            </TableRow>
          </TableHeader>
          <TableBody>
            {significantPoints.map((row, index) => (
              <TableRow key={index}>
                <TableCell className="text-center">
                  {typeof row.time === "number" ? row.time.toFixed(2) : row.time}
                </TableCell>
                <TableCell className="text-center">
                  {typeof row.concentrationA === "number" ? row.concentrationA.toFixed(4) : "0.0000"}
                </TableCell>
                <TableCell className="text-center">
                  {typeof row.concentrationB === "number" ? row.concentrationB.toFixed(4) : "0.0000"}
                </TableCell>
                <TableCell className="text-center">
                  {typeof row.concentrationC === "number" ? row.concentrationC.toFixed(4) : "0.0000"}
                </TableCell>
                <TableCell className="text-center">
                  {typeof row.concentrationD === "number" ? row.concentrationD.toFixed(4) : "0.0000"}
                </TableCell>
                {operationType === "non-isothermic" && (
                  <TableCell className="text-center">
                    {typeof row.temperature === "number" ? row.temperature.toFixed(2) : row.temperature}
                  </TableCell>
                )}
                {operationType === "non-isothermic" && energyMode === "icq" && (
                  <TableCell className="text-center">
                    {row.coolingTemperature ? row.coolingTemperature.toFixed(2) : "N/A"}
                  </TableCell>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="text-sm text-gray-500 text-center">
        Mostrando {significantPoints.length} puntos de {data.length} puntos totales
      </div>
    </div>
  )
}

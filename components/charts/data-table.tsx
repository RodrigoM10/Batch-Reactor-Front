"use client"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useMemo } from "react"

interface DataTableProps {
  data: any[]
  unitMeasure: "min" | "seg"
  operationType: "isothermic" | "non-isothermic"
  energyMode: "adiabatic" | "icq"
}

export function DataTable({ data, operationType, energyMode, unitMeasure }: DataTableProps) {
  const significantPoints = useMemo(() => {
    if (!data || data.length === 0) return []

    const minTargetCount = 10
    const maxTargetCount = 15

    if (data.length <= minTargetCount) return data

    const result = new Map()
    result.set(data[0].time, data[0])

    if (data[data.length - 1].time !== data[0].time) {
      result.set(data[data.length - 1].time, data[data.length - 1])
    }

    const minConversion = Math.min(...data.map(d => d.conversion));
    const maxConversion = Math.max(...data.map(d => d.conversion));
    const conversionRange = maxConversion - minConversion;

    const significantChangeThreshold = Math.max(conversionRange * 0.02, 0.01);

    let lastSignificantTime = data[0].time;
    for (let i = 1; i < data.length - 1; i++) {
        const currentTime = data[i].time;
        const currentConversion = data[i].conversion;
        const lastSignificantPoint = result.get(lastSignificantTime);

        if (lastSignificantPoint) {
            const conversionChange = Math.abs(currentConversion - lastSignificantPoint.conversion);

            if (conversionChange >= significantChangeThreshold) {
                result.set(currentTime, data[i]);
                lastSignificantTime = currentTime;
                if (result.size >= maxTargetCount) break;
            }
        }
    }

    if (result.size < minTargetCount) {
        const pointsToAdd = minTargetCount - result.size;
        const interval = Math.max(1, Math.floor(data.length / (pointsToAdd + 1)));

        for (let i = 1; i <= pointsToAdd; i++) {
            const index = i * interval;
            if (index > 0 && index < data.length - 1 && !result.has(data[index].time)) {
                result.set(data[index].time, data[index]);
            }
            if (result.size >= minTargetCount) break;
        }
    }

    const finalPoints = Array.from(result.values()).sort((a, b) => a.time - b.time);
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
              <TableHead className="text-center font-medium text-base md:text-lg">Tiempo ({unitMeasure})</TableHead>
              <TableHead className="text-center font-medium text-base md:text-lg">[A] (mol/L)</TableHead>
              <TableHead className="text-center font-medium text-base md:text-lg">[B] (mol/L)</TableHead>
              <TableHead className="text-center font-medium text-base md:text-lg">[C] (mol/L)</TableHead>
              <TableHead className="text-center font-medium text-base md:text-lg">[D] (mol/L)</TableHead>
              {operationType === "non-isothermic" && (
                <TableHead className="text-center font-medium text-base md:text-lg">Temperatura (K)</TableHead>
              )}
              {operationType === "non-isothermic" && energyMode === "icq" && (
                <TableHead className="text-center font-medium text-base md:text-lg">Temp. Enfriamiento (K)</TableHead>
              )}
            </TableRow>
          </TableHeader>
          <TableBody>
            {significantPoints.map((row, index) => (
              <TableRow key={index}>
                <TableCell className="text-center text-sm md:text-base">
                  {typeof row.time === "number" ? row.time.toFixed(2) : row.time}
                </TableCell>
                <TableCell className="text-center text-sm md:text-base">
                  {typeof row.concentrationA === "number" ? row.concentrationA.toFixed(4) : "0.0000"}
                </TableCell>
                <TableCell className="text-center text-sm md:text-base">
                  {typeof row.concentrationB === "number" ? row.concentrationB.toFixed(4) : "0.0000"}
                </TableCell>
                <TableCell className="text-center text-sm md:text-base">
                  {typeof row.concentrationC === "number" ? row.concentrationC.toFixed(4) : "0.0000"}
                </TableCell>
                <TableCell className="text-center text-sm md:text-base">
                  {typeof row.concentrationD === "number" ? row.concentrationD.toFixed(4) : "0.0000"}
                </TableCell>
                {operationType === "non-isothermic" && (
                  <TableCell className="text-center text-sm md:text-base">
                    {typeof row.temperature === "number" ? row.temperature.toFixed(2) : row.temperature}
                  </TableCell>
                )}
                {operationType === "non-isothermic" && energyMode === "icq" && (
                  <TableCell className="text-center text-sm md:text-base">
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

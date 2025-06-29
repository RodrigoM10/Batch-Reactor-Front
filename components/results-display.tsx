"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Download, AlertCircle } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

// Importar componentes modulares
import { DataTable } from "./charts/data-table"
import { ConversionChart } from "./charts/conversion-chart"
import { ConcentrationChart } from "./charts/concentration-chart"
import { TemperatureChart } from "./charts/temperature-chart"
import { HeatRatesChart } from "./charts/heat-rates-chart"
import { InverseRateChart } from "./charts/inverse-rate-chart"
import { SimulationSummary } from "./simulation-summary"
import { ConversionVsTemperatureChart } from "./charts/conversion-vs-temperature-chart"

interface ResultsDisplayProps {
  operationType: "isothermic" | "non-isothermic"
  isothermicMode: "x" | "t"
  energyMode: "adiabatic" | "icq"
  reactionOrder: "1" | "2"
  reactionType: "reversible" | "irreversible"
  equilibriumMethod: "vanthoff" | "gibbs" | "direct"
  unitMeasure: "min"| "seg"
  results?: any // Resultados del backend
}

export default function ResultsDisplay({
  unitMeasure,
  operationType,
  isothermicMode,
  energyMode,
  reactionOrder,
  reactionType,
  equilibriumMethod,
  results,
}: ResultsDisplayProps) {
  const [activeTab, setActiveTab] = useState("conversion")

  // Verificar si hay datos válidos
  const hasValidData = results && results.data && Array.isArray(results.data) && results.data.length > 0

  // Si no hay datos válidos, mostrar mensaje
  if (!hasValidData) {
    return (
      <Card className="h-full">
        <CardHeader>
          <CardTitle>Simulation Results</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center h-[500px]">
          <Alert className="max-w-md">
            <AlertCircle className="h-5 w-5" />
            <AlertTitle>No hay datos disponibles</AlertTitle>
            <AlertDescription>
              No se han recibido datos del backend. Por favor, ejecute la simulación para ver los resultados.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    )
  }

  // Procesar los datos del backend
  const simulationData = results.data

  // Extraer datos adicionales del backend
  const additionalData = results?.additionalData || {}
  const equilibriumConversion = additionalData.finalConversion || 0.95

  // Función para exportar datos a CSV
  const exportToCSV = () => {
    // Cabeceras del CSV
    const headers = Object.keys(simulationData[0]).join(",")

    // Filas de datos
    const rows = simulationData.map((row:any) => Object.values(row).join(",")).join("\n")

    // Contenido completo del CSV
    const csvContent = `${headers}\n${rows}`

    // Crear un blob y un enlace de descarga
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.setAttribute("href", url)
    link.setAttribute("download", "reactor_simulation_results.csv")
    link.style.visibility = "hidden"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  // Determinar qué pestañas mostrar según el modo
  const tabsToShow = [
    { id: "conversion", label: "Conversión" },
    { id: "data", label: "Datos" },
    { id: "concentration", label: "Concentración" },
  ]

  // Añadir pestañas específicas según el modo
  if (operationType === "non-isothermic") {
    tabsToShow.push({ id: "temperature", label: "Temperatura" })
    tabsToShow.push({ id: "temp-conversion", label: "Temp vs Conv" })

    if (energyMode === "icq") {
      tabsToShow.push({ id: "heat", label: "Tasas de Calor" })
    }
  } else {
    // Modo isotérmico
    if (additionalData.volume) {
      tabsToShow.push({ id: "inverse-rate", label: "Tasa Inversa" })
    }
  }

  // Determinar la clase de grid basada en el número de tabs
  const getTabsGridClass = () => {
    const count = tabsToShow.length
    switch (count) {
      case 1:
        return "grid-cols-1"
      case 2:
        return "grid-cols-2"
      case 3:
        return "grid-cols-3"
      case 4:
        return "grid-cols-4"
      case 5:
        return "grid-cols-5"
      case 6:
        return "grid-cols-6"
      default:
        return "grid-cols-3"
    }
  }

  return (
    <Card className="h-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Resultados de la Simulación</CardTitle>
        <Button variant="outline" size="sm" onClick={exportToCSV} className="flex items-center gap-2">
          <Download className="h-4 w-4" />
          Exportar CSV
        </Button>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="conversion" onValueChange={setActiveTab} className="w-full">
          <TabsList className={`${getTabsGridClass()} w-full mb-6`}>
            {tabsToShow.map((tab) => (
              <TabsTrigger key={tab.id} value={tab.id}>
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>

          <div className="mt-6 pt-4">
            <TabsContent value="conversion" className="mt-0">
              <div className="mx-auto max-w-6xl">
                <ConversionChart 
                data={simulationData} 
                equilibriumConversion={equilibriumConversion} 
                unitMeasure={unitMeasure}
                />
              </div>
            </TabsContent>

            <TabsContent value="data" className="mt-0">
              <div className="mx-auto max-w-6xl">
                <DataTable data={simulationData} operationType={operationType} energyMode={energyMode} unitMeasure={unitMeasure} />
              </div>
            </TabsContent>

            <TabsContent value="concentration" className="mt-0">
              <div className="mx-auto max-w-6xl">
                <ConcentrationChart data={simulationData} unitMeasure={unitMeasure} />
              </div>
            </TabsContent>

            {operationType === "non-isothermic" && (
              <TabsContent value="temperature" className="mt-0">
                <div className="mx-auto max-w-6xl">
                  <TemperatureChart data={simulationData} energyMode={energyMode} unitMeasure={unitMeasure} />
                </div>
              </TabsContent>
            )}

            {operationType === "non-isothermic" && (
              <TabsContent value="temp-conversion" className="mt-0">
                <div className="mx-auto max-w-6xl">
                  <ConversionVsTemperatureChart data={simulationData} />
                </div>
              </TabsContent>
            )}

            {/* Pestaña para Heat Rates en modo ICQ */}
            {operationType === "non-isothermic" && energyMode === "icq" && (
              <TabsContent value="heat" className="mt-0">
                <div className="mx-auto max-w-6xl">
                  <HeatRatesChart data={simulationData} unitMeasure={unitMeasure} />
                </div>
              </TabsContent>
            )}

            {/* Pestaña para Inverse Rate en modo isotérmico cuando se calcula el volumen */}
            {operationType === "isothermic" && additionalData.volume && (
              <TabsContent value="inverse-rate" className="mt-0">
                <div className="mx-auto max-w-6xl">
                  <InverseRateChart data={simulationData} unitMeasure={unitMeasure} />
                </div>
              </TabsContent>
            )}
          </div>
        </Tabs>

        <SimulationSummary
          operationType={operationType}
          isothermicMode={isothermicMode}
          energyMode={energyMode}
          reactionOrder={reactionOrder}
          reactionType={reactionType}
          equilibriumMethod={equilibriumMethod}
          additionalData={additionalData}
          unitMeasure={unitMeasure}
        />
      </CardContent>
    </Card>
  )
}

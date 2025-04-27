"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"

interface ResultsDisplayProps {
  operationType: "isothermic" | "non-isothermic"
  isothermicMode: "x" | "t"
  energyMode: "adiabatic" | "icq"
  reactionOrder: "1" | "2"
  equilibriumMethod: "vanthoff" | "gibbs" | "direct"
  results?: any // Resultados del backend
}

export default function ResultsDisplay({
  operationType,
  isothermicMode,
  energyMode,
  reactionOrder,
  equilibriumMethod,
  results,
}: ResultsDisplayProps) {
  const [activeTab, setActiveTab] = useState("data")

  // Generar datos de simulación
  const simulationData = results
    ? processBackendResults(results)
    : generateMockData(operationType, energyMode, reactionOrder)

  function processBackendResults(backendResults: any) {
    // Si no hay resultados o no tienen el formato esperado, devolver datos simulados
    if (!backendResults || !backendResults.data || !Array.isArray(backendResults.data)) {
      return generateMockData(operationType, energyMode, reactionOrder)
    }

    // Procesar los datos del backend
    return backendResults.data.map((point: any) => ({
      time: point.time || 0,
      conversion: Number.parseFloat(point.conversion || 0).toFixed(4),
      concentration: Number.parseFloat(point.concentration || 0).toFixed(4),
      temperature: Number.parseFloat(point.temperature || 298.15).toFixed(2),
    }))
  }

  // Mock data generator (usado cuando no hay resultados del backend)
  function generateMockData(
    operationType: "isothermic" | "non-isothermic",
    energyMode: "adiabatic" | "icq",
    reactionOrder: "1" | "2",
  ) {
    const timePoints = Array.from({ length: 20 }, (_, i) => i * 5) // 0 to 95 minutes

    return timePoints.map((time) => {
      // Base conversion calculation (simplified model)
      // Different calculation based on reaction order
      let conversion
      if (reactionOrder === "1") {
        conversion = 1 - Math.exp(-0.05 * time)
      } else {
        // Second order reaction
        conversion = (0.05 * time) / (1 + 0.05 * time)
      }

      // Base concentration
      const concentration = 1.0 * (1 - conversion)

      // Temperature varies in non-isothermic mode
      let temperature = 298.15
      if (operationType === "non-isothermic") {
        if (energyMode === "adiabatic") {
          // Temperature rises in adiabatic mode
          temperature += 20 * conversion
        } else {
          // Temperature rises then falls in ICQ mode
          temperature += 15 * conversion * Math.exp(-0.03 * time)
        }
      }

      return {
        time,
        conversion: conversion.toFixed(4),
        concentration: concentration.toFixed(4),
        temperature: temperature.toFixed(2),
      }
    })
  }

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Simulation Results</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="data" onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="data">Data</TabsTrigger>
            <TabsTrigger value="conversion">Conversion</TabsTrigger>
            <TabsTrigger value="temperature">Temperature</TabsTrigger>
          </TabsList>

          <TabsContent value="data" className="space-y-4">
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Time (min)</TableHead>
                    <TableHead>Conversion</TableHead>
                    <TableHead>Concentration (mol/L)</TableHead>
                    <TableHead>Temperature (K)</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {simulationData.slice(0, 10).map((row:any, index:any) => (
                    <TableRow key={index}>
                      <TableCell>{row.time}</TableCell>
                      <TableCell>{row.conversion}</TableCell>
                      <TableCell>{row.concentration}</TableCell>
                      <TableCell>{row.temperature}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            <div className="text-sm text-gray-500 text-center">Showing 10 of {simulationData.length} data points</div>
          </TabsContent>

          <TabsContent value="conversion">
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={simulationData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="time" label={{ value: "Time (min)", position: "insideBottomRight", offset: -5 }} />
                  <YAxis label={{ value: "Conversion", angle: -90, position: "insideLeft" }} domain={[0, 1]} />
                  <Tooltip />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="conversion"
                    name="Conversion (X)"
                    stroke="#8884d8"
                    activeDot={{ r: 8 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </TabsContent>

          <TabsContent value="temperature">
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={simulationData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="time" label={{ value: "Time (min)", position: "insideBottomRight", offset: -5 }} />
                  <YAxis
                    label={{ value: "Temperature (K)", angle: -90, position: "insideLeft" }}
                    domain={operationType === "isothermic" ? [295, 300] : [295, 320]}
                  />
                  <Tooltip />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="temperature"
                    name="Temperature (K)"
                    stroke="#ff7300"
                    activeDot={{ r: 8 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </TabsContent>
        </Tabs>

        <div className="mt-4 p-3 bg-gray-50 rounded-md text-sm">
          <p className="font-medium">Simulation Summary:</p>
          <ul className="list-disc list-inside mt-2 space-y-1">
            <li>
              Reaction: <span className="font-medium">A + 2B → 3C</span>
            </li>
            <li>
              Reaction Order:{" "}
              <span className="font-medium">{reactionOrder === "1" ? "First Order" : "Second Order"}</span>
            </li>
            <li>
              Operation Mode:{" "}
              <span className="font-medium">{operationType === "isothermic" ? "Isothermic" : "Non-Isothermic"}</span>
            </li>
            {operationType === "isothermic" && (
              <>
                <li>
                  Calculation Based On:{" "}
                  <span className="font-medium">{isothermicMode === "x" ? "Conversion (X)" : "Time (t)"}</span>
                </li>
                <li>
                  Equilibrium Method:{" "}
                  <span className="font-medium">
                    {equilibriumMethod === "vanthoff"
                      ? "Van't Hoff Equation"
                      : equilibriumMethod === "gibbs"
                        ? "Gibbs Energy"
                        : "Direct Ke Input"}
                  </span>
                </li>
              </>
            )}
            {operationType === "non-isothermic" && (
              <li>
                Energy Mode:{" "}
                <span className="font-medium">{energyMode === "adiabatic" ? "Adiabatic" : "Heat Exchanger (ICQ)"}</span>
              </li>
            )}
            <li>
              Final Conversion:{" "}
              <span className="font-medium">{simulationData[simulationData.length - 1].conversion}</span>
            </li>
            <li>
              Final Temperature:{" "}
              <span className="font-medium">{simulationData[simulationData.length - 1].temperature} K</span>
            </li>
          </ul>
        </div>
      </CardContent>
    </Card>
  )
}

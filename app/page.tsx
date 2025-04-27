"use client"

import { Card, CardContent } from "@/components/ui/card"
import { TrendingUp } from "lucide-react"

import ResultsDisplay from "@/components/results-display"
import { useReactorParameters } from "@/hooks/use-reactor-parameters"
import { useSimulation } from "@/hooks/use-simulation"
import { ParametersForm } from "@/components/parameters-forms"

export default function BatchReactorSimulator() {
  // Usar los hooks personalizados
  const {
    operationType,
    isothermicMode,
    energyMode,
    reactionOrder,
    equilibriumMethod,
    volumeCalculate,
    rateConstantMode,
    parameters,
    setOperationType,
    setIsothermicMode,
    setEnergyMode,
    setReactionOrder,
    setEquilibriumMethod,
    setVolumeCalculate,
    setRateConstantMode,
    handleParameterChange,
    state,
  } = useReactorParameters()

  const { isLoading, showResults, simulationResults, sendFormToBackend } = useSimulation()

  // Manejar el envío del formulario
  const onSubmit = async () => {
    await sendFormToBackend(state)
  }

  return (
    <main className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-6 text-center">Simulador de Reactor Batch (TAC)</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <ParametersForm
            parameters={parameters}
            operationType={operationType}
            isothermicMode={isothermicMode}
            energyMode={energyMode}
            reactionOrder={reactionOrder}
            equilibriumMethod={equilibriumMethod}
            volumeCalculate={volumeCalculate}
            rateConstantMode={rateConstantMode}
            onParameterChange={handleParameterChange}
            onOperationTypeChange={setOperationType}
            onIsothermicModeChange={setIsothermicMode}
            onEnergyModeChange={setEnergyMode}
            onReactionOrderChange={setReactionOrder}
            onEquilibriumMethodChange={setEquilibriumMethod}
            onVolumeCalculateChange={setVolumeCalculate}
            onRateConstantModeChange={setRateConstantMode}
            onSubmit={onSubmit}
            isLoading={isLoading}
          />
        </div>

        <div className="lg:col-span-1">
          {showResults ? (
            <ResultsDisplay
              operationType={operationType}
              isothermicMode={isothermicMode}
              energyMode={energyMode}
              reactionOrder={reactionOrder}
              equilibriumMethod={equilibriumMethod}
              results={simulationResults}
            />
          ) : (
            <Card className="h-full flex items-center justify-center">
              <CardContent className="text-center p-6">
                <div className="rounded-full bg-gray-100 p-4 inline-flex items-center justify-center mb-4">
                  <TrendingUp className="h-8 w-8 text-gray-500" />
                </div>
                <h3 className="text-lg font-medium mb-2">Sin resultados</h3>
                <p className="text-gray-500">Configura los parametros y empezá la simulación.</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </main>
  )
}

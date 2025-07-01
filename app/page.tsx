"use client"

import { Card, CardContent } from "@/components/ui/card"
import { TrendingUp, AlertCircle } from "lucide-react"

import ResultsDisplay from "@/components/results-display"
import { useReactorParameters } from "@/hooks/use-reactor-parameters"
import { useSimulation } from "@/hooks/use-simulation"
import { ParametersForm } from "@/components/parameters-forms"
import { useValidation } from "@/hooks/use-validation"
import { useCallback, useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { EquilibriumWarningDialog } from "@/components/equilibirum.warning.dialog"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"


export default function BatchReactorSimulator() {

  const [showBackendError, setShowBackendError] = useState(false)
  const [usingMockData, setUsingMockData] = useState(false)
  const {
    operationType,
    isothermicMode,
    energyMode,
    reactionOrder,
    reactionType,
    equilibriumMethod,
    volumeCalculate,
    productK,
    unitMeasure,
    excessB,
    rateConstantMode,
    parameters,
    setOperationType,
    setIsothermicMode,
    setEnergyMode,
    setReactionOrder,
    setReactionType,
    setEquilibriumMethod,
    setProductK,
    setUnitMeasure,
    setExcessB,
    setVolumeCalculate,
    setRateConstantMode,
    handleParameterChange,
    state,
  } = useReactorParameters()

  const {
    isLoading,
    showResults,
    simulationResults,
    sendFormToBackend,
    useMockData,
    errorDetails,
    showEquilibriumWarning,
    setShowEquilibriumWarning,
    equilibriumData,
    tempConversion,
    setTempConversion,
    adjustConversionAndResubmit,
  } = useSimulation()

  const { errors, hasErrors, validateFields } = useValidation(
    parameters,
    operationType,
    isothermicMode,
    rateConstantMode,
    equilibriumMethod,
    energyMode,
    volumeCalculate,
  )

  useEffect(() => {
    validateFields()
  }, [])
  useEffect(() => {
    if (errorDetails) {
      setShowBackendError(true)
    } else {
        setShowBackendError(false)
    }
  }, [errorDetails])
  
  const onUseMockData = useCallback(() => {
    setUsingMockData(true)
      useMockData(state)
  }, [useMockData, state])

  const onSubmit = async () => {
    const currentErrors = validateFields()
    if (Object.keys(currentErrors).length === 0) {
      await sendFormToBackend(state)
    }
  }

 useEffect(() => {
  if (simulationResults) {
    console.log("Datos recibidos en el frontend:", simulationResults)
  }
}, [simulationResults])

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-6 text-center">Simulador de Reactor Batch (TAD)</h1>

      {equilibriumData && (
        <EquilibriumWarningDialog
          open={showEquilibriumWarning}
          onOpenChange={setShowEquilibriumWarning}
          targetConversion={equilibriumData.targetConversion}
          equilibriumConversion={equilibriumData.equilibriumConversion}
          tempConversion={tempConversion}
          onTempConversionChange={setTempConversion}
          onAdjust={adjustConversionAndResubmit}
          isLoading={isLoading}
        />
      )}

{showBackendError && (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error de conexión con el backend</AlertTitle>
          <AlertDescription>
            <p>No se pudo conectar con el servidor de backend. Detalles del error:</p>
            <p className="mt-2 font-mono text-xs bg-black/10 p-2 rounded">{errorDetails}</p>
            <div className="mt-4 flex gap-4">
              <Button variant="outline" size="sm" onClick={() => setShowBackendError(false)}>
                Cerrar
              </Button>
            </div>
          </AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 gap-8">
        <div>
          <ParametersForm
            parameters={parameters}
            operationType={operationType}
            isothermicMode={isothermicMode}
            energyMode={energyMode}
            reactionOrder={reactionOrder}
            reactionType={reactionType}
            equilibriumMethod={equilibriumMethod}
            volumeCalculate={volumeCalculate}
            productK={productK}
            unitMeasure={unitMeasure}
            excessB={excessB}
            rateConstantMode={rateConstantMode}
            onParameterChange={handleParameterChange}
            onReactionOrderChange={setReactionOrder}
            onReactionTypeChange={setReactionType}
            onProductKChange={setProductK}
            onUnitMeasureChange={setUnitMeasure}
            onExcessBChange={setExcessB}
            
            onOperationTypeChange={(value) => {
              setOperationType(value)
            }}
            
            onIsothermicModeChange={(value) => {
              setIsothermicMode(value)
            }}
            
            onEnergyModeChange={(value) => {
              setEnergyMode(value)
            }}
            
            onEquilibriumMethodChange={(value) => {
              setEquilibriumMethod(value)
            }}
            onRateConstantModeChange={(value) => {
              setRateConstantMode(value)
            }}
            onVolumeCalculateChange={(value) => {
              setVolumeCalculate(value)}}

            onSubmit={onSubmit}
            isLoading={isLoading}
            errors={errors}
            hasErrors={hasErrors}
          />
        </div>

        <div>
        {showResults && simulationResults ? (
            <ResultsDisplay
              operationType={operationType}
              isothermicMode={isothermicMode}
              energyMode={energyMode}
              reactionOrder={reactionOrder}
              reactionType={reactionType}
              equilibriumMethod={equilibriumMethod}
              results={simulationResults}
              unitMeasure={unitMeasure}
            />
          ) : (
            <Card className="flex items-center justify-center py-12">              <CardContent className="text-center p-6">
                <div className="rounded-full bg-gray-100 p-4 inline-flex items-center justify-center mb-4">
                  <TrendingUp className="h-8 w-8 text-gray-500" />
                </div>
                <h3 className="text-lg font-medium mb-2">No hay resultados</h3>
                <p className="text-gray-500">
                  Configure los parámetros y envíe el formulario al backend para ver los resultados de la simulación.
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}

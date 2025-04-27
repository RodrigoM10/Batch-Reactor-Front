"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle, Loader2, Send, ThermometerSun, TrendingUp } from "lucide-react"
import { StoichiometrySection } from "./sections/stoichiometry-section"
import { ReactionOrderSection } from "./sections/reaction-order-section"
import { IsothermicSection } from "./sections/isothermic-section"
import { NonIsothermicSection } from "./sections/non-isothermic-section"
import { EquilibriumSection } from "./sections/equilibrium-section"
import { CommonParametersSection } from "./sections/common-parameters-section"
import { ReactionEquation } from "./reaction-equation"
import type {
  EquilibriumMethod,
  VolumeCalculate,
  EnergyMode,
  IsothermicMode,
  OperationType,
  RateConstantMode,
  ReactionOrder,
  ReactorParameters,
} from "@/hooks/use-reactor-parameters"

interface ParametersFormProps {
  parameters: ReactorParameters
  operationType: OperationType
  isothermicMode: IsothermicMode
  energyMode: EnergyMode
  reactionOrder: ReactionOrder
  equilibriumMethod: EquilibriumMethod
  volumeCalculate: VolumeCalculate
  rateConstantMode: RateConstantMode
  onParameterChange: (param: keyof ReactorParameters, value: string) => void
  onOperationTypeChange: (value: OperationType) => void
  onIsothermicModeChange: (value: IsothermicMode) => void
  onEnergyModeChange: (value: EnergyMode) => void
  onReactionOrderChange: (value: ReactionOrder) => void
  onEquilibriumMethodChange: (value: EquilibriumMethod) => void
  onVolumeCalculateChange: (value: VolumeCalculate) => void
  onRateConstantModeChange: (value: RateConstantMode) => void
  onSubmit: () => void
  isLoading: boolean
}

export function ParametersForm({
  parameters,
  operationType,
  isothermicMode,
  energyMode,
  reactionOrder,
  equilibriumMethod,
  volumeCalculate,
  rateConstantMode,
  onParameterChange,
  onOperationTypeChange,
  onIsothermicModeChange,
  onEnergyModeChange,
  onReactionOrderChange,
  onEquilibriumMethodChange,
  onVolumeCalculateChange,
  onRateConstantModeChange,
  onSubmit,
  isLoading,
}: ParametersFormProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Parametros de la simulación</CardTitle>
        <CardDescription>Configura los parametros para tu simulacion del Reactor Batch.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Stoichiometry Section */}
          <StoichiometrySection parameters={parameters} onParameterChange={onParameterChange} />

          <ReactionEquation
            coefficientA={parameters.coefficientA}
            coefficientB={parameters.coefficientB}
            coefficientC={parameters.coefficientC}
            coefficientD={parameters.coefficientD}
          />

          <Separator />

          {/* Reaction Order Section */}
          <ReactionOrderSection reactionOrder={reactionOrder} onReactionOrderChange={onReactionOrderChange} />

          <Separator />

          {/* Operation Type Selection */}
          <div>
            <label className="text-base font-medium mb-2 block">Tipo de Operación</label>
            <Tabs
              defaultValue={operationType}
              onValueChange={(value) => onOperationTypeChange(value as OperationType)}
              className="w-full"
            >
              <TabsList className="grid grid-cols-2 mb-4">
                <TabsTrigger value="isothermic" className="flex items-center gap-2">
                  <ThermometerSun className="h-4 w-4" />
                  Isotermica
                </TabsTrigger>
                <TabsTrigger value="non-isothermic" className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4" />
                  No Isotermica
                </TabsTrigger>
              </TabsList>

              <TabsContent value="isothermic" className="space-y-6">
                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Operación Isotermica</AlertTitle>
                  <AlertDescription>La temperatura permanece constante durante la reacción.</AlertDescription>
                </Alert>

                <IsothermicSection
                  parameters={parameters}
                  isothermicMode={isothermicMode}
                  rateConstantMode={rateConstantMode}
                  onParameterChange={onParameterChange}
                  onIsothermicModeChange={onIsothermicModeChange}
                  onRateConstantModeChange={onRateConstantModeChange}
                />
              </TabsContent>

              <TabsContent value="non-isothermic" className="space-y-6">
                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Operación No Isotermica</AlertTitle>
                  <AlertDescription>La temeperatura varia durante la reacción.</AlertDescription>
                </Alert>

                <NonIsothermicSection
                  parameters={parameters}
                  energyMode={energyMode}
                  onParameterChange={onParameterChange}
                  onEnergyModeChange={onEnergyModeChange}
                />
              </TabsContent>
            </Tabs>
          </div>

          <Separator />

          {/* Equilibrium Conditions Section */}
          <div className="space-y-4">
            <h3 className="font-medium text-lg">Condiciones de Equilibrio</h3>
            <EquilibriumSection
              parameters={parameters}
              operationType={operationType}
              equilibriumMethod={equilibriumMethod}
              onParameterChange={onParameterChange}
              onEquilibriumMethodChange={onEquilibriumMethodChange}
            />
          </div>

          <Separator />

          {/* Common Parameters */}
          <CommonParametersSection
            parameters={parameters}
            operationType={operationType}
            onParameterChange={onParameterChange}
            volumeCalculate={volumeCalculate}
            onVolumeCalculateChange={onVolumeCalculateChange}
          />

          <div className="flex justify-end">
            <Button onClick={onSubmit} className="flex items-center gap-2" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Enviando datos...
                </>
              ) : (
                <>
                  <Send className="h-4 w-4" />
                  Enviar al Backend
                </>
              )}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

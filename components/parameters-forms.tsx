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
  ProductK,
  UnitMeasure,
  EnergyMode,
  IsothermicMode,
  OperationType,
  RateConstantMode,
  ReactionOrder,
  ReactionType,
  ReactorParameters,
  ExcessB,
} from "@/hooks/use-reactor-parameters"
import type { ValidationErrors } from "@/hooks/use-validation"

interface ParametersFormProps {
  parameters: ReactorParameters
  operationType: OperationType
  isothermicMode: IsothermicMode
  energyMode: EnergyMode
  reactionOrder: ReactionOrder
  reactionType: ReactionType
  equilibriumMethod: EquilibriumMethod
  volumeCalculate: VolumeCalculate
  productK: ProductK
  unitMeasure: UnitMeasure
  rateConstantMode: RateConstantMode
  excessB: ExcessB
  
  onParameterChange: (param: keyof ReactorParameters, value: string) => void
  onOperationTypeChange: (value: OperationType) => void
  onIsothermicModeChange: (value: IsothermicMode) => void
  onEnergyModeChange: (value: EnergyMode) => void
  onReactionOrderChange: (value: ReactionOrder) => void
  onReactionTypeChange: (value: ReactionType) => void
  onEquilibriumMethodChange: (value: EquilibriumMethod) => void
  onVolumeCalculateChange: (value: VolumeCalculate) => void
  onProductKChange: (value: ProductK) => void
  onUnitMeasureChange: (value: UnitMeasure) => void
  onRateConstantModeChange: (value: RateConstantMode) => void
  onExcessBChange: (value: ExcessB) => void
  onSubmit: () => void
  isLoading: boolean
  errors: ValidationErrors
  hasErrors: boolean
}

export function ParametersForm({
  parameters,
  operationType,
  isothermicMode,
  energyMode,
  reactionOrder,
  reactionType,
  equilibriumMethod,
  volumeCalculate,
  productK,
  unitMeasure,
  rateConstantMode,
  excessB,
  onParameterChange,
  onOperationTypeChange,
  onIsothermicModeChange,
  onEnergyModeChange,
  onReactionOrderChange,
  onReactionTypeChange,
  onEquilibriumMethodChange,
  onProductKChange,
  onUnitMeasureChange,
  onExcessBChange,
  onVolumeCalculateChange,
  onRateConstantModeChange,
  onSubmit,
  isLoading,
  errors,
  hasErrors,
}: ParametersFormProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Parametros de la simulación</CardTitle>
        <CardDescription>Configura los parametros para tu simulación del Reactor Batch.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <StoichiometrySection 
            parameters={parameters}
            reactionType={reactionType}
            onReactionTypeChange={onReactionTypeChange} 
            onParameterChange={onParameterChange} 
            errors={errors} />

          <ReactionEquation
            reactionType={reactionType}
            coefficientA={parameters.coefficientA}
            coefficientB={parameters.coefficientB}
            coefficientC={parameters.coefficientC}
            coefficientD={parameters.coefficientD}
          />

          <Separator />

          <ReactionOrderSection 
            reactionOrder={reactionOrder} 
            excessB={excessB}
            coefficientB={parameters.coefficientB}
            onExcessBChange={onExcessBChange}
            onReactionOrderChange={onReactionOrderChange} 
          />

          <Separator />
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
                  reactionOrder ={reactionOrder}
                  parameters={parameters}
                  isothermicMode={isothermicMode}
                  rateConstantMode={rateConstantMode}
                  unitMeasure={unitMeasure}
                  onParameterChange={onParameterChange}
                  onIsothermicModeChange={onIsothermicModeChange}
                  onRateConstantModeChange={onRateConstantModeChange}
                  onUnitMeasureChange={onUnitMeasureChange}
                  errors={errors}
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
                  reactionOrder ={reactionOrder}
                  energyMode={energyMode}
                  unitMeasure={unitMeasure}
                  onParameterChange={onParameterChange}
                  onEnergyModeChange={onEnergyModeChange}
                  onUnitMeasureChange={onUnitMeasureChange}
                  errors={errors}
                />
              </TabsContent>
            </Tabs>
          </div>

          <Separator />

          <div className="space-y-4">
            { reactionType ==="reversible" ? 
              <>
              <h3 className="font-medium text-lg">Condiciones de Equilibrio</h3>
                <EquilibriumSection
                  parameters={parameters}
                  operationType={operationType}
                  equilibriumMethod={equilibriumMethod}
                  onParameterChange={onParameterChange}
                  onEquilibriumMethodChange={onEquilibriumMethodChange}
                  errors={errors}
                />
              </> :
              <>
              </> 
            }
            
          </div>

          <Separator />

          <CommonParametersSection
            parameters={parameters}
            operationType={operationType}
            onParameterChange={onParameterChange}
            volumeCalculate={volumeCalculate}
            onVolumeCalculateChange={onVolumeCalculateChange}
            productK={productK}
            onProductKChange={onProductKChange}
            errors={errors}
          />

          {hasErrors && (
            <Alert variant="destructive" className="mt-4">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Errores de Validación</AlertTitle>
              <AlertDescription>Por favor corriga los parametros antes de correr el simulador.</AlertDescription>
            </Alert>
          )}

          <div className="flex justify-end">
          <Button onClick={onSubmit} className="flex items-center gap-2" disabled={isLoading || hasErrors}>
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Enviando datos...
                </>
              ) : (
                <>
                  <Send className="h-4 w-4" />
                  Simular Reactor Batch
                </>
              )}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

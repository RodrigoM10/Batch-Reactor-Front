"use client"

import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Info } from "lucide-react"
import { FormError } from "@/components/ui/form-error"
import type { IsothermicMode, RateConstantMode, ReactionOrder, ReactorParameters, UnitMeasure } from "@/hooks/use-reactor-parameters"
import { AlertDescription } from "../ui/alert"
import type { ValidationErrors } from "@/hooks/use-validation"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface IsothermicSectionProps {
  reactionOrder: ReactionOrder
  parameters: ReactorParameters
  isothermicMode: IsothermicMode
  rateConstantMode: RateConstantMode
  unitMeasure: UnitMeasure
  onParameterChange: (param: keyof ReactorParameters, value: string) => void
  onIsothermicModeChange: (value: IsothermicMode) => void
  onRateConstantModeChange: (value: RateConstantMode) => void
  onUnitMeasureChange: (value: UnitMeasure) => void
  errors: ValidationErrors
}

export function IsothermicSection({
  reactionOrder,
  parameters,
  isothermicMode,
  unitMeasure,
  rateConstantMode,
  onParameterChange,
  onIsothermicModeChange,
  onRateConstantModeChange,
  onUnitMeasureChange,
  errors,
}: IsothermicSectionProps) {
  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="temperature" className={errors.temperature ? "text-red-500" : ""}>
        Temperatura de Operacion: T [K]
        </Label>
        <Input
          id="temperature"
          value={parameters.temperature}
          onChange={(e) => onParameterChange("temperature", e.target.value)}
          className={errors.temperature ? "border-red-500" : ""}
        />
        <FormError message={errors.temperature} />
        <p className="text-xs text-gray-500 mt-1">
        La temperatura debe ser mayor a 0 y menor o igual a 3000 k
        </p>
      </div>

      {/* Sección para la constante de velocidad */}
      <div className="space-y-4 border-l-2 border-gray-200 pl-4 mt-4">
        <div className="flex items-center gap-2">
          <h4 className="font-medium">Constante de Velocidad: k </h4>
          <div className="relative group">
            <Info className="h-4 w-4 text-gray-400 cursor-help" />
            <div className="absolute left-0 bottom-full mb-2 hidden group-hover:block bg-white p-2 rounded shadow-lg text-xs w-64 z-10">
              La Constante de Velocidad de Reacción, puede ser ingresada directamtente o calculada a través de la Ecuacion de Arrhenius: k = A.exp(-E/RT)
            </div>
          </div>
        </div>

        <RadioGroup
          value={rateConstantMode}
          onValueChange={(value) => onRateConstantModeChange(value as RateConstantMode)}
          className="space-y-2"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="direct" id="rate-direct" />
            <Label htmlFor="rate-direct">Ingresar k directamente</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="arrhenius" id="rate-arrhenius" />
            <Label htmlFor="rate-arrhenius">Calcular k a través de Ecuacion de Arrhenius</Label><AlertDescription>( Constante R = 1.9872 [cal/mol.k] )</AlertDescription>
          </div>
        </RadioGroup>

        {rateConstantMode === "direct" ? (
          <div className="mt-2 ">
            <Label htmlFor="directRateConstant" className={errors.directRateConstant ? "text-red-500" : ""}>
              <div className="pb-3">
                Constante de Velocidad: k 
              </div>
                    <div className="mb-4">
                      <Select
                          value={unitMeasure}
                          onValueChange={(value) => onUnitMeasureChange(value as UnitMeasure)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Unidad de medida" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="min">{reactionOrder=== '1' ? "[1/min]" : "[l/mol.min]"}</SelectItem>
                            <SelectItem value="seg">{reactionOrder=== '1' ? "[1/s]" : "[l/mol.s]"}</SelectItem>
                          </SelectContent>
                        </Select>
                    </div>
            </Label>

            <Input
              id="directRateConstant"
              value={parameters.directRateConstant}
              onChange={(e) => onParameterChange("directRateConstant", e.target.value)}
              className={errors.directRateConstant ? "border-red-500" : ""}
            />
             <FormError message={errors.directRateConstant} />
             <p className="text-xs text-gray-500 mt-1">La Constante de Velocidad de Reacción debe ser mayor a 0.</p>
          </div>
        ) : (
          <div className="space-y-4 mt-2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 ">
              <div>
                <Label htmlFor="preExponentialFactor" className={errors.preExponentialFactor ? "text-red-500" : ""}>
                  <div>
                  Factor Pre-Exponencial: A
                  </div>
                  <div >
                      <Select
                          value={unitMeasure}
                          onValueChange={(value) => onUnitMeasureChange(value as UnitMeasure)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Unidad de medida" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="min">{reactionOrder=== '1' ? "[1/min]" : "[l/mol.min]"}</SelectItem>
                            <SelectItem value="seg">{reactionOrder=== '1' ? "[1/s]" : "[l/mol.s]"}</SelectItem>
                          </SelectContent>
                        </Select>
                    </div>

                </Label>
                <Input
                  id="preExponentialFactor"
                  value={parameters.preExponentialFactor}
                  onChange={(e) => onParameterChange("preExponentialFactor", e.target.value)}
                  className={errors.preExponentialFactor ? "border-red-500" : ""}
                />
                 <FormError message={errors.preExponentialFactor} />
                 <p className="text-xs text-gray-500 mt-1">El Factor Pre-Exponencial debe ser mayor a 0.</p>
              </div>
              <div className="pt-5">
                <Label htmlFor="activationEnergy" className={errors.activationEnergy ? "text-red-500" : ""}>
                Energía de Activación E [cal/mol]
                </Label>
                <Input
                  id="activationEnergy"
                  value={parameters.activationEnergy}
                  onChange={(e) => onParameterChange("activationEnergy", e.target.value)}
                  className={errors.activationEnergy ? "border-red-500" : ""}
                />
                <FormError message={errors.activationEnergy} />
                <p className="text-xs text-gray-500 mt-1">Debe ser mayor a 0.</p>
              </div>
            </div>
          </div>
        )}
      </div>

      <div>
        <Label>Modo de Cálculo</Label>
        <div className="my-2">
        <AlertDescription >La simulación permite calcular el tiempo de reacción a través de la conversión deseada o calcular la conversión alcanzada en un tiempo de operación determinado.</AlertDescription>
        </div> 
        <div className="flex items-center space-x-4 mt-2">
          <div className="flex items-center space-x-2">
            <Switch
              id="calc-mode"
              checked={isothermicMode === "x"}
              onCheckedChange={(checked) => onIsothermicModeChange(checked ? "x" : "t")}
            />
            <Label htmlFor="calc-mode" className="cursor-pointer">
              {isothermicMode === "x" ? "Basado en la Conversión: X" : "Basado en el Tiempo de Reacción: Tr"}
            </Label>
          </div>
        </div>
      </div>

      {isothermicMode === "x" ? (
        <div>
          <Label htmlFor="targetConversion" className={errors.targetConversion ? "text-red-500" : ""}>
            Conversión Deseada: X [0-1]
          </Label>
          <Input
            id="targetConversion"
            value={parameters.targetConversion}
            onChange={(e) => onParameterChange("targetConversion", e.target.value)}
            className={errors.targetConversion ? "border-red-500" : ""}
          />
          <FormError message={errors.targetConversion} />
          <p className="text-xs text-gray-500 mt-1">Debe ser mayor a 0 y menor o igual a 1</p>
        </div>
      ) : (
        <div>
          <Label htmlFor="reactionTime" className={errors.reactionTime ? "text-red-500" : ""}>
          Tiempo de Reacción: Tr [{unitMeasure}]
          </Label>
          <Input
            id="reactionTime"
            value={parameters.reactionTime}
            onChange={(e) => onParameterChange("reactionTime", e.target.value)}
            className={errors.reactionTime ? "border-red-500" : ""}
          />
          <FormError message={errors.reactionTime} />
          <p className="text-xs text-gray-500 mt-1">Debe ser mayor a 0.</p>
        </div>
      )}
    </div>
  )
}

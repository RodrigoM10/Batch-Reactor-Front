"use client"

import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Info } from "lucide-react"
import type { IsothermicMode, RateConstantMode, ReactorParameters } from "@/hooks/use-reactor-parameters"
import { AlertDescription } from "../ui/alert"

interface IsothermicSectionProps {
  parameters: ReactorParameters
  isothermicMode: IsothermicMode
  rateConstantMode: RateConstantMode
  onParameterChange: (param: keyof ReactorParameters, value: string) => void
  onIsothermicModeChange: (value: IsothermicMode) => void
  onRateConstantModeChange: (value: RateConstantMode) => void
}

export function IsothermicSection({
  parameters,
  isothermicMode,
  rateConstantMode,
  onParameterChange,
  onIsothermicModeChange,
  onRateConstantModeChange,
}: IsothermicSectionProps) {
  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="temperature"> Temperatura de Operacion: T [K]</Label>
        <Input
          id="temperature"
          value={parameters.temperature}
          onChange={(e) => onParameterChange("temperature", e.target.value)}
        />
      </div>

      {/* Sección para la constante de velocidad */}
      <div className="space-y-4 border-l-2 border-gray-200 pl-4 mt-4">
        <div className="flex items-center gap-2">
          <h4 className="font-medium">Constante de Velocidad: k [1/s]</h4>
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
          <div className="mt-2">
            <Label htmlFor="directRateConstant">Constante de Velocidad: k [1/s]</Label>
            <Input
              id="directRateConstant"
              value={parameters.directRateConstant}
              onChange={(e) => onParameterChange("directRateConstant", e.target.value)}
            />
          </div>
        ) : (
          <div className="space-y-4 mt-2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="preExponentialFactor">Factor Pre-Exponencial: A</Label>
                <Input
                  id="preExponentialFactor"
                  value={parameters.preExponentialFactor}
                  onChange={(e) => onParameterChange("preExponentialFactor", e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="activationEnergy">Energía de Activación E [cal/mol]</Label>
                <Input
                  id="activationEnergy"
                  value={parameters.activationEnergy}
                  onChange={(e) => onParameterChange("activationEnergy", e.target.value)}
                />
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
          <Label htmlFor="targetConversion">Conversión Deseada: X [0-1]</Label>
          <Input
            id="targetConversion"
            value={parameters.targetConversion}
            onChange={(e) => onParameterChange("targetConversion", e.target.value)}
          />
        </div>
      ) : (
        <div>
          <Label htmlFor="reactionTime">Tiempo de Reacción: Tr [s]</Label>
          <Input
            id="reactionTime"
            value={parameters.reactionTime}
            onChange={(e) => onParameterChange("reactionTime", e.target.value)}
          />
        </div>
      )}
    </div>
  )
}

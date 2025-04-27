"use client"

import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { ReactorParameters } from "@/hooks/use-reactor-parameters"


interface StoichiometrySectionProps {
  parameters: ReactorParameters
  onParameterChange: (param: keyof ReactorParameters, value: string) => void
}

export function StoichiometrySection({ parameters, onParameterChange }: StoichiometrySectionProps) {
  return (
    <div className="space-y-4">
      <h3 className="font-medium text-lg">Estequiometría de la reacción</h3>
      <div className="bg-gray-50 p-4 rounded-md mb-4">
        <p className="text-sm text-gray-600">
          Ingresa los coeficientes estequiometricos para una reaccion irreversible:  A + B → C + D.
          <br />
          Usa valores negativos para reactivos y positivos para los productos.
          <br />
          Ejemplo: Para A + 2B → 3C, ingresá A: -1, B: -2, C: 3, D: 0
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div>
          <Label htmlFor="coefficientA">Componente A</Label>
          <Input
            id="coefficientA"
            value={parameters.coefficientA}
            onChange={(e) => onParameterChange("coefficientA", e.target.value)}
            placeholder="-1"
          />
        </div>
        <div>
          <Label htmlFor="coefficientB">Componente B</Label>
          <Input
            id="coefficientB"
            value={parameters.coefficientB}
            onChange={(e) => onParameterChange("coefficientB", e.target.value)}
            placeholder="-2"
          />
        </div>
        <div>
          <Label htmlFor="coefficientC">Componente C</Label>
          <Input
            id="coefficientC"
            value={parameters.coefficientC}
            onChange={(e) => onParameterChange("coefficientC", e.target.value)}
            placeholder="3"
          />
        </div>
        <div>
          <Label htmlFor="coefficientD">Componente D</Label>
          <Input
            id="coefficientD"
            value={parameters.coefficientD}
            onChange={(e) => onParameterChange("coefficientD", e.target.value)}
            placeholder="0"
          />
        </div>
      </div>
    </div>
  )
}

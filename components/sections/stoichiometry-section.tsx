"use client"

import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { FormError } from "@/components/ui/form-error"
import { ReactionType, ReactorParameters } from "@/hooks/use-reactor-parameters"
import type { ValidationErrors } from "@/hooks/use-validation"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

interface StoichiometrySectionProps {
  parameters: ReactorParameters
  reactionType: ReactionType
  onParameterChange: (param: keyof ReactorParameters, value: string) => void
  onReactionTypeChange: (value: ReactionType) => void
  errors: ValidationErrors
}

export function StoichiometrySection({
  parameters,
  reactionType,
  onParameterChange,
  onReactionTypeChange, // Recibe la nueva prop
  errors,
}: StoichiometrySectionProps) {
  return (
    <div className="space-y-4">
      <h3 className="font-medium text-lg">Estequiometría de la reacción</h3>

      {/* Selector de tipo de reacción */}
      <div className="flex items-center space-x-4 mb-4">
          <h4 className="font-medium text-lg">Tipo de Reacción</h4>


      <RadioGroup
        value={reactionType}
        onValueChange={(value) => onReactionTypeChange(value as ReactionType)}
        className="flex space-x-8"
      >
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="reversible" id="rever" />
          <Label htmlFor="rever">Reversible</Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="irreversible" id="irrever" />
          <Label htmlFor="irrever">Irreversible</Label>
        </div>
      </RadioGroup>
      </div>

      <div className="bg-gray-50 p-4 rounded-md mb-4">
        <p className="text-sm text-gray-600">
          Ingresa los coeficientes estequiométricos para una reacción{" "}
          <span className="font-bold">
            {reactionType === "reversible" ? 
            "reversible : A + B ⇌ C + D."  
            : 
            "irreversible : A + B → C + D."}
          </span>
          <br />
          Usa valores negativos para reactivos y positivos para los productos.
          <br />
          Ejemplo: Para A + 2B → 3C, ingresá A: -1, B: -2, C: 3, D: 0
          <br />
          <span className="font-medium text-amber-600">
            Los valores deben estar entre -10 y 10.
          </span>
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div>
          <Label
            htmlFor="coefficientA"
            className={errors.coefficientA ? "text-red-500" : ""}
          >
            Componente A
          </Label>
          <Input
            id="coefficientA"
            value={parameters.coefficientA}
            onChange={(e) => onParameterChange("coefficientA", e.target.value)}
            placeholder="-1"
            className={errors.coefficientA ? "border-red-500" : ""}
          />
          <FormError message={errors.coefficientA} />
        </div>
        <div>
          <Label
            htmlFor="coefficientB"
            className={errors.coefficientB ? "text-red-500" : ""}
          >
            Componente B
          </Label>
          <Input
            id="coefficientB"
            value={parameters.coefficientB}
            onChange={(e) => onParameterChange("coefficientB", e.target.value)}
            placeholder="-2"
            className={errors.coefficientB ? "border-red-500" : ""}
          />
          <FormError message={errors.coefficientB} />
        </div>
        <div>
          <Label
            htmlFor="coefficientC"
            className={errors.coefficientC ? "text-red-500" : ""}
          >
            Componente C
          </Label>
          <Input
            id="coefficientC"
            value={parameters.coefficientC}
            onChange={(e) => onParameterChange("coefficientC", e.target.value)}
            placeholder="3"
            className={errors.coefficientC ? "border-red-500" : ""}
          />
          <FormError message={errors.coefficientC} />
        </div>
        <div>
          <Label
            htmlFor="coefficientD"
            className={errors.coefficientD ? "text-red-500" : ""}
          >
            Componente D
          </Label>
          <Input
            id="coefficientD"
            value={parameters.coefficientD}
            onChange={(e) => onParameterChange("coefficientD", e.target.value)}
            placeholder="0"
            className={errors.coefficientD ? "border-red-500" : ""}
          />
          <FormError message={errors.coefficientD} />
        </div>
      </div>
    </div>
  )
}
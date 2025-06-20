"use client"

import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Info } from "lucide-react"
import { FormError } from "@/components/ui/form-error"
import { EquilibriumMethod, OperationType, ReactorParameters } from "@/hooks/use-reactor-parameters"
import { ValidationErrors } from "@/hooks/use-validation"


interface EquilibriumSectionProps {
  parameters: ReactorParameters
  operationType: OperationType
  equilibriumMethod: EquilibriumMethod
  onParameterChange: (param: keyof ReactorParameters, value: string) => void
  onEquilibriumMethodChange: (value: EquilibriumMethod) => void
  errors: ValidationErrors
}

export function EquilibriumSection({
  parameters,
  operationType,
  equilibriumMethod,
  onParameterChange,
  onEquilibriumMethodChange,
  errors,
}: EquilibriumSectionProps) {
  return (
    <div className="space-y-4">
      <div className="bg-gray-50 p-4 rounded-md mb-4">
        <p className="text-sm text-gray-600">
          Seleccionar el metodo para definir las condiciones de equilibrio de la reaccion.
          {operationType === "non-isothermic" && (
            <>
              <br />
              Para el funcionamiento no isotérmico, la constante de equilibrio se ajustará en función del perfil de temperatura.
            </>
          )}
        </p>
      </div>

      <div className="space-y-4">
        <Select
          value={equilibriumMethod}
          onValueChange={(value) => onEquilibriumMethodChange(value as EquilibriumMethod)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select equilibrium method" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="vanthoff">Ecuación de Van't Hoff</SelectItem>
            <SelectItem value="gibbs">Energía de Gibbs</SelectItem>
            {operationType === "isothermic" && <SelectItem value="direct">Ingresar Manualmente Keq</SelectItem>}
          </SelectContent>
        </Select>

        {equilibriumMethod === "vanthoff" && (
          <div className="space-y-4 border-l-2 border-gray-200 pl-4 mt-4">
            <div className="flex items-center gap-2 mb-2">
              <h4 className="font-medium">Parametros de ecuación de Van't Hoff</h4>
              <div className="relative group">
                <Info className="h-4 w-4 text-gray-400 cursor-help" />
                <div className="absolute left-0 bottom-full mb-2 hidden group-hover:block bg-white p-2 rounded shadow-lg text-xs w-64 z-10">
                  La ecuación de Van’t Hoff relaciona la constante de equilibrio a diferentes temperaturas : ln(Ke/KeRef) =
                  (-ΔH/R)*(1/T - 1/Tref)
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="keRef"  className={errors.keRef ? "text-red-500" : ""}  >
                  Constante de Equilibrio a la Temp. de Referencia. (Ke Ref)
                </Label>
                <Input
                  id="keRef"
                  value={parameters.keRef}
                  onChange={(e) => onParameterChange("keRef", e.target.value)}
                  className={errors.keRef ? "border-red-500" : ""}
                />
                <FormError message={errors.keRef} />
                <p className="text-xs text-gray-500 mt-1">
                El valor debe ser mayor a 0 
                </p>
              </div>
              <div>
                <Label htmlFor="tRef" className={errors.tRef ? "text-red-500" : ""}>
                Temperatura de Referencia: Tref [K]
                </Label>
                <Input
                  id="tRef"
                  value={parameters.tRef}
                  onChange={(e) => onParameterChange("tRef", e.target.value)}
                  className={errors.tRef ? "border-red-500" : ""}
                />
                <FormError message={errors.tRef} />
                <p className="text-xs text-gray-500 mt-1">
                La temperatura debe ser mayor a 0 y menor o igual a 3000 k
                </p>
              </div>
              <div>
                <Label htmlFor="deltaHrxn" className={errors.deltaHrxn ? "text-red-500" : ""}>
                Calor de Reacción [cal/mol]
                </Label>
                <Input
                  id="deltaHrxn"
                  value={parameters.deltaHrxn}
                  onChange={(e) => onParameterChange("deltaHrxn", e.target.value)}
                  className={errors.deltaHrxn ? "border-red-500" : ""}
                />
                <FormError message={errors.deltaHrxn} />
              </div>
            </div>
          </div>
        )}

        {equilibriumMethod === "gibbs" && (
          <div className="space-y-4 border-l-2 border-gray-200 pl-4 mt-4">
            <div className="flex items-center gap-2 mb-2">
              <h4 className="font-medium">Parametros de Energia de Gibbs [cal/mol] </h4>
              <div className="relative group">
                <Info className="h-4 w-4 text-gray-400 cursor-help" />
                <div className="absolute left-0 bottom-full mb-2 hidden group-hover:block bg-white p-2 rounded shadow-lg text-xs w-64 z-10">
                La constante de equilibrio se calcula a partir de las energías de Gibbs: ΔG = -RT·ln(Ke) = Σ(νi·Gi)
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="gibbsEnergyA" className={errors.gibbsEnergyA ? "text-red-500" : ""}>
                Energia de Gibbs de A 
                </Label>
                <Input
                  id="gibbsEnergyA"
                  value={parameters.gibbsEnergyA}
                  onChange={(e) => onParameterChange("gibbsEnergyA", e.target.value)}
                  className={errors.gibbsEnergyA ? "border-red-500" : ""}
                />
                <FormError message={errors.gibbsEnergyA} />
              </div>
              <div>
                <Label htmlFor="gibbsEnergyB" className={errors.gibbsEnergyB ? "text-red-500" : ""}>
                Energia de Gibbs de B
                </Label>
                <Input
                  id="gibbsEnergyB"
                  value={parameters.gibbsEnergyB}
                  onChange={(e) => onParameterChange("gibbsEnergyB", e.target.value)}
                  className={errors.gibbsEnergyB ? "border-red-500" : ""}
                />
                <FormError message={errors.gibbsEnergyB} />
              </div>
              <div>
                <Label htmlFor="gibbsEnergyC" className={errors.gibbsEnergyC ? "text-red-500" : ""}>
                Energia de Gibbs de C
                </Label>
                <Input
                  id="gibbsEnergyC"
                  value={parameters.gibbsEnergyC}
                  onChange={(e) => onParameterChange("gibbsEnergyC", e.target.value)}
                  className={errors.gibbsEnergyC ? "border-red-500" : ""}
                />
                <FormError message={errors.gibbsEnergyC} />
              </div>
              <div>
                <Label htmlFor="gibbsEnergyD" className={errors.gibbsEnergyD ? "text-red-500" : ""}>
                Energia de Gibbs de D
                </Label>
                <Input
                  id="gibbsEnergyD"
                  value={parameters.gibbsEnergyD}
                  onChange={(e) => onParameterChange("gibbsEnergyD", e.target.value)}
                  className={errors.gibbsEnergyD ? "border-red-500" : ""}
                />
                <FormError message={errors.gibbsEnergyD} />
              </div>
            </div>
          </div>
        )}

        {equilibriumMethod === "direct" && operationType === "isothermic" && (
          <div className="space-y-4 border-l-2 border-gray-200 pl-4 mt-4">
            <h4 className="font-medium">Ingresar directamente la Constante de Equilibrio Ke</h4>

            <div>
              <Label htmlFor="ke" className={errors.ke ? "text-red-500" : ""}>
              Constante de Equilibrio (Ke)
                </Label>
                <Input
                  id="ke"
                  value={parameters.ke}
                  onChange={(e) => onParameterChange("ke", e.target.value)}
                  className={errors.ke ? "border-red-500" : ""}
                />
                <FormError message={errors.ke} />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

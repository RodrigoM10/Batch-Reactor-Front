"use client"

import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Info } from "lucide-react"
import { EquilibriumMethod, OperationType, ReactorParameters } from "@/hooks/use-reactor-parameters"


interface EquilibriumSectionProps {
  parameters: ReactorParameters
  operationType: OperationType
  equilibriumMethod: EquilibriumMethod
  onParameterChange: (param: keyof ReactorParameters, value: string) => void
  onEquilibriumMethodChange: (value: EquilibriumMethod) => void
}

export function EquilibriumSection({
  parameters,
  operationType,
  equilibriumMethod,
  onParameterChange,
  onEquilibriumMethodChange,
}: EquilibriumSectionProps) {
  return (
    <div className="space-y-4">
      <div className="bg-gray-50 p-4 rounded-md mb-4">
        <p className="text-sm text-gray-600">
          Seleccionar el metodo para definir las condiciones de equilibrio de la reaccion.
          {operationType === "non-isothermic" && (
            <>
              <br />
              For non-isothermic operation, the equilibrium constant will be adjusted based on the temperature profile.
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
            <SelectItem value="vanthoff">Van't Hoff Equation</SelectItem>
            <SelectItem value="gibbs">Gibbs Energy</SelectItem>
            {operationType === "isothermic" && <SelectItem value="direct">Direct Ke Input</SelectItem>}
          </SelectContent>
        </Select>

        {equilibriumMethod === "vanthoff" && (
          <div className="space-y-4 border-l-2 border-gray-200 pl-4 mt-4">
            <div className="flex items-center gap-2 mb-2">
              <h4 className="font-medium">Van't Hoff Equation Parameters</h4>
              <div className="relative group">
                <Info className="h-4 w-4 text-gray-400 cursor-help" />
                <div className="absolute left-0 bottom-full mb-2 hidden group-hover:block bg-white p-2 rounded shadow-lg text-xs w-64 z-10">
                  The Van't Hoff equation relates the equilibrium constant at different temperatures: ln(Ke/KeRef) =
                  (-ΔH/R)*(1/T - 1/Tref)
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="keRef">Equilibrium Constant at Ref. Temp. (Ke Ref)</Label>
                <Input
                  id="keRef"
                  value={parameters.keRef}
                  onChange={(e) => onParameterChange("keRef", e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="tRef">Reference Temperature (K)</Label>
                <Input id="tRef" value={parameters.tRef} onChange={(e) => onParameterChange("tRef", e.target.value)} />
              </div>
              <div>
                <Label htmlFor="deltaHrxn">Heat of Reaction (J/mol)</Label>
                <Input
                  id="deltaHrxn"
                  value={parameters.deltaHrxn}
                  onChange={(e) => onParameterChange("deltaHrxn", e.target.value)}
                />
              </div>
            </div>
          </div>
        )}

        {equilibriumMethod === "gibbs" && (
          <div className="space-y-4 border-l-2 border-gray-200 pl-4 mt-4">
            <div className="flex items-center gap-2 mb-2">
              <h4 className="font-medium">Gibbs Energy Parameters</h4>
              <div className="relative group">
                <Info className="h-4 w-4 text-gray-400 cursor-help" />
                <div className="absolute left-0 bottom-full mb-2 hidden group-hover:block bg-white p-2 rounded shadow-lg text-xs w-64 z-10">
                  The equilibrium constant is calculated from Gibbs energies: ΔG = -RT·ln(Ke) = Σ(νi·Gi)
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="gibbsEnergyA">Gibbs Energy of A (J/mol)</Label>
                <Input
                  id="gibbsEnergyA"
                  value={parameters.gibbsEnergyA}
                  onChange={(e) => onParameterChange("gibbsEnergyA", e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="gibbsEnergyB">Gibbs Energy of B (J/mol)</Label>
                <Input
                  id="gibbsEnergyB"
                  value={parameters.gibbsEnergyB}
                  onChange={(e) => onParameterChange("gibbsEnergyB", e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="gibbsEnergyC">Gibbs Energy of C (J/mol)</Label>
                <Input
                  id="gibbsEnergyC"
                  value={parameters.gibbsEnergyC}
                  onChange={(e) => onParameterChange("gibbsEnergyC", e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="gibbsEnergyD">Gibbs Energy of D (J/mol)</Label>
                <Input
                  id="gibbsEnergyD"
                  value={parameters.gibbsEnergyD}
                  onChange={(e) => onParameterChange("gibbsEnergyD", e.target.value)}
                />
              </div>
            </div>
          </div>
        )}

        {equilibriumMethod === "direct" && operationType === "isothermic" && (
          <div className="space-y-4 border-l-2 border-gray-200 pl-4 mt-4">
            <h4 className="font-medium">Direct Equilibrium Constant Input</h4>

            <div>
              <Label htmlFor="ke">Equilibrium Constant (Ke)</Label>
              <Input id="ke" value={parameters.ke} onChange={(e) => onParameterChange("ke", e.target.value)} />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

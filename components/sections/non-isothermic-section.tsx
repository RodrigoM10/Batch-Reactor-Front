"use client"

import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { FormError } from "@/components/ui/form-error"
import { EnergyMode, ReactorParameters } from "@/hooks/use-reactor-parameters"
import { Info } from "lucide-react"
import type { ValidationErrors } from "@/hooks/use-validation"

interface NonIsothermicSectionProps {
  parameters: ReactorParameters
  energyMode: EnergyMode
  onParameterChange: (param: keyof ReactorParameters, value: string) => void
  onEnergyModeChange: (value: EnergyMode) => void
  errors: ValidationErrors
}

export function NonIsothermicSection({
  parameters,
  energyMode,
  onParameterChange,
  onEnergyModeChange,
  errors,
}: NonIsothermicSectionProps) {
  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="initialTemperature" className={errors.initialTemperature ? "text-red-500" : ""}>
        Temperatura Inicial: T0 [k]
        </Label>
        <Input
          id="initialTemperature"
          value={parameters.initialTemperature}
          onChange={(e) => onParameterChange("initialTemperature", e.target.value)}
          className={errors.initialTemperature ? "border-red-500" : ""}
        />
        <FormError message={errors.initialTemperature} />
        <p className="text-xs text-gray-500 mt-1">
          La temperatura debe ser mayor a 0 y menor o igual a 3000 k
        </p>
      </div>

      <div>
        <div className="flex items-center gap-2 mb-2">
              <h4 className="font-medium">Capacidades Calorificas de los Componentes: Cp[cal/mol.k] :</h4>
              <div className="relative group">
                <Info className="h-4 w-4 text-gray-400 cursor-help" />
                <div className="absolute left-0 bottom-full mb-2 hidden group-hover:block bg-white p-2 rounded shadow-lg text-xs w-64 z-10">
                  Se calcula la Capacidad Calorifica Total de la solución con: Cps = Σ(νi·Cpi)
                </div>
              </div>
            </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="heatCapacityA" className={errors.heatCapacityA ? "text-red-500" : ""}>
                Capacidad Calorifica de A : CpA
                </Label>
                <Input
                    id="heatCapacityA"
                    value={parameters.heatCapacityA}
                    onChange={(e) => onParameterChange("heatCapacityA", e.target.value)}
                    className={errors.heatCapacityA ? "border-red-500" : ""}
                />
                <FormError message={errors.heatCapacityA} />          
              </div>
              <div>
                <Label htmlFor="heatCapacityB" className={errors.heatCapacityB ? "text-red-500" : ""}>
                Capacidad Calorifica de B : CpB
                </Label>
                <Input
                    id="heatCapacityB"
                    value={parameters.heatCapacityB}
                    onChange={(e) => onParameterChange("heatCapacityB", e.target.value)}
                    className={errors.heatCapacityB ? "border-red-500" : ""}
                />
                <FormError message={errors.heatCapacityB} />
              </div>
              <div> 
                <Label htmlFor="heatCapacityC" className={errors.heatCapacityC ? "text-red-500" : ""}>
                Capacidad Calorifica de C : CpC
                </Label>
                <Input
                    id="heatCapacityC"
                    value={parameters.heatCapacityC}
                    onChange={(e) => onParameterChange("heatCapacityC", e.target.value)}
                    className={errors.heatCapacityC ? "border-red-500" : ""}
                />
                <FormError message={errors.heatCapacityC} />
              </div>
              <div>
                <Label htmlFor="heatCapacityD" className={errors.heatCapacityD ? "text-red-500" : ""}>
                Capacidad Calorifica de D : CpD
                </Label>
                <Input
                    id="heatCapacityD"
                    value={parameters.heatCapacityD}
                    onChange={(e) => onParameterChange("heatCapacityD", e.target.value)}
                    className={errors.heatCapacityD ? "border-red-500" : ""}
                />
                <FormError message={errors.heatCapacityD} />
              </div>
              <div>
                <Label htmlFor="heatCapacityI" className={errors.heatCapacityI ? "text-red-500" : ""}>
                Capacidad Calorifica de I : CpI
                </Label>
                <Input
                    id="heatCapacityI"
                    value={parameters.heatCapacityI}
                    onChange={(e) => onParameterChange("heatCapacityI", e.target.value)}
                    className={errors.heatCapacityI ? "border-red-500" : ""}
                />
                <FormError message={errors.heatCapacityI} />
              </div>
            </div>
      </div>

      <div>
               <Label htmlFor="activationEnergyT" className={errors.activationEnergyT ? "text-red-500" : ""}>
               Energía de Activación: E[cal/mol]
                </Label>
                <Input
                    id="activationEnergyT"
                    value={parameters.activationEnergyT}
                    onChange={(e) => onParameterChange("activationEnergyT", e.target.value)}
                    className={errors.activationEnergyT ? "border-red-500" : ""}
                />
                <FormError message={errors.activationEnergyT} />
      </div>
      <div>
              <Label htmlFor="preExponentialFactorT" className={errors.preExponentialFactorT ? "text-red-500" : ""}>
              Factor Pre-Exponencial: A
                </Label>
                <Input
                    id="preExponentialFactorT"
                    value={parameters.preExponentialFactorT}
                    onChange={(e) => onParameterChange("preExponentialFactorT", e.target.value)}
                    className={errors.preExponentialFactorT ? "border-red-500" : ""}
                />
                <FormError message={errors.preExponentialFactorT} />
      </div>

      <div>
        <Label htmlFor="reactionEnthalpy" className={errors.reactionEnthalpy ? "text-red-500" : ""}>
        Diferencia de Entalpia Estándar de la Reacción:  [cal/mol]
                </Label>
                <Input
                    id="reactionEnthalpy"
                    value={parameters.reactionEnthalpy}
                    onChange={(e) => onParameterChange("reactionEnthalpy", e.target.value)}
                    className={errors.reactionEnthalpy ? "border-red-500" : ""}
                />
                <FormError message={errors.reactionEnthalpy} />
      </div>

      <div>
        <Label>Tipo de Reactor</Label>
        <Select value={energyMode} onValueChange={(value) => onEnergyModeChange(value as EnergyMode)}>
          <SelectTrigger className="mt-1">
            <SelectValue placeholder="Select energy mode" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="adiabatic">Adiabático</SelectItem>
            <SelectItem value="icq">Intercambiador de Calor (ICQ)</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {energyMode === "icq" && (
        <div className="space-y-4 border-l-2 border-gray-200 pl-4 mt-4">
          <h3 className="font-medium">Parametros del ICQ</h3>

          <div>
              <Label htmlFor="coolingFluidTemperature" className={errors.coolingFluidTemperature ? "text-red-500" : ""}>
               Temperatura del refrigerante: Tcool[K]
              </Label>
              <Input
                 id="coolingFluidTemperature"
                 value={parameters.coolingFluidTemperature}
                 onChange={(e) => onParameterChange("coolingFluidTemperature", e.target.value)}
                 className={errors.coolingFluidTemperature ? "border-red-500" : ""}
              />
              <FormError message={errors.coolingFluidTemperature} />
          </div>

          <div>
            <Label htmlFor="heatTransferCoefficient" className={errors.heatTransferCoefficient ? "text-red-500" : ""}>
            Coeficiente de Transferencia de Calor: U[W/m²·K]
              </Label>
              <Input
                 id="heatTransferCoefficient"
                 value={parameters.heatTransferCoefficient}
                 onChange={(e) => onParameterChange("heatTransferCoefficient", e.target.value)}
                 className={errors.heatTransferCoefficient ? "border-red-500" : ""}
              />
              <FormError message={errors.heatTransferCoefficient} />
          </div>

          <div>
            <Label htmlFor="heatExchangeArea" className={errors.heatExchangeArea ? "text-red-500" : ""}>
              Área del ICQ: A_ICQ[m²]
              </Label>
              <Input
                 id="heatExchangeArea"
                 value={parameters.heatExchangeArea}
                 onChange={(e) => onParameterChange("heatExchangeArea", e.target.value)}
                 className={errors.heatExchangeArea ? "border-red-500" : ""}
              />
              <FormError message={errors.heatExchangeArea} />
          </div>

          <div>
            <Label htmlFor="heatCapacityRef" className={errors.heatCapacityRef ? "text-red-500" : ""}>
              Capacidad Calorifica del Refrigerante: Cp_ref[cal/mol.k]
              </Label>
              <Input
                 id="heatCapacityRef"
                 value={parameters.heatCapacityRef}
                 onChange={(e) => onParameterChange("heatCapacityRef", e.target.value)}
                 className={errors.heatCapacityRef ? "border-red-500" : ""}
              />
              <FormError message={errors.heatCapacityRef} />
          </div>

          <div>
              <Label htmlFor="fluidRateRef" className={errors.fluidRateRef ? "text-red-500" : ""}>
              Velocidad Masica del Refrigerante: m_c[mol/s]
              </Label>
              <Input
                 id="fluidRateRef"
                 value={parameters.fluidRateRef}
                 onChange={(e) => onParameterChange("fluidRateRef", e.target.value)}
                 className={errors.fluidRateRef ? "border-red-500" : ""}
              />
              <FormError message={errors.fluidRateRef} />
          </div>
        </div>
      )}
    </div>
  )
}

"use client"

import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { EnergyMode, ReactorParameters } from "@/hooks/use-reactor-parameters"
import { Info } from "lucide-react"


interface NonIsothermicSectionProps {
  parameters: ReactorParameters
  energyMode: EnergyMode
  onParameterChange: (param: keyof ReactorParameters, value: string) => void
  onEnergyModeChange: (value: EnergyMode) => void
}

export function NonIsothermicSection({
  parameters,
  energyMode,
  onParameterChange,
  onEnergyModeChange,
}: NonIsothermicSectionProps) {
  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="initialTemperature">Temperatura Inicial: T0 [k]</Label>
        <Input
          id="initialTemperature"
          value={parameters.initialTemperature}
          onChange={(e) => onParameterChange("initialTemperature", e.target.value)}
        />
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
                <Label htmlFor="heatCapacityA">Capacidad Calorifica de A : CpA</Label>
                <Input
                  id="heatCapacityA"
                  value={parameters.heatCapacityA}
                  onChange={(e) => onParameterChange("heatCapacityA", e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="heatCapacityB">Capacidad Calorifica de B : CpB</Label>
                <Input
                  id="heatCapacityB"
                  value={parameters.heatCapacityB}
                  onChange={(e) => onParameterChange("heatCapacityB", e.target.value)}
                />
              </div>
              <div> 
                <Label htmlFor="heatCapacityC">Capacidad Calorifica de C : CpC</Label>
                <Input
                  id="heatCapacityC"
                  value={parameters.heatCapacityC}
                  onChange={(e) => onParameterChange("heatCapacityC", e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="heatCapacityD">Capacidad Calorifica de D : CpD</Label>
                <Input
                  id="heatCapacityD"
                  value={parameters.heatCapacityD}
                  onChange={(e) => onParameterChange("heatCapacityD", e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="heatCapacityI">Capacidad Calorifica de I : CpI</Label>
                <Input
                  id="heatCapacityI"
                  value={parameters.heatCapacityI}
                  onChange={(e) => onParameterChange("heatCapacityI", e.target.value)}
                />
              </div>
            </div>
      </div>

      <div>
              <Label htmlFor="activationEnergy">Energía de Activación: E[cal/mol]</Label>
              <Input
                id="activationEnergy"
                value={parameters.activationEnergy}
                onChange={(e) => onParameterChange("activationEnergy", e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="preExponentialFactor">Factor Pre-Exponencial: A</Label>
              <Input
                id="preExponentialFactor"
                value={parameters.preExponentialFactor}
                onChange={(e) => onParameterChange("preExponentialFactor", e.target.value)}
              />
            </div>

      <div>
        <Label htmlFor="reactionEnthalpy"> Diferencia de Entalpia Estándar de la Reacción:  [cal/mol]</Label>
        <Input
          id="reactionEnthalpy"
          value={parameters.reactionEnthalpy}
          onChange={(e) => onParameterChange("reactionEnthalpy", e.target.value)}
        />
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
            <Label htmlFor="coolingFluidTemperature">Temperatura del refrigerante: Tcool[K]</Label>
            <Input
              id="coolingFluidTemperature"
              value={parameters.coolingFluidTemperature}
              onChange={(e) => onParameterChange("coolingFluidTemperature", e.target.value)}
            />
          </div>

          <div>
            <Label htmlFor="heatTransferCoefficient">Coeficiente de Transferencia de Calor: U[W/m²·K]</Label>
            <Input
              id="heatTransferCoefficient"
              value={parameters.heatTransferCoefficient}
              onChange={(e) => onParameterChange("heatTransferCoefficient", e.target.value)}
            />
          </div>

          <div>
            <Label htmlFor="heatExchangeArea">Área del ICQ: A_ICQ[m²]</Label>
            <Input
              id="heatExchangeArea"
              value={parameters.heatExchangeArea}
              onChange={(e) => onParameterChange("heatExchangeArea", e.target.value)}
            />
          </div>

          <div>
            <Label htmlFor="heatCapacityRef">Capacidad Calorifica del Refrigerante: Cp_ref[cal/mol.k]</Label>
            <Input
              id="heatCapacityRef"
              value={parameters.heatCapacityRef}
              onChange={(e) => onParameterChange("heatCapacityRef", e.target.value)}
            />
          </div>

          <div>
            <Label htmlFor="fluidRateRef">Velocidad Masica del Refrigerante: m_c[mol/s]</Label>
            <Input
              id="fluidRateRef"
              value={parameters.fluidRateRef}
              onChange={(e) => onParameterChange("fluidRateRef", e.target.value)}
            />
          </div>
        </div>
      )}
    </div>
  )
}

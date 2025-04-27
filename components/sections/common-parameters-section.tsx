"use client"

import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { OperationType, ReactorParameters, VolumeCalculate } from "@/hooks/use-reactor-parameters"
import { Switch } from "@/components/ui/switch"
import { AlertDescription } from "../ui/alert"


interface CommonParametersSectionProps {
  parameters: ReactorParameters
  operationType: OperationType
  volumeCalculate: VolumeCalculate
  onVolumeCalculateChange: (value: VolumeCalculate) => void
  onParameterChange: (param: keyof ReactorParameters, value: string) => void
}

export function CommonParametersSection({
  parameters,
  operationType,
  volumeCalculate,
  onVolumeCalculateChange,
  onParameterChange,
}: CommonParametersSectionProps) {
  return (
    <div className="space-y-4">
      <h3 className="font-medium text-lg">Common Parameters</h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="initialConcentration">Concentración Incial de A [mol/L]</Label>
          <Input
            id="initialConcentration"
            value={parameters.initialConcentration}
            onChange={(e) => onParameterChange("initialConcentration", e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="initialConcentrationB">Concentración Incial de A [mol/L]</Label>
          <Input
            id="initialConcentrationB"
            value={parameters.initialConcentrationB}
            onChange={(e) => onParameterChange("initialConcentrationB", e.target.value)}
          />
        </div>

        {/* Parámetros específicos para modo no isotérmico */}
        {operationType === "non-isothermic" && (
         <div>
          <Label htmlFor="inertConcentration">Concentración de Inerte: I [mol/L]</Label>
          <Input
            id="inertConcentration"
            value={parameters.inertConcentration}
            onChange={(e) => onParameterChange("inertConcentration", e.target.value)}
          />
        </div>
        )}

      </div>
      
        {/* Parámetros específicos para modo  isotérmico */}
        {operationType === "isothermic" && (
            <div>
              <Label>Calculo del Volumen del Reactor </Label>
              <div className="my-2">
              <AlertDescription >La simulación en modo Isotermico permite calcular el volumen del reactor para determinada producción de un producto deseado.</AlertDescription>
              </div> 
              <div className="flex items-center space-x-4 mt-2 mb-3">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="calc-vol"
                    checked={volumeCalculate === "s"}
                    onCheckedChange={(checked) => onVolumeCalculateChange(checked ? "s" : "n")}
                  />
                  <Label htmlFor="calc-vol" className="cursor-pointer">
                    {volumeCalculate === "s" ? "Calcular Volumen" : "Sin Calculo de Volumen"}
                  </Label>
                </div>
              </div>
              {volumeCalculate === "s" ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="productionOfk">Producción del Producto k: P_k[g/mol]</Label>
                  <Input
                    id="productionOfk"
                    value={parameters.productionOfk}
                    onChange={(e) => onParameterChange("productionOfk", e.target.value)}
                  />
               </div>
               <div>
                  <Label htmlFor="cDTime">Tiempo de Carga y Descarga: Tcd[s]</Label>
                  <Input
                    id="cDTime"
                    value={parameters.cDTime}
                    onChange={(e) => onParameterChange("cDTime", e.target.value)}
                  />
               </div>
               <div>
                  <Label htmlFor="deathTime">Tiempo Muerto: Tm [s]</Label>
                  <Input
                    id="deathTime"
                    value={parameters.deathTime}
                    onChange={(e) => onParameterChange("deathTime", e.target.value)}
                  />
               </div>
               <div>
                  <Label htmlFor="productK">Producto de Interés:</Label>
                  <Input
                    id="productK"
                    value={parameters.productK}
                    onChange={(e) => onParameterChange("productK", e.target.value)}
                  />
               </div>
               <div>
                  <Label htmlFor="molarMassK">Masa Molar del Producto k: M_k [g/mol]</Label>
                  <Input
                    id="molarMassK"
                    value={parameters.molarMassK}
                    onChange={(e) => onParameterChange("molarMassK", e.target.value)}
                  />
               </div>
              </div>
            ) : (
              <div>
              </div>
            )}
            </div>
           
        )}

    </div>
  )
}

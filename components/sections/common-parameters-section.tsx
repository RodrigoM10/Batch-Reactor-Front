"use client"

import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { OperationType, ReactorParameters, VolumeCalculate, ProductK, ExcessB } from "@/hooks/use-reactor-parameters"
import { Switch } from "@/components/ui/switch"
import { AlertDescription } from "../ui/alert"
import { ValidationErrors } from "@/hooks/use-validation"
import { FormError } from "../ui/form-error"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"


interface CommonParametersSectionProps {
  parameters: ReactorParameters
  operationType: OperationType
  volumeCalculate: VolumeCalculate
  productK: ProductK
  excessB: ExcessB
  onVolumeCalculateChange: (value: VolumeCalculate) => void
  onProductKChange: (value: ProductK) => void
  onParameterChange: (param: keyof ReactorParameters, value: string) => void
  onExcessBChange: (value: ExcessB) => void
  errors: ValidationErrors
}

export function CommonParametersSection({
  parameters,
  operationType,
  volumeCalculate,
  productK,
  excessB,
  onVolumeCalculateChange,
  onProductKChange,
  onParameterChange,
  onExcessBChange,
  errors,
}: CommonParametersSectionProps) {
  return (
    <div className="space-y-4">
      <h3 className="font-medium text-lg">Parametros de Concentración de Componentes</h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Campo para Concentración Inicial de A */}
        <div>
          <Label htmlFor="initialConcentration" className={errors.initialConcentration ? "text-red-500" : ""}>
          Concentración Inicial de A [mol/L] 
          </Label> {/* <-- Cambiado aquí */}
          <Input
          id="initialConcentration"
          value={parameters.initialConcentration}
          onChange={(e) => onParameterChange("initialConcentration", e.target.value)}
          className={errors.initialConcentration ? "border-red-500" : ""}
          />
          <FormError message={errors.initialConcentration} />
        </div>

    {/* Campo para Concentración Inicial de B y Switch de Exceso */}
        <div className="flex items-end gap-2">
          <div className="flex-grow">
            <Label
              htmlFor="initialConcentrationB"
              className={errors.initialConcentrationB ? "text-red-500" : ""}
            >
              Concentración Inicial de B [mol/L] 
            </Label>
            <Input
              id="initialConcentrationB"
              value={parameters.initialConcentrationB}
              onChange={(e) =>
                onParameterChange("initialConcentrationB", e.target.value)
              }
              className={errors.initialConcentrationB ? "border-red-500" : ""}
            />
            <FormError message={errors.initialConcentrationB} />
          </div>
          <div className="flex flex-col items-center justify-end h-full pt-6">
            <Label
              htmlFor="excess_b_switch"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-nowrap"
            >
              B en exceso?
            </Label>
            <Switch
              id="excess_b_switch"
              checked={excessB}
              onCheckedChange={(checked) => onExcessBChange(checked ? true : false)}
              className="mt-2" 
            />
          </div>
        </div>
        {/* Campo para Concentración Inicial de C */}
        <div>
          <Label htmlFor="initialConcentrationC" className={errors.initialConcentrationC ? "text-red-500" : ""}>
          Concentración Inicial de C [mol/L] 
          </Label> {/* <-- Cambiado aquí */}
          <Input
          id="initialConcentrationC"
          value={parameters.initialConcentrationC}
          onChange={(e) => onParameterChange("initialConcentrationC", e.target.value)}
          className={errors.initialConcentrationC ? "border-red-500" : ""}
          />
          <FormError message={errors.initialConcentrationC} />
        </div>

        {/* Campo para Concentración Inicial de D */}
        <div>
          <Label htmlFor="initialConcentrationD" className={errors.initialConcentrationD ? "text-red-500" : ""}>
          Concentración Inicial de D [mol/L] 
          </Label> {/* <-- Cambiado aquí */}
          <Input
          id="initialConcentrationD"
          value={parameters.initialConcentrationD}
          onChange={(e) => onParameterChange("initialConcentrationD", e.target.value)}
          className={errors.initialConcentrationD ? "border-red-500" : ""}
          />
          <FormError message={errors.initialConcentrationD} />
        </div>

        {/* Parámetros específicos para modo no isotérmico (Concentración de Inerte) */}
        {operationType === "non-isothermic" && (
         <div>
          <Label htmlFor="inertConcentration" className={errors.inertConcentration ? "text-red-500" : ""}>
           Concentración de Inerte: I [mol/L]
          </Label>
          <Input
          id="inertConcentration"
          value={parameters.inertConcentration}
          onChange={(e) => onParameterChange("inertConcentration", e.target.value)}
          className={errors.inertConcentration ? "border-red-500" : ""}
          />
          <FormError message={errors.inertConcentration} />
        </div>
        )}

      </div>

        {/* Parámetros específicos para modo isotérmico */}
        {operationType === "isothermic" && (
            <div>
              <Label>Cálculo del Volumen del Reactor </Label> {/* <-- Acentuado "Cálculo" */}
              <div className="my-2">
              <AlertDescription >La simulación en modo Isotérmico permite calcular el volumen del reactor para determinada producción de un producto deseado.</AlertDescription> {/* <-- Acentuado "Isotérmico" */}
              </div>
              <div className="flex items-center space-x-4 mt-2 mb-3">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="calc-vol"
                    checked={volumeCalculate === "s"}
                    onCheckedChange={(checked) => onVolumeCalculateChange(checked ? "s" : "n")}
                  />
                  <Label htmlFor="calc-vol" className="cursor-pointer">
                    {volumeCalculate === "s" ? "Calcular Volumen" : "Sin Cálculo de Volumen"} {/* <-- Acentuado "Cálculo" */}
                  </Label>
                </div>
              </div>
              {volumeCalculate === "s" ? (
              <div>
                    <div className="mb-4">
                      <Select
                          value={productK}
                          onValueChange={(value) => onProductKChange(value as ProductK)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Producto de Interés" /> {/* <-- Acentuado "Interés" */}
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="C">Producto C</SelectItem>
                            <SelectItem value="D">Producto D</SelectItem>
                          </SelectContent>
                        </Select>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="productionOfk" className={errors.productionOfk ? "text-red-500" : ""}>
                       Producción del Producto k [kg/min]
                      </Label>
                      <Input
                      id="productionOfk"
                      value={parameters.productionOfk}
                      onChange={(e) => onParameterChange("productionOfk", e.target.value)}
                      className={errors.productionOfk ? "border-red-500" : ""}
                      />
                      <FormError message={errors.productionOfk} />
                  </div>
                  <div>
                      <Label htmlFor="cdmTime" className={errors.cdmTime ? "text-red-500" : ""}>
                      Tiempo de Muerto, Carga y Descarga [min]
                      </Label>
                      <Input
                      id="cdmTime"
                      value={parameters.cdmTime}
                      onChange={(e) => onParameterChange("cdmTime", e.target.value)}
                      className={errors.cdmTime ? "border-red-500" : ""}
                      />
                      <FormError message={errors.cdmTime} />
                  </div>
                  
                  <div>
                      <Label htmlFor="molarMassK" className={errors.molarMassK ? "text-red-500" : ""}>
                      Masa Molar del Producto k [kg/kmol]
                      </Label>
                      <Input
                      id="molarMassK"
                      value={parameters.molarMassK}
                      onChange={(e) => onParameterChange("molarMassK", e.target.value)}
                      className={errors.molarMassK ? "border-red-500" : ""}
                      />
                      <FormError message={errors.molarMassK} />
                  </div>
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
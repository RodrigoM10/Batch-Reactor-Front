"use client"

interface SimulationSummaryProps {
  operationType: "isothermic" | "non-isothermic"
  isothermicMode: "x" | "t"
  energyMode: "adiabatic" | "icq"
  reactionOrder: "1" | "2"
   reactionType: "reversible" | "irreversible"
  equilibriumMethod: "vanthoff" | "gibbs" | "direct"
  additionalData: any
   unitMeasure:"min"|"seg"
}

export function SimulationSummary({
  operationType,
  isothermicMode,
  energyMode,
  reactionOrder,
  reactionType,
  equilibriumMethod,
  additionalData,
  unitMeasure
}: SimulationSummaryProps) {
  const finalTemperature = additionalData.finalTemperature || 298.15

  return (
    <div className="mt-6 p-4 bg-gray-50 rounded-md text-sm max-w-6xl mx-auto">
      <p className="font-medium">Resumen de la Simulación:</p>
      <ul className="list-disc list-inside mt-2 space-y-1">
        <li>
          Modo de Operación:{" "}
          <span className="font-medium">
            {operationType === "isothermic" ? "Isotérmico" : "No Isotérmico"}
          </span>
        </li>
        <li>
          Orden de Reacción:{" "}
          <span className="font-medium">
            {reactionOrder === "1" ? "Primer Orden" : "Segundo Orden"}
          </span>
        </li>
         <li>
          Tipo de Reacción:{" "}
          <span className="font-medium">
            {reactionType === "reversible" ? "Reacción Reversible" : "Reacción Irreversible"}
          </span>
        </li>
        {operationType === "isothermic" && (
          <>
            <li>
              Cálculo Basado En:{" "}
              <span className="font-medium">{isothermicMode === "x" ? `Conversión (X) = ${additionalData.finalConversion.toFixed(3)} ` : `Tiempo (t) = ${additionalData.reactionTime.toFixed(2)}`}</span>
            </li>
            <li>
              Método de Equilibrio:{" "}
              <span className="font-medium">
                {equilibriumMethod === "vanthoff"
                  ? "Ecuación de Van't Hoff"
                  : equilibriumMethod === "gibbs"
                    ? "Energía de Gibbs"
                    : "Entrada Directa de Ke"}
              </span>
            </li>
            {additionalData.volume && (
              <li>
                Volumen del Reactor Calculado: <span className="font-medium">{additionalData.volume.toFixed(2)} [L]</span>
              </li>
            )}
          </>
        )}
        {operationType === "non-isothermic" && (
          <li>
            Modo de Energía:{" "}
            <span className="font-medium">{energyMode === "adiabatic" ? "Adiabático" : "Intercambiador de Calor (ICQ)"}</span>
          </li>
        )}
          {isothermicMode === "x" ? 
          <li>
           Tiempo final de reacción: <span className="font-medium">{additionalData.reactionTime.toFixed(2)} minutos</span>
          </li>:
          <li>
            Conversión Final: <span className="font-medium">{additionalData.finalConversion.toFixed(3)}</span>
        </li>
        }
        <li>
          Temperatura Final: <span className="font-medium">{finalTemperature.toFixed(1)} K</span>
        </li>
        {additionalData.reactionRate && (
          <li>
            Velocidad de Reacción Final:{" "}
            <span className="font-medium">{additionalData.reactionRate.toFixed(6)} [mol/L·({unitMeasure})]</span>
          </li>
        )}
        {additionalData.message && (
          <li>
            Mensaje: <span className="font-medium">{additionalData.message}</span>
          </li>
        )}
      </ul>
    </div>
  )
}

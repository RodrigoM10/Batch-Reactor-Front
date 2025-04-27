"use client"

import { useToast } from "@/components/ui/use-toast"
import { useState } from "react"
import type { ReactorState } from "./use-reactor-parameters"

export interface SimulationResult {
  data: Array<{
    time: number
    conversion: number
    concentration: number
    temperature: number
    [key: string]: any
  }>
  [key: string]: any
}

export function useSimulation() {
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [showResults, setShowResults] = useState(false)
  const [simulationResults, setSimulationResults] = useState<SimulationResult | null>(null)

  // Función para convertir los datos del formulario al formato requerido por el backend
  const prepareDataForBackend = (state: ReactorState) => {
    const {
      operationType,
      isothermicMode,
      energyMode,
      reactionOrder,
      equilibriumMethod,
      volumeCalculate,
      rateConstantMode,
      parameters,
    } = state

    // Crear objeto stoichiometry con los coeficientes no nulos
    const stoichiometry: Record<string, number> = {}

    const coeffA = Number.parseFloat(parameters.coefficientA)
    const coeffB = Number.parseFloat(parameters.coefficientB)
    const coeffC = Number.parseFloat(parameters.coefficientC)
    const coeffD = Number.parseFloat(parameters.coefficientD)

    if (coeffA !== 0) stoichiometry["A"] = coeffA
    if (coeffB !== 0) stoichiometry["B"] = coeffB
    if (coeffC !== 0) stoichiometry["C"] = coeffC
    if (coeffD !== 0) stoichiometry["D"] = coeffD

    // Crear objeto para calores específicos
    const C_p_dict: Record<string, number> = {
      A: Number.parseFloat(parameters.heatCapacityA),
      I: Number.parseFloat(parameters.heatCapacityI),
    }

    // Añadir calores específicos para los componentes presentes
    if (coeffB !== 0) C_p_dict["B"] = Number.parseFloat(parameters.heatCapacityB)
    if (coeffC !== 0) C_p_dict["C"] = Number.parseFloat(parameters.heatCapacityC)
    if (coeffD !== 0) C_p_dict["D"] = Number.parseFloat(parameters.heatCapacityD)

    // Mapear el método de equilibrio
    let k_eq_method = null
    if (equilibriumMethod === "vanthoff") k_eq_method = "vant_hoff"
    else if (equilibriumMethod === "gibbs") k_eq_method = "gibbs"
    else if (equilibriumMethod === "direct") k_eq_method = "direct"

    //Optar por el calculo de Volumen del Reactor en modo isotermico
    let ans_volume = null
    if (volumeCalculate === "s") ans_volume = "s"
    else ans_volume = "n"

    // Preparar objeto para energías de Gibbs si es necesario
    let DG_dict: Record<string, number> | null = null
    if (equilibriumMethod === "gibbs") {
      DG_dict = {
        A: Number.parseFloat(parameters.gibbsEnergyA),
        C: Number.parseFloat(parameters.gibbsEnergyC),
      }

      if (coeffB !== 0) DG_dict["B"] = Number.parseFloat(parameters.gibbsEnergyB)
      if (coeffD !== 0) DG_dict["D"] = Number.parseFloat(parameters.gibbsEnergyD)
    }

    // Determinar el valor de k según el modo seleccionado
    let A_value = null
    let E_value = null

    if (operationType === "isothermic") {
      if (rateConstantMode === "direct") {
        A_value = Number.parseFloat(parameters.directRateConstant)
        E_value = 0 // No se usa en modo directo
      } else {
        A_value = Number.parseFloat(parameters.preExponentialFactor)
        E_value = Number.parseFloat(parameters.activationEnergy)
      }
    } else {
      // Para modo no isotérmico
      A_value = Number.parseFloat(parameters.preExponentialFactor)
      E_value = Number.parseFloat(parameters.activationEnergy)
    }

    // Construir el objeto final
    const backendData = {
      mode_op: operationType === "isothermic" ? "isothermal" : "non-isothermal",
      k_eq_method: k_eq_method,
      K_eq_direct: equilibriumMethod === "direct" ? Number.parseFloat(parameters.ke) : null,
      K_det: null, // No usado en la interfaz actual
      T_iso: operationType === "isothermic" ? Number.parseFloat(parameters.temperature) : null,
      A: A_value,
      E: E_value,
      option: isothermicMode === "x" ? "X" : "t",
      X_A_desired: isothermicMode === "x" ? Number.parseFloat(parameters.targetConversion) : null,
      t_reaction_det: isothermicMode === "t" ? Number.parseFloat(parameters.reactionTime) : null,
      C_A0: Number.parseFloat(parameters.initialConcentration),
      C_B0: Number.parseFloat(parameters.initialConcentrationB),
      C_I: operationType === "non-isothermic" ? Number.parseFloat(parameters.inertConcentration) : null,
      order: Number.parseInt(reactionOrder),
      stoichiometry: stoichiometry,
      excess_B: false, // No usado en la interfaz actual
      ans_volume: ans_volume,
      P_k:volumeCalculate === "s" ? Number.parseFloat(parameters.productionOfk) : null,
      t_c_d: volumeCalculate === "s" ? Number.parseFloat(parameters.cDTime) : null,
      t_m: volumeCalculate === "s" ? Number.parseFloat(parameters.deathTime) : null,
      product_k: volumeCalculate === "s" ? Number.parseFloat(parameters.productK) : null,
      m_k: volumeCalculate === "s" ? Number.parseFloat(parameters.molarMassK) : null,
      T_ref: Number.parseFloat(parameters.tRef),
      T0: operationType === "non-isothermic" ? Number.parseFloat(parameters.initialTemperature) : null,
      K_eq_ref: equilibriumMethod === "vanthoff" ? Number.parseFloat(parameters.keRef) : null,
      delta_H_rxn: Number.parseFloat(parameters.deltaHrxn),
      DG_dict: DG_dict,
      C_p_dict: C_p_dict,
      mode_energy: operationType === "non-isothermic" ? energyMode : null,
      U: energyMode === "icq" ? Number.parseFloat(parameters.heatTransferCoefficient) : null,
      A_ICQ: energyMode === "icq" ? Number.parseFloat(parameters.heatExchangeArea) : null,
      T_cool: energyMode === "icq" ? Number.parseFloat(parameters.coolingFluidTemperature) : null,
      Cp_ref: energyMode === "icq" ? Number.parseFloat(parameters.heatCapacityRef) : null,
      m_c: energyMode === "icq" ? Number.parseFloat(parameters.fluidRateRef) : null, 
    }
    return backendData
  }
  
  // Función para enviar los datos al backend
  const sendFormToBackend = async (state: ReactorState) => {
    // Preparar los datos para el backend
    const backendData = prepareDataForBackend(state)
    
  console.log("backendData", backendData)
    // Mostrar indicador de carga
    setIsLoading(true)

    try {
      // Enviar datos al backend
      const response = await fetch("/api/simulate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(backendData),
      })

      if (!response.ok) {
        throw new Error(`Error en la respuesta: ${response.status}`)
      }

      // Procesar la respuesta
      const result = await response.json()
      setSimulationResults(result)

      // Mostrar resultados
      setShowResults(true)

      toast({
        title: "Datos enviados correctamente",
        description: "Los datos han sido enviados al backend con éxito.",
      })

      return true
    } catch (error) {
      console.error("Error al enviar datos al backend:", error)

      toast({
        title: "Error en el envío",
        description: "No se pudieron enviar los datos al backend. Por favor, intente nuevamente.",
        variant: "destructive",
      })

      return false
    } finally {
      setIsLoading(false)
    }
  }

  return {
    isLoading,
    showResults,
    simulationResults,
    sendFormToBackend,
  }
}

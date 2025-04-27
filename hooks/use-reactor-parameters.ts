"use client"

import { useState, useEffect } from "react"

// Tipos para los parámetros
export type OperationType = "isothermic" | "non-isothermic"
export type IsothermicMode = "x" | "t"
export type VolumeCalculate = "s" | "n"
export type EnergyMode = "adiabatic" | "icq"
export type ReactionOrder = "1" | "2"
export type EquilibriumMethod = "vanthoff" | "gibbs" | "direct"
export type RateConstantMode = "direct" | "arrhenius"

// Interfaz para los parámetros
export interface ReactorParameters {
  // Stoichiometry parameters
  coefficientA: string
  coefficientB: string
  coefficientC: string
  coefficientD: string

  // Common parameters
  initialConcentration: string
  initialConcentrationB: string
  inertConcentration: string
  activationEnergy: string
  preExponentialFactor: string

  // Isothermic parameters
  temperature: string
  targetConversion: string
  reactionTime: string

  // Rate constant parameters
  directRateConstant: string

  // Non-isothermic parameters
  initialTemperature: string
  // specificHeat: string
  heatCapacityA: string
  heatCapacityB: string
  heatCapacityC: string
  heatCapacityD: string
  heatCapacityI: string
  reactionEnthalpy: string

  // ICQ specific parameters
  coolingFluidTemperature: string
  heatTransferCoefficient: string
  heatExchangeArea: string
  heatCapacityRef: string
  fluidRateRef: string

  // Equilibrium parameters - Van't Hoff
  keRef: string
  tRef: string
  deltaHrxn: string

  // Equilibrium parameters - Gibbs
  gibbsEnergyA: string
  gibbsEnergyB: string
  gibbsEnergyC: string
  gibbsEnergyD: string

  // Equilibrium parameters - Direct
  ke: string

  // Volume Calculate params
  productionOfk: string
  cDTime: string
  deathTime: string
  productK: string
  molarMassK: string
}

// Interfaz para el estado completo
export interface ReactorState {
  operationType: OperationType
  isothermicMode: IsothermicMode
  energyMode: EnergyMode
  reactionOrder: ReactionOrder
  equilibriumMethod: EquilibriumMethod
  volumeCalculate: VolumeCalculate
  rateConstantMode: RateConstantMode
  parameters: ReactorParameters
}

// Valores por defecto
const defaultParameters: ReactorParameters = {
  // Stoichiometry parameters
  coefficientA: "-1",
  coefficientB: "-2",
  coefficientC: "3",
  coefficientD: "0",

  // Common parameters
  initialConcentration: "1.0",
  initialConcentrationB: "1.0",
  inertConcentration:"1.0",

  //K reaccion VantHoff parameters
  activationEnergy: "50000",
  preExponentialFactor: "1.0e10",

  // Isothermic parameters
  temperature: "298.15",
  targetConversion: "0.8",
  reactionTime: "60",

  // Rate constant parameters
  directRateConstant: "0.05",

  // Non-isothermic parameters
  initialTemperature: "298.15",
  // specificHeat: "",
  heatCapacityA: "35",
  heatCapacityB: "18",
  heatCapacityC: "46",
  heatCapacityD: "0",
  heatCapacityI: "19.5",
  reactionEnthalpy: "-50000",

  // ICQ specific parameters
  coolingFluidTemperature: "288.15",
  heatTransferCoefficient: "500",
  heatExchangeArea: "2.0",
  heatCapacityRef: "4.18",
  fluidRateRef: "10",

  // Equilibrium parameters - Van't Hoff
  keRef: "1.5",
  tRef: "298.15",
  deltaHrxn: "-50000",

  // Equilibrium parameters - Gibbs
  gibbsEnergyA: "-50000",
  gibbsEnergyB: "-30000",
  gibbsEnergyC: "-70000",
  gibbsEnergyD: "0",

  // Equilibrium parameters - Direct
  ke: "1.5",

  // Volume Calculate Parameters
  productionOfk: "100",
  cDTime: "10",
  deathTime: "5",
  productK: "C",
  molarMassK: "45",
}

const defaultState: ReactorState = {
  operationType: "isothermic",
  isothermicMode: "x",
  energyMode: "adiabatic",
  reactionOrder: "1",
  equilibriumMethod: "vanthoff",
  volumeCalculate: "s",
  rateConstantMode: "direct",
  parameters: defaultParameters,
}

export function useReactorParameters() {
  // Estado principal
  const [state, setState] = useState<ReactorState>(defaultState)

  // Destructurar el estado para facilitar su uso
  const { operationType, isothermicMode, energyMode, reactionOrder, equilibriumMethod, volumeCalculate, rateConstantMode, parameters } =
    state

  // Cargar parámetros desde localStorage al montar el componente
  useEffect(() => {
    const savedParams = localStorage.getItem("batchReactorParameters")
    if (savedParams) {
      try {
        const parsedParams = JSON.parse(savedParams)
        setState(parsedParams)
      } catch (error) {
        console.error("Error parsing saved parameters:", error)
      }
    }
  }, [])

  // Guardar parámetros en localStorage cuando cambian
  useEffect(() => {
    localStorage.setItem("batchReactorParameters", JSON.stringify(state))
  }, [state])

  // Cambiar el método de equilibrio si es necesario cuando cambia el tipo de operación
  useEffect(() => {
    if (operationType === "non-isothermic" && equilibriumMethod === "direct") {
      setState((prev) => ({
        ...prev,
        equilibriumMethod: "vanthoff",
      }))
    }
  }, [operationType, equilibriumMethod])

  // Funciones para actualizar el estado
  const setOperationType = (value: OperationType) => {
    setState((prev) => ({ ...prev, operationType: value }))
  }

  const setIsothermicMode = (value: IsothermicMode) => {
    setState((prev) => ({ ...prev, isothermicMode: value }))
  }
  
  const setVolumeCalculate = (value: VolumeCalculate) => {
    setState((prev) => ({ ...prev, volumeCalculate: value }))
  }

  const setEnergyMode = (value: EnergyMode) => {
    setState((prev) => ({ ...prev, energyMode: value }))
  }

  const setReactionOrder = (value: ReactionOrder) => {
    setState((prev) => ({ ...prev, reactionOrder: value }))
  }

  const setEquilibriumMethod = (value: EquilibriumMethod) => {
    setState((prev) => ({ ...prev, equilibriumMethod: value }))
  }

  const setRateConstantMode = (value: RateConstantMode) => {
    setState((prev) => ({ ...prev, rateConstantMode: value }))
  }

  const handleParameterChange = (param: keyof ReactorParameters, value: string) => {
    setState((prev) => ({
      ...prev,
      parameters: {
        ...prev.parameters,
        [param]: value,
      },
    }))
  }

  return {
    state,
    operationType,
    isothermicMode,
    volumeCalculate,
    energyMode,
    reactionOrder,
    equilibriumMethod,
    rateConstantMode,
    parameters,
    setOperationType,
    setIsothermicMode,
    setVolumeCalculate,
    setEnergyMode,
    setReactionOrder,
    setEquilibriumMethod,
    setRateConstantMode,
    handleParameterChange,
  }
}

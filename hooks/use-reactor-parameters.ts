"use client"

import { useState, useEffect } from "react"

// Tipos para los parámetros
export type OperationType = "isothermic" | "non-isothermic"
export type IsothermicMode = "x" | "t"
export type VolumeCalculate = "s" | "n"
export type ProductK = "C" | "D"
export type ExcessB = boolean
export type EnergyMode = "adiabatic" | "icq"
export type ReactionOrder = "1" | "2"
export type ReactionType = "reversible" | "irreversible"
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
  initialConcentrationC: string
  initialConcentrationD: string
  inertConcentration: string
  activationEnergy: string
  activationEnergyT: string
  preExponentialFactor: string
  preExponentialFactorT: string

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
  cdmTime: string
  molarMassK: string
}

// Interfaz para el estado completo
export interface ReactorState {
  operationType: OperationType
  isothermicMode: IsothermicMode
  energyMode: EnergyMode
  reactionOrder: ReactionOrder
  reactionType: ReactionType
  equilibriumMethod: EquilibriumMethod
  volumeCalculate: VolumeCalculate
  productK: ProductK
  excessB: ExcessB
  rateConstantMode: RateConstantMode
  parameters: ReactorParameters
}

// Valores por defecto
const defaultParameters: ReactorParameters = {

//PARAMETROS EN COMUN  
  //Common Stoichiometry parameters
  coefficientA: "-1",
  coefficientB: "-2",
  coefficientC: "3",
  coefficientD: "0",
  // Common parameters
  initialConcentration: "1.0",
  initialConcentrationB: "1.0",    
  initialConcentrationC:"0",
  initialConcentrationD:"0",
  //PARAMETROS DE EQUILIBRIO
    // Equilibrium parameters - Direct (EXCLUSIVO MODO ISO)
    ke: "1.5",
    // Equilibrium parameters - Van't Hoff
    keRef: "1.5",
    tRef: "298.15",
    deltaHrxn: "-50000",

    // Equilibrium parameters - Gibbs
    gibbsEnergyA: "-50000",
    gibbsEnergyB: "-30000",
    gibbsEnergyC: "-70000",
    gibbsEnergyD: "0",


//ISOTHERMAL PARAMETERS
  temperature: "298.15",

  //Constante de Velocidad Det Metodo
    // Rate constant parameters
      directRateConstant: "0.05",
    //K reaccion Arrehenius parameters
    activationEnergy: "50000",
    preExponentialFactor: "1.0e10",  
    
  //Modo de Calculo
    //conversion mode
      targetConversion: "0.8",
    //time mode
      reactionTime: "60",
  
  //Common Parameters
  // Volume Calculate Parameters
    productionOfk: "100",
    cdmTime: "10",
    molarMassK: "45",  


//NON ISOTHERMAL Parameters
  initialTemperature: "298.15",

  // specificHeat: "",
    heatCapacityA: "35",
    heatCapacityB: "18",
    heatCapacityC: "46",
    heatCapacityD: "0",
    heatCapacityI: "19.5",

  //ENERGIA DE ACTIVACIÓN
  //Factor Preexponencial
  //calor de reaccion estandar
  activationEnergyT: "1000",
  preExponentialFactorT: "756",
  reactionEnthalpy: "-50000",

  //Tipo de Reactor 
    //Adiabatico
    // ICQ specific parameters
      coolingFluidTemperature: "288.15",
      heatTransferCoefficient: "500",
      heatExchangeArea: "2.0",
      heatCapacityRef: "4.18",
      fluidRateRef: "10",

  // Common parameters
  inertConcentration:"1.0",  
}

const defaultState: ReactorState = {
  operationType: "isothermic",
  isothermicMode: "x",
  energyMode: "adiabatic",
  reactionOrder: "1",
  reactionType: "reversible",
  equilibriumMethod: "vanthoff",
  volumeCalculate: "s",
  productK: "C",
  excessB: false,
  rateConstantMode: "direct",
  parameters: defaultParameters,
}

export function useReactorParameters() {
  // Estado principal
  const [state, setState] = useState<ReactorState>(defaultState)

  // Destructurar el estado para facilitar su uso
  const { operationType, isothermicMode, energyMode, reactionOrder, reactionType, equilibriumMethod, volumeCalculate, productK, excessB, rateConstantMode, parameters } =
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

  const setProductK = (value: ProductK) => {
    setState((prev) => ({ ...prev, productK: value }))
  }
  const setExcessB = (value: ExcessB) => {
    setState((prev) => ({ ...prev, excessB: value }))
  }

  const setEnergyMode = (value: EnergyMode) => {
    setState((prev) => ({ ...prev, energyMode: value }))
  }

  const setReactionOrder = (value: ReactionOrder) => {
    setState((prev) => ({ ...prev, reactionOrder: value }))
  }

  const setReactionType = (value: ReactionType) => {
    setState((prev) => ({ ...prev, reactionType: value }))
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
    productK,
    excessB,
    energyMode,
    reactionOrder,
    reactionType,
    equilibriumMethod,
    rateConstantMode,
    parameters,
    setOperationType,
    setIsothermicMode,
    setVolumeCalculate,
    setProductK,
    setExcessB,
    setEnergyMode,
    setReactionOrder,
    setReactionType,
    setEquilibriumMethod,
    setRateConstantMode,
    handleParameterChange,
  }
}

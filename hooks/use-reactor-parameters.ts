"use client"

import { useState, useEffect } from "react"

export type OperationType = "isothermic" | "non-isothermic"
export type IsothermicMode = "x" | "t"
export type VolumeCalculate = "s" | "n"
export type ProductK = "C" | "D"
export type UnitMeasure = "min" | "seg"
export type ExcessB = boolean
export type EnergyMode = "adiabatic" | "icq"
export type ReactionOrder = "1" | "2"
export type ReactionType = "reversible" | "irreversible"
export type EquilibriumMethod = "vanthoff" | "gibbs" | "direct"
export type RateConstantMode = "direct" | "arrhenius"

export interface ReactorParameters {
  coefficientA: string
  coefficientB: string
  coefficientC: string
  coefficientD: string
  initialConcentration: string
  initialConcentrationB: string
  initialConcentrationC: string
  initialConcentrationD: string
  inertConcentration: string
  activationEnergy: string
  activationEnergyT: string
  preExponentialFactor: string
  preExponentialFactorT: string
  temperature: string
  targetConversion: string
  reactionTime: string
  directRateConstant: string
  initialTemperature: string
  heatCapacityA: string
  heatCapacityB: string
  heatCapacityC: string
  heatCapacityD: string
  heatCapacityI: string
  reactionEnthalpy: string
  coolingFluidTemperature: string
  heatTransferCoefficient: string
  heatExchangeArea: string
  heatCapacityRef: string
  fluidRateRef: string
  keRef: string
  tRef: string
  deltaHrxn: string
  gibbsEnergyA: string
  gibbsEnergyB: string
  gibbsEnergyC: string
  gibbsEnergyD: string
  ke: string
  productionOfk: string
  cdmTime: string
  molarMassK: string
}

export interface ReactorState {
  operationType: OperationType
  isothermicMode: IsothermicMode
  energyMode: EnergyMode
  reactionOrder: ReactionOrder
  reactionType: ReactionType
  equilibriumMethod: EquilibriumMethod
  volumeCalculate: VolumeCalculate
  productK: ProductK
  unitMeasure: UnitMeasure
  excessB: ExcessB
  rateConstantMode: RateConstantMode
  parameters: ReactorParameters
}

const defaultParameters: ReactorParameters = {
    coefficientA: "-1",
    coefficientB: "-2",
    coefficientC: "3",
    coefficientD: "0",
    initialConcentration: "1.0",
    initialConcentrationB: "1.0",    
    initialConcentrationC:"0",
    initialConcentrationD:"0",
    ke: "1.5",
    keRef: "1.5",
    tRef: "298.15",
    deltaHrxn: "-50000",
    gibbsEnergyA: "-50000",
    gibbsEnergyB: "-30000",
    gibbsEnergyC: "-70000",
    gibbsEnergyD: "0",
    temperature: "298.15",
    directRateConstant: "0.05",
    activationEnergy: "50000",
    preExponentialFactor: "1.0e10",  
    targetConversion: "0.8",
    reactionTime: "60",
    productionOfk: "100",
    cdmTime: "10",
    molarMassK: "45",  
   initialTemperature: "298.15",
    heatCapacityA: "35",
    heatCapacityB: "18",
    heatCapacityC: "46",
    heatCapacityD: "0",
    heatCapacityI: "19.5",
    activationEnergyT: "1000",
    preExponentialFactorT: "756",
    reactionEnthalpy: "-50000",
    coolingFluidTemperature: "288.15",
    heatTransferCoefficient: "500",
    heatExchangeArea: "2.0",
    heatCapacityRef: "4.18",
    fluidRateRef: "10",
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
  unitMeasure: "min",
  excessB: false,
  rateConstantMode: "direct",
  parameters: defaultParameters,
}

export function useReactorParameters() {
  const [state, setState] = useState<ReactorState>(defaultState)

  const { operationType, isothermicMode, energyMode, reactionOrder, reactionType, equilibriumMethod, volumeCalculate, productK, unitMeasure, excessB, rateConstantMode, parameters } =
    state

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

  useEffect(() => {
    localStorage.setItem("batchReactorParameters", JSON.stringify(state))
  }, [state])

  useEffect(() => {
    if (operationType === "non-isothermic" && equilibriumMethod === "direct") {
      setState((prev) => ({
        ...prev,
        equilibriumMethod: "vanthoff",
      }))
    }
  }, [operationType, equilibriumMethod])

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
    const setUnitMeasure = (value: UnitMeasure) => {
    setState((prev) => ({ ...prev, unitMeasure: value }))
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
    unitMeasure,
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
    setUnitMeasure,
    setExcessB,
    setEnergyMode,
    setReactionOrder,
    setReactionType,
    setEquilibriumMethod,
    setRateConstantMode,
    handleParameterChange,
  }
}

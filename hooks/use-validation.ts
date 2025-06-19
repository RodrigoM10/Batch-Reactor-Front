"use client"

import { useState, useEffect } from "react"
//import type { ReactorParameters } from "./use-reactor-parameters"
import type { OperationType, IsothermicMode, RateConstantMode, ReactorParameters, EquilibriumMethod, EnergyMode, VolumeCalculate } from "./use-reactor-parameters"

export type ValidationErrors = {
  [key in keyof ReactorParameters]?: string
}

export function useValidation(
  parameters: ReactorParameters,
  operationType: OperationType,
  isothermicMode: IsothermicMode,
  rateConstantMode: RateConstantMode,
  equilibriumMethod: EquilibriumMethod,
  energyMode: EnergyMode,
  volumeCalculate: VolumeCalculate
) {
    
  const [errors, setErrors] = useState<ValidationErrors>({})
  const [validated, setValidated] = useState(false)

  // Validar los parámetros cuando cambien
  const validateFields = () => {
    const newErrors: ValidationErrors = {}
 
    //Parametros en Común

      // Validar SIEMPRE coeficientes estequiométricos (entre -10 y 10)
        const validateCoefficient = (value: string, fieldName: keyof ReactorParameters) => {
          
          if (!value.trim()) {
            newErrors[fieldName] = "Este campo es requerido"
            return
          }

          const num = Number.parseFloat(value)
          if (isNaN(num)) {
            newErrors[fieldName] = "Debe ser un número válido"
          } else if (num < -10 || num > 10) {
            newErrors[fieldName] = "Debe estar entre -10 y 10"
          }
        }
        validateCoefficient(parameters.coefficientA, "coefficientA")
        validateCoefficient(parameters.coefficientB, "coefficientB")
        validateCoefficient(parameters.coefficientC, "coefficientC")
        validateCoefficient(parameters.coefficientD, "coefficientD")

      // Validar concentraciones (mayores a cero)
        const validateConcentration = (value: string, fieldName: keyof ReactorParameters) => {
          const num = Number.parseFloat(value)
          if (isNaN(num)) {
            newErrors[fieldName] = "Debe ser un número válido"
          } else if (num < 0 ) {
            newErrors[fieldName] = "Debe ser mayor o igual a 0"
          }
        }

        validateConcentration(parameters.initialConcentration, "initialConcentration")
        validateConcentration(parameters.initialConcentrationB, "initialConcentrationB")
        validateConcentration(parameters.initialConcentrationC, "initialConcentrationC")
        validateConcentration(parameters.initialConcentrationD, "initialConcentrationD")
        if (operationType === "non-isothermic") { 
          validateConcentration(parameters.inertConcentration,"inertConcentration")
        } 

      // Parametros de Equilibrio
        //GIBBS
        const validateGibbsParameters = (value: string, fieldName: keyof ReactorParameters) => {
            const num = Number.parseFloat(value)
            if (isNaN(num)) {
              newErrors[fieldName] = "Debe ser un número válido"
            } 
          }
          
          if(equilibriumMethod==="gibbs"){
            validateGibbsParameters(parameters.gibbsEnergyA, "gibbsEnergyA")
            validateGibbsParameters(parameters.gibbsEnergyB, "gibbsEnergyB")
            validateGibbsParameters(parameters.gibbsEnergyC, "gibbsEnergyC")
            validateGibbsParameters(parameters.gibbsEnergyD, "gibbsEnergyD")
          }
        //Van't Hoff  
        const validateVantHoffParameters = (value: string, fieldName: keyof ReactorParameters) => {
          const num = Number.parseFloat(value)
          if (isNaN(num)) {
            newErrors[fieldName] = "Debe ser un número válido"
          } else if (num <= 0) {
            newErrors[fieldName] = "Debe ser mayor a 0"
          }
        }
        
  
    // Validar concentraciones (mayores a cero)
    const validateCP = (value: string, fieldName: keyof ReactorParameters) => {
        const num = Number.parseFloat(value)
        if (isNaN(num)) {
          newErrors[fieldName] = "Debe ser un número válido"
        } else if (num < 0) {
          newErrors[fieldName] = "Debe ser mayor a 0"
        }
      }
      if(operationType==="non-isothermic"){
        validateCP(parameters.heatCapacityA, "heatCapacityA")
        validateCP(parameters.heatCapacityB, "heatCapacityB")
        validateCP(parameters.heatCapacityC, "heatCapacityC")
        validateCP(parameters.heatCapacityD, "heatCapacityD")
        validateCP(parameters.heatCapacityI, "heatCapacityI")
      }
      if(operationType==="non-isothermic" && energyMode ==="icq"){
        validateCP(parameters.heatCapacityRef, "heatCapacityRef")
      }


      // Validar temperaturas
    const tempValue = (value: string, fieldName: keyof ReactorParameters) => {
        const num = Number.parseFloat(value)
        if (isNaN(num)) {
          newErrors[fieldName] = "Debe ser un número válido"
        } else if (num <= 0) {
          newErrors[fieldName] = "Debe ser mayor a 0"
        } else if (num > 3000) {
            newErrors[fieldName] = "Debe ser menor o igual a 3000 K"
        }
      }
      
      if(operationType ==="isothermic"){tempValue(parameters.temperature,"temperature")}
      if(operationType ==="non-isothermic"){tempValue(parameters.initialTemperature, "initialTemperature")}
      if(equilibriumMethod==="vanthoff"){tempValue(parameters.tRef,"tRef")} 
      if(operationType ==="non-isothermic" && energyMode ==="icq"){
        tempValue(parameters.coolingFluidTemperature, "coolingFluidTemperature")
      }

    // Validar parametros varios 
    const parametersValidation = (value: string, fieldName: keyof ReactorParameters) => {
        const num = Number.parseFloat(value)
        if (isNaN(num)) {
          newErrors[fieldName] = "Debe ser un número válido"
        } else if (num <= 0) {
          newErrors[fieldName] = "Debe ser mayor a 0"
        }
      }
      // Parametros de equilibrio
        if  (operationType === "isothermic" && equilibriumMethod === "direct"  ){ 
          parametersValidation(parameters.ke, "ke")
        }
        if(equilibriumMethod === "vanthoff"){
          parametersValidation(parameters.keRef, "keRef")
        }
      // Validacion Constante de Velocidad Dif Metodos
        if(operationType ==="isothermic"){
          if (rateConstantMode==="direct"){
            parametersValidation(parameters.directRateConstant, "directRateConstant")
          } else if (rateConstantMode==="arrhenius") { 
          parametersValidation(parameters.preExponentialFactor, "preExponentialFactor")
          parametersValidation(parameters.activationEnergy, "activationEnergy")
          }
        }

      //Validacion Calculo del Volumen
      if(operationType==="isothermic" && volumeCalculate==="s"){
        parametersValidation(parameters.productionOfk, "productionOfk")
        parametersValidation(parameters.cdmTime, "cdmTime")
        parametersValidation(parameters.molarMassK, "molarMassK")
      }

      if(operationType==="non-isothermic"){
        parametersValidation(parameters.preExponentialFactorT, "preExponentialFactorT")
        parametersValidation(parameters.activationEnergyT, "activationEnergyT")
      }

      if(operationType==="non-isothermic" && energyMode==="icq"){
        parametersValidation(parameters.heatTransferCoefficient, "heatTransferCoefficient")
        parametersValidation(parameters.heatExchangeArea, "heatExchangeArea")
        parametersValidation(parameters.fluidRateRef, "fluidRateRef")
      }

    // Validar conversión objetivo (entre 0 y 1) o tiempo de reaccion (exclusivo Isotermico)
    if(operationType ==="isothermic"){
        if(isothermicMode ==="x"){
          const convValue = Number.parseFloat(parameters.targetConversion)
          if (isNaN(convValue)) {
            newErrors.targetConversion = "Debe ser un número válido"
          } else if (convValue <= 0) {
            newErrors.targetConversion = "Debe ser mayor a 0"
          } else if (convValue > 1) {
            newErrors.targetConversion = "Debe ser menor o igual a 1"
          }
        } else if(isothermicMode="t"){
          const reactionTimeValue = Number.parseFloat(parameters.reactionTime)
          if (isNaN(reactionTimeValue)){
            newErrors.reactionTime = "Debe ser un número válido"
          } else if (reactionTimeValue <= 0) {
            newErrors.reactionTime= "Debe ser mayor a 0"
          }
        }
    }
  

    // Validar Calores de reaccion 
    const heatReactionValue = (value: string, fieldName: keyof ReactorParameters) => {
        const num = Number.parseFloat(value)
        if (isNaN(num)) {
          newErrors[fieldName] = "Debe ser un número válido"
        } 
    }
      
    if(equilibriumMethod==="vanthoff"){heatReactionValue(parameters.deltaHrxn, "deltaHrxn")}
    if(operationType==="non-isothermic"){heatReactionValue(parameters.reactionEnthalpy, "reactionEnthalpy")}

    setErrors(newErrors)
  return newErrors
}

// Validar cuando cambian los parámetros
useEffect(() => {
  if (validated) {
    validateFields()
  }
}, [parameters, validated])

// Validar cuando cambian los modos
useEffect(() => {
  setValidated(true)
  validateFields()
}, [operationType, isothermicMode, rateConstantMode, equilibriumMethod, energyMode])

  // Verificar si hay errores
  const hasErrors = Object.keys(errors).length > 0

  return { errors, hasErrors, validateFields }
}

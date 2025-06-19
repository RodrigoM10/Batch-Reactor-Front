"use client"

import { useToast } from "@/components/ui/use-toast"
import { useState } from "react"
import type { ReactorState } from "./use-reactor-parameters"

export interface SimulationResult {
  data: Array<{
    time: number
    conversion: number
    concentration?: number
    concentrationA?: number
    concentrationB?: number
    concentrationC?: number
    concentrationD?: number
    temperature: number
    rate?: number
    inverseRate?: number
    gibbs_energy?: number
    equilibrium?: number
    [key: string]: any
  }>
  additionalData?: {
    equilibriumConversion?: number
    reactionRate?: number
    finalTemperature?: number
    [key: string]: any
  }
  [key: string]: any
}

export function useSimulation() {
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [showResults, setShowResults] = useState(false)
  const [simulationResults, setSimulationResults] = useState<SimulationResult | null>(null)
  const [errorDetails, setErrorDetails] = useState<string | null>(null)

  // Nuevos estados para manejar la advertencia de equilibrio
  const [showEquilibriumWarning, setShowEquilibriumWarning] = useState(false)
  const [equilibriumData, setEquilibriumData] = useState<{
    targetConversion: string
    equilibriumConversion: number
    message: string
  } | null>(null)
  const [tempConversion, setTempConversion] = useState("")
  const [lastSubmittedState, setLastSubmittedState] = useState<ReactorState | null>(null)
  
  // Función para convertir los datos del formulario al formato requerido por el backend
  const prepareDataForBackend = (state: ReactorState) => {
    const {
      operationType,
      isothermicMode,
      energyMode,
      reactionOrder,
      reactionType,
      equilibriumMethod,
      volumeCalculate,
      productK,
      excessB,
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
    if (operationType==="isothermic" && volumeCalculate==="s") ans_volume = "s"
    else ans_volume = "n"

    //Seleccion de Producto de Interes
    let product_k = null
    if (productK === "C") product_k = "C"
    else if (productK === "D") product_k = "D"

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
    let K_det_value = null

    if (operationType === "isothermic") {
      if (rateConstantMode === "direct") {
        K_det_value = Number.parseFloat(parameters.directRateConstant)
        E_value = 0 // No se usa en modo directo
        A_value = 0 // No se usa en modo directo
      } else {
        A_value = Number.parseFloat(parameters.preExponentialFactor)
        E_value = Number.parseFloat(parameters.activationEnergy)
      }
    } else {
      // Para modo no isotérmico
      A_value = Number.parseFloat(parameters.preExponentialFactorT)
      E_value = Number.parseFloat(parameters.activationEnergyT)
    }

    let delta_H_value = null
    if(operationType === "non-isothermic") {
      delta_H_value = Number.parseFloat(parameters.reactionEnthalpy)
    } else if (equilibriumMethod ==="vanthoff"){
      delta_H_value = Number.parseFloat(parameters.deltaHrxn)
    }

    // Construir el objeto final
    const backendData = {
      mode_op: operationType === "isothermic" ? "isothermal" : "non-isothermal",
      k_eq_method: k_eq_method,
      K_eq_direct: equilibriumMethod === "direct" ? Number.parseFloat(parameters.ke) : null,
      K_det: K_det_value,
      T_iso: operationType === "isothermic" ? Number.parseFloat(parameters.temperature) : null,
      A: A_value,
      E: E_value,
      option: operationType==="isothermic" ? (isothermicMode === "x" ? "X" : "t"):null,
      X_A_desired: operationType==="isothermic" ? (isothermicMode === "x" ? Number.parseFloat(parameters.targetConversion) : null):null,
      t_reaction_det: operationType==="isothermic" ? ( isothermicMode === "t" ? Number.parseFloat(parameters.reactionTime) : null):null,
      C_A0: Number.parseFloat(parameters.initialConcentration),
      C_B0: Number.parseFloat(parameters.initialConcentrationB),
      C_C0: Number.parseFloat(parameters.initialConcentrationC),
      C_D0: Number.parseFloat(parameters.initialConcentrationD),
      reversible: reactionType === "reversible",
      C_I: operationType === "non-isothermic" ? Number.parseFloat(parameters.inertConcentration) : 0,
      order: Number.parseInt(reactionOrder),
      stoichiometry: stoichiometry,
      excess_B: excessB,
      ans_volume: ans_volume,
      P_k: operationType==="isothermic" ? (volumeCalculate === "s" ? Number.parseFloat(parameters.productionOfk) : null): null,
      t_mcd: operationType==="isothermic" ? (volumeCalculate === "s" ? Number.parseFloat(parameters.cdmTime) : null):null,
      product_k:operationType==="isothermic" ? ( volumeCalculate === "s" ? String(product_k): null):null,
      m_k: operationType==="isothermic" ? (volumeCalculate === "s" ? Number.parseFloat(parameters.molarMassK) : null):null,
      T_ref: Number.parseFloat(parameters.tRef),
      T0: operationType === "non-isothermic" ? Number.parseFloat(parameters.initialTemperature) : null,
      K_eq_ref: equilibriumMethod === "vanthoff" ? Number.parseFloat(parameters.keRef) : null,
      delta_H_rxn: delta_H_value,
      DG_dict: DG_dict,
      C_p_dict: operationType==="non-isothermic"? C_p_dict: null,
      mode_energy: operationType === "non-isothermic" ? energyMode : null,
      U: operationType === "non-isothermic" ? (energyMode === "icq" ? Number.parseFloat(parameters.heatTransferCoefficient) : null):null,
      A_ICQ: operationType === "non-isothermic" ? ( energyMode === "icq" ? Number.parseFloat(parameters.heatExchangeArea) : null): null,
      T_cool:operationType === "non-isothermic" ? ( energyMode === "icq" ? Number.parseFloat(parameters.coolingFluidTemperature) : null):null,
      Cp_ref:operationType === "non-isothermic" ? ( energyMode === "icq" ? Number.parseFloat(parameters.heatCapacityRef) : null):null,
      m_c: operationType === "non-isothermic" ? (energyMode === "icq" ? Number.parseFloat(parameters.fluidRateRef) : null):null, 
      // Solicitar datos para gráficas
      return_data_for_plots: true,
    }
    return backendData
  }
  
  // Función para enviar los datos al backend
  const sendFormToBackend = async (state: ReactorState) => {
    // Preparar los datos para el backend
    const backendData = prepareDataForBackend(state)
    console.log("Datos preparados para enviar:", JSON.stringify(backendData, null, 2))
    
    // Guardar el estado actual para posibles reenvíos
    setLastSubmittedState(state)
    
    // Mostrar indicador de carga
    setIsLoading(true)
    setErrorDetails(null)

    try {
      // Enviar datos al backend
      const response = await fetch("/api/simulate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(backendData),
      })

      // Obtener la respuesta como texto primero para poder loggearla
      const responseText = await response.text()

      // Intentar parsear la respuesta como JSON
      let result
      try {
        result = JSON.parse(responseText)
      } catch (e) {
        console.error("Error al parsear la respuesta como JSON:", e)
        throw new Error(`Respuesta no válida: ${responseText}`)
      }

      if (!response.ok) {
        console.error("Error en la respuesta:", result)
        setErrorDetails(result.details || result.error || "Error desconocido")
        throw new Error(`Error en la respuesta: ${response.status}`)
      }
      
      // Verificar si hay una advertencia de equilibrio
      if (result.warning && result.message && result.message.includes("excede la conversión de equilibrio")) {
        // Extraer datos de equilibrio
        const equilibriumConversion = result.additionalData?.equilibriumConversion || result.summary?.X_eq || 0
        const targetConversion = result.additionalData?.targetConversion || state.parameters.targetConversion || "0.8"

        // Configurar datos para el diálogo de advertencia
        setEquilibriumData({
          targetConversion: targetConversion,
          equilibriumConversion: equilibriumConversion,
          message: result.message,
        })

        // Establecer la conversión temporal al valor de equilibrio (redondeado)
        setTempConversion((equilibriumConversion * 0.95).toFixed(4))

        // Mostrar el diálogo de advertencia
        setShowEquilibriumWarning(true)
        setIsLoading(false)
        return false
      }

       // Procesar la respuesta para asegurar que tiene el formato correcto
       const processedResult = processBackendResponse(result, state)
       // Guardar los resultados procesados
       setSimulationResults(processedResult)

      // Mostrar resultados
      setShowResults(true)

      toast({
        title: "Datos recibidos correctamente",
        description: "Los resultados de la simulación han sido procesados con éxito.",
      })

      return true
    } catch (error) {
      console.error("Error al enviar datos al backend:", error)

      toast({
        title: "Error en el envío",
        description: errorDetails || "No se pudieron enviar los datos al backend. Por favor, intente nuevamente.",
        variant: "destructive",
      })

      return false
    } finally {
      setIsLoading(false)
    }
  }

  // Función para ajustar la conversión y reenviar
  const adjustConversionAndResubmit = async () => {
    if (!lastSubmittedState || !tempConversion) return false

    // Crear una copia del último estado enviado
    const newState = JSON.parse(JSON.stringify(lastSubmittedState))

    // Actualizar la conversión objetivo
    newState.parameters.targetConversion = tempConversion

    // Cerrar el diálogo de advertencia
    setShowEquilibriumWarning(false)

    // Reenviar con la nueva conversión
    return await sendFormToBackend(newState)
  }

   // Modificar la función processBackendResponse para manejar correctamente la estructura de datos
   const processBackendResponse = (response: any, state?: ReactorState): SimulationResult => {{

    // Si no hay datos o la respuesta indica error
    if (!response || response.success === false) {
      return {
        data: [],
        additionalData: {},
      }
    } 

     // Extraer los datos directamente de la respuesta
     const data = response.data || []
     const additionalData = response.additionalData || {}
     const summary = response.summary || {}

     // Combinar additionalData con summary para asegurar que tenemos todos los datos
     const combinedAdditionalData = {
       ...additionalData,
       finalConversion: additionalData.finalConversion || summary.X_A_final,
       finalTemperature: additionalData.finalTemperature || summary.T_final,
       reactionTime: additionalData.reactionTime || summary.t_final,
       reactionRate: additionalData.reactionRate || summary.k_final,
       volume: additionalData.volume || summary.volume,
     }
 
      // Si ya tenemos un array de datos procesados, necesitamos asegurarnos de que tengan todos los campos necesarios
     if (Array.isArray(data) && data.length > 0 && typeof data[0] === "object") {
      console.log("Procesando datos ya estructurados:", data.length)

      // Verificar si necesitamos añadir datos de concentración
      const needsConcentrationData =
        !data[0].hasOwnProperty("concentrationA") && !data[0].hasOwnProperty("concentration")

      // Verificar si necesitamos añadir datos de inverse rate
      const needsInverseRateData =
        state?.operationType === "isothermic" && combinedAdditionalData.volume && !data[0].hasOwnProperty("inverseRate")

      // Si no necesitamos añadir datos adicionales, devolver los datos tal cual
      if (!needsConcentrationData && !needsInverseRateData) {
        return {
          data: data,
          additionalData: combinedAdditionalData,
        }
      }

      // Si necesitamos añadir datos, procesarlos
      const processedData = data.map((point, index) => {
        const newPoint = { ...point }

        // Añadir datos de concentración si es necesario
        if (needsConcentrationData) {
          const initialConcentration = state?.parameters.initialConcentration
            ? Number.parseFloat(state.parameters.initialConcentration)
            : 1.0
          newPoint.concentrationA = initialConcentration * (1 - point.conversion)
          newPoint.concentration = newPoint.concentrationA

          // Calcular concentraciones de otros componentes basados en la estequiometría
          if (state?.parameters) {
            const coeffA = Number.parseFloat(state.parameters.coefficientA)
            const coeffB = Number.parseFloat(state.parameters.coefficientB)
            const coeffC = Number.parseFloat(state.parameters.coefficientC)
            const coeffD = Number.parseFloat(state.parameters.coefficientD)

            if (coeffB !== 0) {
              newPoint.concentrationB = initialConcentration * (1 - (coeffB / coeffA) * point.conversion)
            }

            if (coeffC !== 0) {
              newPoint.concentrationC = initialConcentration * ((coeffC / Math.abs(coeffA)) * point.conversion)
            }

            if (coeffD !== 0) {
              newPoint.concentrationD = initialConcentration * ((coeffD / Math.abs(coeffA)) * point.conversion)
            }
          }
        }

        // Añadir datos de inverse rate si es necesario
        if (needsInverseRateData && point.conversion > 0) {
          // Calcular inverse rate basado en la conversión
          const k = combinedAdditionalData.reactionRate || 0.05
          const order = state?.reactionOrder === "1" ? 1 : 2
          const ca0 = state?.parameters.initialConcentration
            ? Number.parseFloat(state.parameters.initialConcentration)
            : 1.0

          if (order === 1) {
            // Para primer orden: 1/r = 1/(k*CA0*(1-X))
            newPoint.inverseRate = 1 / (k * ca0 * (1 - point.conversion))
          } else {
            // Para segundo orden: 1/r = 1/(k*CA0^2*(1-X)^2)
            newPoint.inverseRate = 1 / (k * Math.pow(ca0, 2) * Math.pow(1 - point.conversion, 2))
          }
        }

        return newPoint
      }) 

       return {
        data: processedData,
        additionalData: combinedAdditionalData,
       }
     }
 
     // Si llegamos aquí, necesitamos procesar los datos en el formato antiguo
     console.log("Procesando datos en formato antiguo")
 
     // Extraer arrays de datos (formato antiguo)
     const timePoints = data.t_eval || []
     const conversions = data.X_A_eval || []
     const equilibriumConversions = data.X_eq || []
     const temperatures = data.T_eval || []
     const coolingTemperatures = data.Ta2 || []
     const concentrationsData = data.concentrations || {}
     const ratesData = data.rates || []

    // Obtener valores iniciales para cálculos
    const initialConcentration = state?.parameters.initialConcentration
      ? Number.parseFloat(state.parameters.initialConcentration)
      : 1.0

    const coeffA = state?.parameters.coefficientA ? Number.parseFloat(state.parameters.coefficientA) : -1
    const coeffB = state?.parameters.coefficientB ? Number.parseFloat(state.parameters.coefficientB) : -1
    const coeffC = state?.parameters.coefficientC ? Number.parseFloat(state.parameters.coefficientC) : 1
    const coeffD = state?.parameters.coefficientD ? Number.parseFloat(state.parameters.coefficientD) : 0

    const reactionOrder = state?.reactionOrder === "1" ? 1 : 2
    const reactionRate = combinedAdditionalData.reactionRate || 0.05
 
     // Crear array de puntos de datos para las gráficas
     const processedData = timePoints.map((time: number, index: number) => {
       // Objeto base con tiempo y conversión
       const point: any = {
         time,
         conversion: conversions[index],
       }
 
       // Añadir temperatura si existe (modo no isotérmico)
       if (temperatures.length > 0) {
         point.temperature = temperatures[index]
       } else {
         // Para modo isotérmico, usar temperatura constante
         point.temperature = combinedAdditionalData.finalTemperature || 298.15
       }
 
       // Añadir temperatura de enfriamiento si existe (modo ICQ)
       if (coolingTemperatures.length > 0) {
         point.coolingTemperature = coolingTemperatures[index]
       }
 
       // Añadir conversión de equilibrio si existe
       if (equilibriumConversions.length > 0) {
         point.equilibrium = equilibriumConversions[index]
       } else if (typeof equilibriumConversions === "number") {
         point.equilibrium = equilibriumConversions
       }
 
       // Añadir concentraciones si existen
       if (concentrationsData && Object.keys(concentrationsData).length > 0) {
         // Verificar si concentrationsData es un objeto con arrays para cada componente
         if (concentrationsData.A && Array.isArray(concentrationsData.A)) {
           point.concentrationA = concentrationsData.A[index] || 0
           point.concentrationB = concentrationsData.B?.[index] || 0
           point.concentrationC = concentrationsData.C?.[index] || 0
           point.concentrationD = concentrationsData.D?.[index] || 0
         }
         // O si es un array de objetos
         else if (Array.isArray(concentrationsData) && concentrationsData[index]) {
           const conc = concentrationsData[index]
           point.concentrationA = conc.A || 0
           point.concentrationB = conc.B || 0
           point.concentrationC = conc.C || 0
           point.concentrationD = conc.D || 0
         } 
 
         // Calcular concentración total para la gráfica principal
         point.concentration = point.concentrationA || 0
       } else {
        // Si no hay datos de concentración, calcularlos a partir de la conversión
        point.concentrationA = initialConcentration * (1 - point.conversion)
        point.concentration = point.concentrationA

        // Calcular concentraciones de otros componentes basados en la estequiometría
        if (coeffB !== 0) {
          point.concentrationB = initialConcentration * (1 - (coeffB / coeffA) * point.conversion)
        }

        if (coeffC !== 0) {
          point.concentrationC = initialConcentration * ((coeffC / Math.abs(coeffA)) * point.conversion)
        }

        if (coeffD !== 0) {
          point.concentrationD = initialConcentration * ((coeffD / Math.abs(coeffA)) * point.conversion)
        }
      }

      // Añadir tasa de reacción si existe
      if (ratesData && ratesData.length > index) {
        point.rate = ratesData[index]
      }

      // Calcular inverse rate para modo isotérmico si se calcula el volumen
      if (state?.operationType === "isothermic" && combinedAdditionalData.volume && point.conversion > 0) {
        if (reactionOrder === 1) {
          // Para primer orden: 1/r = 1/(k*CA0*(1-X))
          point.inverseRate = 1 / (reactionRate * initialConcentration * (1 - point.conversion))
        } else {
          // Para segundo orden: 1/r = 1/(k*CA0^2*(1-X)^2)
          point.inverseRate = 1 / (reactionRate * Math.pow(initialConcentration, 2) * Math.pow(1 - point.conversion, 2))
        }
      }

       return point
     })
 
  return {
    data: processedData.length > 0 ? processedData : [],
    additionalData: combinedAdditionalData,
  }
}
}


// Función para usar datos de prueba (solo para desarrollo)
const useMockData = (state: ReactorState) => {
  setIsLoading(true)
  setErrorDetails(null)

  // Simular un retraso de red
  setTimeout(() => {
    // Crear un conjunto mínimo de datos para pruebas
    const mockData = {
      data: [
        {
          time: 0,
          conversion: 0,
          concentration: 1.0,
          temperature: 298.15,
          rate: 0.05,
        },
        {
          time: 10,
          conversion: 0.4,
          concentration: 0.6,
          temperature: 308.15,
          rate: 0.03,
        },
        {
          time: 20,
          conversion: 0.7,
          concentration: 0.3,
          temperature: 318.15,
          rate: 0.015,
        },
      ],
      additionalData: {
        equilibriumConversion: 0.95,
        reactionRate: 0.05,
        finalTemperature: 318.15,
        volume: 10.5, // Añadir volumen para probar inverse rate
      },
    }

    // Procesar los datos de prueba
    const processedResult = processBackendResponse(mockData, state)
    setSimulationResults(processedResult)
    setShowResults(true)
    setIsLoading(false)

    toast({
      title: "Datos de prueba generados",
      description: "Se han generado datos mínimos de prueba para desarrollo.",
    })
  }, 1000)

  return true
}

  return {
    isLoading,
    showResults,
    simulationResults,
    sendFormToBackend,
    useMockData,
    errorDetails,
    showEquilibriumWarning,
    setShowEquilibriumWarning,
    equilibriumData,
    tempConversion,
    setTempConversion,
    adjustConversionAndResubmit,
  }
}

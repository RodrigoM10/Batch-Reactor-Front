import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const data = await request.json()
    console.log("Datos recibidos en la API:", JSON.stringify(data, null, 2))

    // Aquí puedes configurar la URL de tu backend de Python
    const backendUrl = "http://127.0.0.1:8000/simulate"

    if (!backendUrl) {
      console.error("Error: PYTHON_BACKEND_URL no está configurada")
      return NextResponse.json(
        { error: "La URL del backend no está configurada. Por favor, configure PYTHON_BACKEND_URL." },
        { status: 500 },
      )
    }
    console.log(`Enviando datos al backend: ${backendUrl}`)
    

    try {
      const response = await fetch(backendUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })
      // Verificar si la respuesta es exitosa
      if (!response.ok) {
       const errorText = await response.text()
       console.error(`Error en la respuesta del backend: ${response.status}`, errorText)
       return NextResponse.json(
         {
           error: `Error en la respuesta del backend: ${response.status}`,
           details: errorText,
         },
         { status: response.status },
       )
     }
     // Procesar la respuesta exitosa
     const result = await response.json()
     console.log("Respuesta exitosa del backend")
     // Asegurarse de que la respuesta tiene el formato esperado
     const processedResult = ensureResponseFormat(result)
 
     return NextResponse.json(processedResult)
    } catch (fetchError){
      // Capturar errores de conexión con el backend
      console.error("Error al conectar con el backend:", fetchError)
      return NextResponse.json(
        {
          error: "Error al conectar con el backend Python",
          details: fetchError instanceof Error ? fetchError.message : String(fetchError),
        },
        { status: 503 },
      )
    }

  } catch (error) {
    // Capturar errores generales en el procesamiento de la solicitud
    console.error("Error al procesar la solicitud:", error)
    return NextResponse.json(
      {
        error: "Error al procesar la solicitud",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    )
  }
}
// Modificar la función ensureResponseFormat para asegurar que devuelve los datos en el formato correct
// Capturar y pasar el mensaje de advertencia
function ensureResponseFormat(result: any) {
  console.log("Procesando resultado del backend:", result)
  // Si el backend devuelve un formato diferente, adaptarlo aquí
  const formattedResult: any = {
    success: result.success || false,
    message: result.message || "",
    warning: result.warning || false,
    additionalData: {},
    data: [],
  }


  // Extraer datos del resumen
  if (result.summary) {
    formattedResult.additionalData = {
      ...formattedResult.additionalData,
      finalConversion: result.summary.X_A_final,
      finalTemperature: result.summary.T_final,
      reactionTime: result.summary.t_final,
      reactionRate: result.summary.k_final,
      volume: result.summary.volume,
      // Añadir datos de equilibrio si existen
      equilibriumConversion: result.summary.X_eq,
      targetConversion: result.summary.X_A_desired,
    }
  }
  
  // Si hay una advertencia de equilibrio pero no hay datos, devolver el resultado formateado
  if (result.warning && Object.keys(result.data || {}).length === 0) {
    return formattedResult
  }

  // Procesar datos para las gráficas
  if (result.data) {
    const data = result.data
    const timePoints = data.t_eval || []
    const conversions = data.X_A_eval || []
    const equilibriumConversions = data.X_eq || []
    const temperatures = data.T_eval || []
    const coolingTemperatures = data.Ta2 || []
    const concentrations = data.concentrations || {}
    const heatGeneratedArray = data.Qgb_eval || []
    const heatRemovedArray = data.Qrb_eval || []

    // Crear array de puntos de datos para las gráficas
    const processedData = []

    for (let i = 0; i < timePoints.length; i++) {
      const point: any = {
        time: timePoints[i],
        conversion: conversions[i],
      }

      // Añadir temperatura si existe
      if (temperatures.length > 0) {
        point.temperature = temperatures[i]
      } else if (result.summary && result.summary.T_final) {
        point.temperature = result.summary.T_final
      } else {
        point.temperature = 298.15 // Valor por defecto
      }

      // Añadir temperatura de enfriamiento si existe
      if (coolingTemperatures.length > 0) {
        point.coolingTemperature = coolingTemperatures[i]
      }

      // Añadir conversión de equilibrio si existe
      if (equilibriumConversions.length > 0) {
        point.equilibrium = equilibriumConversions[i]
      } else if (typeof equilibriumConversions === "number") {
        point.equilibrium = equilibriumConversions
      }

      // Añadir concentraciones si existen
      if (concentrations) {
        // Verificar el formato de las concentraciones
        if (concentrations.A && Array.isArray(concentrations.A)) {
          point.concentrationA = concentrations.A[i] || 0
          point.concentrationB = concentrations.B?.[i] || 0
          point.concentrationC = concentrations.C?.[i] || 0
          point.concentrationD = concentrations.D?.[i] || 0
          point.concentration = concentrations.A[i] || 0 // Usar concentración de A como principal
        } else if (Array.isArray(concentrations) && concentrations[i]) {
          const conc = concentrations[i]
          point.concentrationA = conc.A || 0
          point.concentrationB = conc.B || 0
          point.concentrationC = conc.C || 0
          point.concentrationD = conc.D || 0
          point.concentration = conc.A || 0
        }
      }

      // Añadir tasas de calor si existen
      if (heatGeneratedArray.length > i) {
            point.heatGenerated = heatGeneratedArray[i]
      }
      if (heatRemovedArray.length > i) {
            point.heatRemoved = heatRemovedArray[i]
      }

      processedData.push(point)
    }

    formattedResult.data = processedData

    // Guardar datos originales para cálculos específicos
    formattedResult.additionalData.rawData = {
      timePoints,
      conversions,
      equilibriumConversions,
      temperatures,
      coolingTemperatures,
      concentrations,
      heatGeneratedArray,
      heatRemovedArray,
    }
  }

  console.log("Datos procesados:", formattedResult.data.length)

  return formattedResult
}
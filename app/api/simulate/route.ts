import { NextResponse } from "next/server"
import {
  BackendResponse,
  FormattedResult,
  ProcessedPoint,
  BackendSummary,
  BackendConcentrations,
  BackendData,
} from "./interfaces/backend" 

export async function POST(request: Request) {
  try {
    const data: Record<string, unknown> = await request.json()
    const backendUrl = "http://127.0.0.1:8000/simulate"

    if (!backendUrl) {
      console.error("Error: PYTHON_BACKEND_URL no está configurada")
      return NextResponse.json(
        {
          error:
            "La URL del backend no está configurada. Por favor, configure PYTHON_BACKEND_URL.",
        },
        { status: 500 },
      )
    }

    try {
      const response = await fetch(backendUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })
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

      const result: BackendResponse = await response.json()
      const processedResult: FormattedResult = ensureResponseFormat(result)

      return NextResponse.json(processedResult)
    } catch (fetchError) {
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

function ensureResponseFormat(result: BackendResponse): FormattedResult {
  const formattedResult: FormattedResult = {
    success: result.success || false,
    message: result.message || "",
    warning: result.warning || false,
    additionalData: {},
    data: [],
  }

  if (result.summary) {
    formattedResult.additionalData = {
      ...formattedResult.additionalData,
      finalConversion: result.summary.X_A_final,
      finalTemperature: result.summary.T_final,
      reactionTime: result.summary.t_final,
      reactionRate: result.summary.k_final,
      volume: result.summary.volume,
      equilibriumConversion: result.summary.X_eq,
      targetConversion: result.summary.X_A_desired,
    }
  }

  if (result.warning && Object.keys(result.data || {}).length === 0) {
    return formattedResult
  }

  if (result.data) {
    const data = result.data
    const timePoints = data.t_eval || []
    const conversions = data.X_A_eval || []
    const equilibriumConversions = Array.isArray(data.X_eq)
      ? data.X_eq
      : data.X_eq !== undefined
        ? [data.X_eq]
        : []
    const temperatures = data.T_eval || []
    const coolingTemperatures = data.Ta2 || []
    const concentrations = data.concentrations
    const heatGeneratedArray = data.Qgb_eval || []
    const heatRemovedArray = data.Qrb_eval || []
    const processedData: ProcessedPoint[] = []

    for (let i = 0; i < timePoints.length; i++) {
      const point: ProcessedPoint = {
        time: timePoints[i],
        conversion: conversions[i],
      }

      if (temperatures.length > 0) {
        point.temperature = temperatures[i]
      } else if (result.summary && result.summary.T_final) {
        point.temperature = result.summary.T_final
      } else {
        point.temperature = 298.15
      }

      if (coolingTemperatures.length > 0) {
        point.coolingTemperature = coolingTemperatures[i]
      }

      if (equilibriumConversions.length > 0) {
        point.equilibrium = equilibriumConversions[i]
      } else if (typeof data.X_eq === "number") {
        point.equilibrium = data.X_eq
      }

      if (concentrations) {
        if (concentrations.A && Array.isArray(concentrations.A)) {
          point.concentrationA = concentrations.A[i] || 0
          point.concentrationB = concentrations.B?.[i] || 0
          point.concentrationC = concentrations.C?.[i] || 0
          point.concentrationD = concentrations.D?.[i] || 0
          point.concentration = concentrations.A[i] || 0
        }
      }

      if (heatGeneratedArray.length > i) {
        point.heatGenerated = heatGeneratedArray[i]
      }
      if (heatRemovedArray.length > i) {
        point.heatRemoved = heatRemovedArray[i]
      }

      processedData.push(point)
    }

    formattedResult.data = processedData

    formattedResult.additionalData.rawData = {
      timePoints,
      conversions,
      equilibriumConversions: equilibriumConversions.map((val) => val),
      temperatures: temperatures.map((val) => val),
      coolingTemperatures: coolingTemperatures.map((val) => val),
      concentrations,
      heatGeneratedArray: heatGeneratedArray.map((val) => val),
      heatRemovedArray: heatRemovedArray.map((val) => val),
    }
  }

  return formattedResult
}
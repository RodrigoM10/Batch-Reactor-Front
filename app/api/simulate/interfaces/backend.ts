
export interface BackendSummary {
  X_A_final: number
  T_final: number
  t_final: number
  k_final: number
  volume: number
  X_eq: number
  X_A_desired: number
}

export interface BackendConcentrations {
  A?: number[]
  B?: number[]
  C?: number[]
  D?: number[]
}

export interface BackendData {
  t_eval?: number[]
  X_A_eval?: number[]
  X_eq?: number[] | number // Puede ser un array o un número
  T_eval?: number[]
  Ta2?: number[]
  concentrations?: BackendConcentrations
  Qgb_eval?: number[]
  Qrb_eval?: number[]
}

export interface BackendResponse {
  success: boolean
  message: string
  warning: boolean
  summary?: BackendSummary
  data?: BackendData
}

export interface ProcessedPoint {
  time: number
  conversion: number
  temperature?: number
  coolingTemperature?: number
  equilibrium?: number
  concentrationA?: number
  concentrationB?: number
  concentrationC?: number
  concentrationD?: number
  concentration?: number
  heatGenerated?: number
  heatRemoved?: number
}

export interface FormattedAdditionalData {
  finalConversion?: number
  finalTemperature?: number
  reactionTime?: number
  reactionRate?: number
  volume?: number
  equilibriumConversion?: number
  targetConversion?: number
  rawData?: {
    timePoints: number[]
    conversions: number[]
    equilibriumConversions: (number | undefined)[]
    temperatures: (number | undefined)[]
    coolingTemperatures: (number | undefined)[]
    concentrations: BackendConcentrations | undefined
    heatGeneratedArray: (number | undefined)[]
    heatRemovedArray: (number | undefined)[]
  }
}

export interface FormattedResult {
  success: boolean
  message: string
  warning: boolean
  additionalData: FormattedAdditionalData
  data: ProcessedPoint[]
}
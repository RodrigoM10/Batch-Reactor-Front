"use client"

import { Sparkles, ArrowRight } from "lucide-react"

// Aviso de la versión 2.0. Solo se muestra si NEXT_PUBLIC_V2_URL está configurada.
const V2_URL = process.env.NEXT_PUBLIC_V2_URL

export function V2Banner() {
  if (!V2_URL) return null

  return (
    <a
      href={V2_URL}
      target="_blank"
      rel="noreferrer"
      className="mb-6 flex items-center gap-3 rounded-lg border border-cyan-500/40 bg-cyan-500/10 px-4 py-3 text-sm transition-colors hover:bg-cyan-500/20"
    >
      <Sparkles className="h-5 w-5 shrink-0 text-cyan-400" />
      <span className="flex-1">
        <span className="font-semibold">Versión 2.0 disponible:</span> reversionada con nuevas tecnologías, simulación
        en tiempo real, funciones generalizadas y nuevas herramientas de análisis.
      </span>
      <ArrowRight className="h-4 w-4 shrink-0" />
    </a>
  )
}

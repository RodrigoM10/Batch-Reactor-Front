"use client"

export function Footer() {
  return (
    <footer className="mt-12 py-6 border-t border-slate-600 bg-black backdrop-blur-sm">
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center justify-center space-y-2">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
            <p className="text-slate-300 text-sm">
              © 2025 <span className="font-medium text-white">Rodrigo Mendoza</span>
            </p>
            <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
          </div>
          <p className="text-slate-400 text-xs">Simulador de Reactores Batch  - Herramienta avanzada de Ingeniería Química</p>
        </div>
      </div>
    </footer>
  )
}

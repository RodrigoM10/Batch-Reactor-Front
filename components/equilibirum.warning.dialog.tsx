"use client"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { AlertTriangle, Loader2 } from "lucide-react"

interface EquilibriumWarningDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  targetConversion: string
  equilibriumConversion: number
  tempConversion: string
  onTempConversionChange: (value: string) => void
  onAdjust: () => void
  isLoading: boolean
}

export function EquilibriumWarningDialog({
  open,
  onOpenChange,
  targetConversion,
  equilibriumConversion,
  tempConversion,
  onTempConversionChange,
  onAdjust,
  isLoading,
}: EquilibriumWarningDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-amber-600">
            <AlertTriangle className="h-5 w-5" />
            Advertencia de Equilibrio Químico
          </DialogTitle>
          <DialogDescription>
            La conversión objetivo ({targetConversion}) supera la conversión de equilibrio calculada (
            {equilibriumConversion.toFixed(4)}).
            <br />
            La reacción no puede superar la conversión de equilibrio termodinámico.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="adjustedConversion">Ajustar conversión objetivo:</Label>
            <Input
              id="adjustedConversion"
              value={tempConversion}
              onChange={(e) => onTempConversionChange(e.target.value)}
            />
            <p className="text-sm text-gray-500">
              Se recomienda usar un valor igual o menor a la conversión de equilibrio.
            </p>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button onClick={onAdjust} disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                Procesando...
              </>
            ) : (
              "Ajustar y Continuar"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

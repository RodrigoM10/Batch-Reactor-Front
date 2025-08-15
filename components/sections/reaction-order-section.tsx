"use client"

import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import type { ReactionOrder, ExcessB } from "@/hooks/use-reactor-parameters"
import { Switch } from "@/components/ui/switch" // Asegúrate de que Label también está importado si no lo estaba.

interface ReactionOrderSectionProps {
  reactionOrder: ReactionOrder
  excessB: ExcessB
  coefficientB: string
  onReactionOrderChange: (value: ReactionOrder) => void
  onExcessBChange: (value: ExcessB) => void
}

export function ReactionOrderSection({
    reactionOrder,
    excessB,
    coefficientB,
    onReactionOrderChange,
    onExcessBChange,
  }: ReactionOrderSectionProps) {

  return (
    <div className="space-y-4">
      <h3 className="font-medium text-lg">Orden de Reacción</h3>
      <div className="bg-gray-50 p-4 rounded-md mb-4">
        <p className="text-sm text-gray-600">
          Seleccionar el orden de reacción. Esto afecta la velocidad de reacción usada en la simulación.
        </p>
      </div>

      <div className="flex items-center space-x-8"> 
        <RadioGroup
          value={reactionOrder}
          onValueChange={(value) => onReactionOrderChange(value as ReactionOrder)}
          className="flex space-x-8" 
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="1" id="order-1" />
            <Label htmlFor="order-1">Primer Orden</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="2" id="order-2" />
            <Label htmlFor="order-2">Segundo Orden</Label>
          </div>
        </RadioGroup>
        {reactionOrder === "2" && coefficientB !== "0" && (
          <div className="flex items-center space-x-2"> 
            <Label
              htmlFor="excess_b_switch"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-nowrap"
            >
              Pseudo-primer orden
            </Label>
            <Switch
              id="excess_b_switch"
              checked={excessB}
              onCheckedChange={(checked) => onExcessBChange(checked)} 
            />
          </div>
        )}
      </div>
    </div>
  )
}
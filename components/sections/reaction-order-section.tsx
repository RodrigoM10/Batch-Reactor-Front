"use client"

import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import type { ReactionOrder } from "@/hooks/use-reactor-parameters"

interface ReactionOrderSectionProps {
  reactionOrder: ReactionOrder
  onReactionOrderChange: (value: ReactionOrder) => void
}

export function ReactionOrderSection({ reactionOrder, onReactionOrderChange }: ReactionOrderSectionProps) {
  return (
    <div className="space-y-4">
      <h3 className="font-medium text-lg">Orden de Reacción</h3>
      <div className="bg-gray-50 p-4 rounded-md mb-4">
        <p className="text-sm text-gray-600">
          Seleccionar el orden de reacción. Esto afecta la velocidad de reacción usada en la simulación.
        </p>
      </div>

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
    </div>
  )
}

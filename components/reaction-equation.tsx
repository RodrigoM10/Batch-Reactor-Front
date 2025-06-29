import { Label } from "@/components/ui/label"
import { ReactionType } from "@/hooks/use-reactor-parameters"

interface ReactionEquationProps {
  reactionType: ReactionType
  coefficientA: string
  coefficientB: string
  coefficientC: string
  coefficientD: string
}

export function ReactionEquation({reactionType, coefficientA, coefficientB, coefficientC, coefficientD }: ReactionEquationProps) {
  const generateReactionEquation = () => {
    const coefficients = {
      A: Number.parseFloat(coefficientA),
      B: Number.parseFloat(coefficientB),
      C: Number.parseFloat(coefficientC),
      D: Number.parseFloat(coefficientD),
    }

    const reactants: string[] = []
    const products: string[] = []

    Object.entries(coefficients).forEach(([component, coefficient]) => {
      if (coefficient === 0) return

      if (coefficient < 0) {
        const absCoeff = Math.abs(coefficient)
        reactants.push(absCoeff === 1 ? component : `${absCoeff}${component}`)
      } else {
        products.push(coefficient === 1 ? component : `${coefficient}${component}`)
      }
    })

    if (reactants.length === 0) reactants.push("?")
    if (products.length === 0) products.push("?")

    const reactantStr = reactants.join(" + ")
    const productStr = products.join(" + ")

    const finalReaction = reactionType === "reversible" ? `${reactantStr} ⇌ ${productStr}` :`${reactantStr} → ${productStr}`

    return   finalReaction             
  }

  return (
    <div className="p-4 bg-gray-50 rounded-md flex flex-col items-center">
      <Label className="mb-2 text-sm text-gray-600">Ecuación de la Reacción:</Label>
      <div className="text-lg font-medium">{generateReactionEquation()}</div>
    </div>
  )
}

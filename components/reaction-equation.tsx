import { Label } from "@/components/ui/label"

interface ReactionEquationProps {
  coefficientA: string
  coefficientB: string
  coefficientC: string
  coefficientD: string
}

export function ReactionEquation({ coefficientA, coefficientB, coefficientC, coefficientD }: ReactionEquationProps) {
  const generateReactionEquation = () => {
    const coefficients = {
      A: Number.parseFloat(coefficientA),
      B: Number.parseFloat(coefficientB),
      C: Number.parseFloat(coefficientC),
      D: Number.parseFloat(coefficientD),
    }

    const reactants: string[] = []
    const products: string[] = []

    // Process each component
    Object.entries(coefficients).forEach(([component, coefficient]) => {
      // Skip if coefficient is 0
      if (coefficient === 0) return

      // Determine if it's a reactant or product
      if (coefficient < 0) {
        // Reactant (make coefficient positive for display)
        const absCoeff = Math.abs(coefficient)
        reactants.push(absCoeff === 1 ? component : `${absCoeff}${component}`)
      } else {
        // Product
        products.push(coefficient === 1 ? component : `${coefficient}${component}`)
      }
    })

    // If no reactants or products, show a placeholder
    if (reactants.length === 0) reactants.push("?")
    if (products.length === 0) products.push("?")

    // Join with plus signs
    const reactantStr = reactants.join(" + ")
    const productStr = products.join(" + ")

    // Return the full equation
    return `${reactantStr} → ${productStr}`
  }

  return (
    <div className="p-4 bg-gray-50 rounded-md flex flex-col items-center">
      <Label className="mb-2 text-sm text-gray-600">Ecuación de la Reacción:</Label>
      <div className="text-lg font-medium">{generateReactionEquation()}</div>
    </div>
  )
}

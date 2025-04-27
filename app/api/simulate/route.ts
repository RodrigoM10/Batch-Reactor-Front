import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const data = await request.json()

    // Aquí puedes configurar la URL de tu backend de Python
    const backendUrl = "http://127.0.0.1:8000/simulate"
    console.log("👉 JSON que se envía al backend:", data);
    const response = await fetch(backendUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      throw new Error(`Error en la respuesta del backend: ${response.status}`)
    }

    const result = await response.json()
    return NextResponse.json(result)
  } catch (error) {
    console.error("Error al comunicarse con el backend:", error)
    return NextResponse.json({ error: "Error al procesar la solicitud" }, { status: 500 })
  }
}
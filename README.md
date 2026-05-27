# ⚛️ Batch Reactor -> https://batch-reactor-front.vercel.app/

Interfaz gráfica desarrollada en Next.js + React para el simulador de reactores batch (TAD - Tanque Agitado Discontinuo). Permite ingresar los parámetros de simulación, elegir el modo de operación (isotérmico o no isotérmico) y visualizar los resultados mediante gráficos interactivos.

## 🚀 ¿Qué hace esta interfaz?

- Recibe parámetros cinéticos, estequiométricos y de operación del usuario
- Se comunica con el backend vía API (FastAPI)
- Muestra los resultados de la simulación en gráficos dinámicos
- Brinda una experiencia de uso clara y amigable

## 🔗 Repositorio del backend

Este frontend está diseñado para funcionar junto al backend disponible aquí:  
👉 [Batch-Reactor-Back](https://github.com/RodrigoM10/Batch-Reactor-Simulate)

Asegurate de que el backend esté ejecutándose en `http://localhost:8000` (o la URL configurada).

## ⚙️ Cómo ejecutar el proyecto

1. Cloná el repositorio:
```bash
git clone https://github.com/RodrigoM10/Batch-Reactor-Front.git
cd Batch-Reactor-Front
```
2. Instalá las dependencias:
```bash
npm install
```
3. Ejecutá el servidor de desarrollo:
```bash
npm run dev
```
4. Abrí tu navegador en http://localhost:3000
   
🧪 Simulación
Desde la interfaz podés:

Seleccionar modo isotérmico o no isotérmico

Ingresar tipo de reacción, orden, constantes, temperatura, etc.

Visualizar resultados: conversión, temperatura, concentraciones, volumen del reactor y más

🧑‍💻 Autor
Rodrigo Mendoza
Ingeniero Químico - Desarrollador
🔗 [LinkedIn](https://www.linkedin.com/in/rodrigo-mendoza-b8b6931a4/)

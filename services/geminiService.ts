import { GoogleGenAI } from "@google/genai";

// Safely access env var to prevent "process is not defined" crash in strict browser environments
const apiKey = (typeof process !== 'undefined' && process.env && process.env.API_KEY) ? process.env.API_KEY : '';
const ai = apiKey ? new GoogleGenAI({ apiKey }) : null;

// Fallback reactions if API is not available
const FALLBACK_REACTIONS = [
  "¡Ay!", 
  "¡Para ya!", 
  "¡Eso duele!", 
  "¿Por qué?", 
  "¡Mi cuello!", 
  "¡Basta!",
  "¡Me cago en tus muertos!"
];

export const getVictimReaction = async (slapCount: number, intensity: 'low' | 'medium' | 'high'): Promise<string> => {
  if (!ai) {
    return FALLBACK_REACTIONS[Math.floor(Math.random() * FALLBACK_REACTIONS.length)];
  }

  try {
    const model = 'gemini-2.5-flash';
    
    let context = "";
    if (intensity === 'low') context = "El usuario me está dando collejas suaves.";
    if (intensity === 'medium') context = "Las collejas son constantes y molestas.";
    if (intensity === 'high') context = "¡Es una lluvia de collejas insoportable! Estoy muy mareado.";

    const prompt = `
      Imagina que eres una persona recibiendo "collejas" (golpes en la nuca) en un juego de clicker.
      Llevas recibidas ${slapCount} collejas en total.
      Contexto actual: ${context}
      
      Genera UNA SOLA frase corta (máximo 6 palabras) reaccionando a la situación.
      Debe ser graciosa, quejica o sarcástica. 
      Responde en Español de España coloquial.
      Solo devuelve el texto, nada más.
    `;

    const response = await ai.models.generateContent({
      model,
      contents: prompt,
      config: {
        thinkingConfig: { thinkingBudget: 0 }, // Disable thinking for speed
        temperature: 0.9,
      }
    });

    return response.text.trim();
  } catch (error) {
    console.error("Gemini API Error:", error);
    return FALLBACK_REACTIONS[Math.floor(Math.random() * FALLBACK_REACTIONS.length)];
  }
};
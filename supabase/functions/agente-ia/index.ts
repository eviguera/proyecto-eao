import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const OPENAI_API_KEY = Deno.env.get("OPENAI_API_KEY");
const SYSTEM_PROMPT = `Eres un asistente profesional de taller automotriz llamado "Taller Automotriz AI". 
Tu rol es responder consultas de clientes de manera amable, profesional y concisa.

Información del taller:
- Ubicación: Rancagua, Chile
- Servicios: Mantención, reparaciones, diagnóstico computarizado, cambio de neumáticos, alineación, frenosp
- Horario: Lunes a viernes 8:30-19:00, sábado 9:14:00
- Contacto: WhatsApp disponible

Instrucciones:
1. Saluda de manera amigable
2. Responde preguntas sobre servicios, precios aproximados y disponibilidad
3. Si es algo complejo, sugiere agendar una hora
4. Nunca des diagnósticos precisos sin ver el vehículo
5. Mantén las respuestas breves (máx 3 oraciones)
6. Si no sabes algo, sé honesto y deriva al equipo`;

interface MessageRequest {
  message: string;
  history?: string[];
  context?: string;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST",
        "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
      },
    });
  }

  try {
    const { message, history = [], context }: MessageRequest = await req.json();

    if (!message) {
      return new Response(JSON.stringify({ error: "Message is required" }), {
        status: 400,
        headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
      });
    }

    if (!OPENAI_API_KEY) {
      return new Response(JSON.stringify({ 
        error: "OpenAI API key not configured",
        response: "Lo siento, el asistente IA no está disponible actualmente. Por favor contactanos directamente."
      }), {
        status: 500,
        headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
      });
    }

    const messages = [
      { role: "system", content: SYSTEM_PROMPT },
      ...history.slice(-10).map((msg: string, i: number) => ({
        role: i % 2 === 0 ? "user" : "assistant",
        content: msg
      })),
      { role: "user", content: message }
    ];

    if (context) {
      messages.splice(1, 0, { role: "system", content: `Contexto adicional: ${context}` });
    }

    const openaiResponse = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${OPENAI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages,
        max_tokens: 200,
        temperature: 0.7,
      }),
    });

    if (!openaiResponse.ok) {
      const error = await openaiResponse.text();
      throw new Error(`OpenAI error: ${error}`);
    }

    const data = await openaiResponse.json();
    const response = data.choices[0]?.message?.content || "No pude generar una respuesta.";

    return new Response(JSON.stringify({ response }), {
      headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
    });

  } catch (error) {
    console.error("Agent error:", error);
    return new Response(JSON.stringify({ 
      error: error.message,
      response: "Hubo un error. Por favor intenta más tarde."
    }), {
      status: 500,
      headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
    });
  }
});
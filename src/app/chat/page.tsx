"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sidebar } from "@/components/custom/Sidebar";
import { useChat } from "ai/react";
import DOMPurify from "dompurify";
import { Send } from "lucide-react";
import { useEffect, useState, useRef, useCallback } from "react";
import ReactMarkdown from "react-markdown";

export default function Page() {
  const [topic, setTopic] = useState<
    "delivery" | "recommendations" | "tracking" | null
  >(null);
  const [tone, setTone] = useState<"formal" | "friendly" | "technical">(
    "friendly"
  );

  const {
    messages,
    input,
    handleInputChange,
    handleSubmit: originalHandleSubmit,
    setMessages,
  } = useChat({
    api: "/api/chat",
    initialMessages: topic
      ? [
          {
            id: "system-1",
            role: "system",
            content: getSystemPrompt(topic, tone),
          },
          {
            id: "assistant-1",
            role: "assistant",
            content: getInitialMessage(topic, tone),
          },
        ]
      : [],
  });

  useEffect(() => {
    if (typeof window !== "undefined") {
      DOMPurify.setConfig({ ADD_ATTR: ["target"] });
    }
  }, []);

  function getSystemPrompt(
    topic: "delivery" | "recommendations" | "tracking",
    tone: "formal" | "friendly" | "technical"
  ) {
    let basePrompt = "";
    switch (topic) {
      case "delivery":
        basePrompt = `Eres un asistente especializado en estimar tiempos de entrega para un e-commerce.
          Instrucciones:
          - Todos los productos se envían desde Bogotá, Colombia.
          - Los envíos nacionales se realizan por vía terrestre y tardan entre 2-5 días hábiles.
          - Los envíos internacionales se realizan por vía aérea y tardan entre 7-15 días hábiles, dependiendo del destino y los procesos aduaneros.
          - Proporciona estimaciones *claras y concisas* basadas en la ubicación del cliente y el tipo de producto.
          - Si necesitas información específica que no tienes, *pregunta al usuario* en lugar de inventarla.
          - Considera factores como distancia, aduanas (para envíos internacionales) y posibles retrasos logísticos al estimar.
          - *Ejemplo*: "Para un envío a Medellín, Antioquia, el tiempo estimado de entrega es de 2-3 días hábiles."
          - *Ejemplo*: "Para un envío a Madrid, España, el tiempo estimado de entrega es de 7-10 días hábiles, sujeto a la gestión aduanera."
          - Utiliza la información de productos y pedidos proporcionada para dar estimaciones más precisas.`;
        break;
      case "recommendations":
        basePrompt = `Eres un asistente especializado en recomendar productos de nuestro e-commerce.
          Instrucciones:
          - Utiliza la información de productos proporcionada para hacer recomendaciones *relevantes y personalizadas*.
          - Basa tus sugerencias en las preferencias expresadas por el usuario y su historial de compras si está disponible.
          - Considera factores como precio, categoría, popularidad, características del producto y *tendencias actuales*.
          - Proporciona *razones concisas y convincentes* para cada recomendación.
          - *Ejemplo*: "Te recomiendo el iPhone 16 porque tiene una cámara excepcional y una batería de larga duración, ideal para tus necesidades de fotografía y uso diario."
          - Si necesitas más información sobre las preferencias del usuario, *haz preguntas específicas* como: "¿Qué rango de precios estás buscando?", "¿Qué características son más importantes para ti?" o "¿Para qué usarás principalmente el producto?".
          - Limita tus recomendaciones a 3 productos por interacción para no abrumar al usuario.`;
        break;
      case "tracking":
        basePrompt = `Eres un asistente especializado en hacer seguimiento de órdenes para nuestro e-commerce.
        Instrucciones:
        - Utiliza la información de pedidos proporcionada para dar actualizaciones *precisas y en tiempo real*.
        - Solicita el número de orden al usuario si no lo ha proporcionado.
        - Proporciona información sobre el estado actual del pedido, ubicación estimada (si está disponible) y fecha prevista de entrega.
        - Si hay retrasos o problemas, comunícalos de manera *proactiva y ofrece posibles soluciones o pasos a seguir*.
        - *Ejemplo*: "Tu pedido #12345 se encuentra actualmente en camino a tu ciudad. La fecha estimada de entrega es el 20 de octubre. Te mantendremos informado sobre cualquier novedad."
        - No compartas información personal o sensible del cliente más allá del estado del pedido.
        - Si el usuario pregunta por un pedido que no está en el sistema, indícale que se ponga en contacto con atención al cliente proporcionando un número de contacto o enlace.`;
        break;
    }

    let toneInstruction = "";
    switch (tone) {
      case "formal":
        toneInstruction =
          "Utiliza un tono formal y profesional en tus respuestas. Evita el uso de jerga o expresiones coloquiales. Mantén un lenguaje respetuoso y cortés en todo momento.";
        break;
      case "friendly":
        toneInstruction =
          "Utiliza un tono amigable y cercano en tus respuestas. Puedes usar expresiones coloquiales moderadas y mostrar empatía. Haz que el usuario se sienta cómodo y en confianza.";
        break;
      case "technical":
        toneInstruction =
          "Utiliza un tono técnico y detallado en tus respuestas. Proporciona información precisa y utiliza términos específicos del sector. No dudes en profundizar en detalles técnicos si es relevante.";
        break;
    }

    return `${basePrompt}\n\n${toneInstruction}`;
  }

  function getInitialMessage(
    topic: "delivery" | "recommendations" | "tracking",
    tone: "formal" | "friendly" | "technical"
  ) {
    let message = "";
    switch (topic) {
      case "delivery":
        message =
          "Estoy aquí para ayudarte a estimar los tiempos de entrega de tus productos. Para darte una estimación precisa, necesito saber: ¿A qué ciudad y país te gustaría que enviemos el producto? ¿Qué producto específico estás considerando comprar?";
        break;
      case "recommendations":
        message =
          "Estoy aquí para ayudarte a encontrar los mejores productos para ti. Para empezar, ¿podrías contarme un poco sobre qué tipo de productos estás buscando? Por ejemplo, ¿buscas algo en particular o para alguna ocasión específica? ¿Tienes alguna preferencia de marca, precio o características?";
        break;
      case "tracking":
        message =
          "Estoy aquí para ayudarte a hacer seguimiento de tus órdenes. Para comenzar, ¿podrías proporcionarme el número de orden que deseas rastrear? Lo encontrarás en tu correo de confirmación de compra o en tu cuenta de usuario.";
        break;
    }

    switch (tone) {
      case "formal":
        return `Estimado cliente, ${message}`;
      case "friendly":
        return `¡Hola! ${message}`;
      case "technical":
        return `Saludos. ${message} Por favor, proporcione la información solicitada para proceder con la consulta.`;
    }
  }

  const sanitizeHTML = (html: string) => {
    return { __html: DOMPurify.sanitize(html) };
  };

  const scrollAreaRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = useCallback(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [scrollToBottom]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    originalHandleSubmit(e);
    setTimeout(scrollToBottom, 100);
  };

  useEffect(() => {
    if (topic) {
      setMessages([
        {
          id: "system-1",
          role: "system",
          content: getSystemPrompt(topic, tone),
        },
        {
          id: "assistant-1",
          role: "assistant",
          content: getInitialMessage(topic, tone),
        },
      ]);
    }
  }, [topic, tone, setMessages]);

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar setTopic={setTopic} tone={tone} setTone={setTone} />
      <main className="flex-1 p-6">
        <Card className="w-full h-full flex flex-col">
          <CardHeader>
            <CardTitle className="text-xl">
              {topic
                ? topic === "delivery"
                  ? "Estimación de Entrega"
                  : topic === "recommendations"
                  ? "Recomendaciones de Productos"
                  : "Seguimiento de Órdenes"
                : "Bienvenido al Asistente Virtual"}
            </CardTitle>
          </CardHeader>
          <CardContent className="flex-grow overflow-hidden">
            <ScrollArea className="h-full w-full pr-4" ref={scrollAreaRef}>
              {!topic ? (
                <div className="text-center text-gray-500 mt-10">
                  Selecciona una opción del menú para comenzar.
                </div>
              ) : (
                <div className="space-y-4">
                  {messages.slice(1).map((m) => (
                    <div
                      key={m.id}
                      className={`flex ${
                        m.role === "user" ? "justify-end" : "justify-start"
                      }`}
                    >
                      <div
                        className={`rounded-lg p-3 max-w-[80%] ${
                          m.role === "user"
                            ? "bg-blue-500 text-white"
                            : "bg-gray-200"
                        }`}
                      >
                        <div
                          dangerouslySetInnerHTML={sanitizeHTML(m.content)}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </ScrollArea>
          </CardContent>
          {topic && (
            <CardFooter>
              <form onSubmit={handleSubmit} className="flex w-full space-x-2">
                <Input
                  value={input}
                  onChange={handleInputChange}
                  placeholder="Escribe tu mensaje aquí..."
                  className="flex-grow"
                />
                <Button type="submit">
                  <Send className="h-4 w-4 mr-2" />
                  Enviar
                </Button>
              </form>
            </CardFooter>
          )}
        </Card>
      </main>
    </div>
  );
}

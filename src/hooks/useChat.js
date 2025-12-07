import { useState } from 'react';
import { PatientService } from '../services/api'; // Asegúrate de importar tu servicio API

export const useChat = (patientId = 1) => {
  const [messages, setMessages] = useState([
    {
      role: 'bot',
      content: "👋 Hola. Soy tu asistente médico híbrido. Puedo analizar tus exámenes o responder dudas generales de salud. ¿En qué te ayudo?"
    }
  ]);
  const [isLoading, setIsLoading] = useState(false);

  const sendMessage = async (userText) => {
    if (!userText.trim()) return;

    // 1. Guardamos el historial ACTUAL antes de agregar el nuevo mensaje
    // (Excluimos mensajes de error o carga si los hubiera)
    const historyToSend = messages.map(m => ({
      role: m.role,
      content: m.content
    }));

    // 2. Agregamos el mensaje del usuario a la UI
    const newMessages = [...messages, { role: 'user', content: userText }];
    setMessages(newMessages);
    setIsLoading(true);

    try {
      // 3. Enviamos: Texto Nuevo + Historial Completo
      // Nota: PatientService.sendMessage debe estar configurado para enviar el 3er argumento
      const response = await PatientService.sendMessage(userText, patientId, historyToSend);

      if (response.success) {
        setMessages(prev => [...prev, { role: 'bot', content: response.respuesta }]);
      } else {
        setMessages(prev => [...prev, { role: 'bot', content: "Error al procesar la respuesta." }]);
      }

    } catch (error) {
      console.error("Chat error:", error);
      setMessages(prev => [...prev, { role: 'bot', content: "Error de conexión." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return { messages, isLoading, sendMessage };
};
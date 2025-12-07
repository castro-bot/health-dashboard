// src/services/api.js
import axios from 'axios';

const API_URL = 'http://localhost:3000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' }
});

export const PatientService = {
  // Get basic info + history
  getPatient: async (id) => {
    const response = await api.get(`/chatbot/paciente/${id}`);
    return response.data;
  },

  // Get the specific summary endpoint your partner built

  // Send message to chatbot
  // En src/services/api.js
sendMessage: async (pregunta, pacienteId, historial) => { // <--- Agrega historial
    const response = await api.post('/chatbot/consultar', {
      pregunta,
      pacienteId,
      historial // <--- Envialo al backend
    });
    return response.data;
},
  // src/services/api.js


  updateStats: async (id, data) => {
  // data debe ser objeto: { peso: 80, frecuenciaCardiaca: 75 }
  const response = await api.put(`/chatbot/paciente/${id}`, data);
  return response.data;
}
};

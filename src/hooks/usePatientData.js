import { useState, useEffect } from 'react';
import { PatientService } from '../services/api';

export const usePatientData = (patientId = 1) => {
  const [patient, setPatient] = useState(null);
  const [loading, setLoading] = useState(true);
  const [metrics, setMetrics] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // 1. Traemos los datos "oficiales" del backend
        const data = await PatientService.getPatient(patientId);

        if (data.success) {
          let p = data.paciente;

          // 2. TRUCO: Revisamos si hay datos guardados localmente
          const localData = localStorage.getItem(`patient_${patientId}_overrides`);
          if (localData) {
            const overrides = JSON.parse(localData);
            // Fusionamos: Backend + Tus cambios locales
            p = { ...p, ...overrides };
            console.log("⚡ Datos cargados desde memoria local:", overrides);
          }

          setPatient(p);

          // 3. Recalculamos métricas con los datos fusionados
          const latestMetrics = extractLatestMetrics(p.examenes, p);
          setMetrics(latestMetrics);
        }
      } catch (error) {
        console.error("Error fetching patient:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [patientId]);

  // Función para guardar cambios (llámala desde tu botón "Guardar")
  const updateLocalData = (newValues) => {
    // newValues ej: { peso: 88, frecuenciaCardiaca: 80 }

    // 1. Actualizamos el estado de React para que se vea al instante
    const updatedPatient = { ...patient, ...newValues };
    setPatient(updatedPatient);

    // 2. Recalculamos métricas para que los gráficos se muevan
    setMetrics(extractLatestMetrics(updatedPatient.examenes, updatedPatient));

    // 3. Guardamos en el navegador (Persistencia)
    // Primero obtenemos lo que ya había guardado para no perder nada
    const existingLocal = JSON.parse(localStorage.getItem(`patient_${patientId}_overrides`) || '{}');
    const dataToSave = { ...existingLocal, ...newValues };

    localStorage.setItem(`patient_${patientId}_overrides`, JSON.stringify(dataToSave));

    // OPCIONAL: Si el backend estuviera listo, aquí llamaríamos a api.updateStats(...)
  };

  return { patient, metrics, loading, updateLocalData };
};

// --- Helper (Actualizado para leer también del perfil raíz) ---
const extractLatestMetrics = (examenes, profile) => {
  // ... (Mismo código de ordenamiento de fecha anterior) ...
  const sortedExams = [...(examenes || [])].sort((a, b) => new Date(b.fecha) - new Date(a.fecha));

  const findValue = (key) => {
    for (const exam of sortedExams) {
      if (exam.resultados && exam.resultados[key]) {
        return {
          value: exam.resultados[key].valor,
          unit: exam.resultados[key].unidad,
          status: exam.resultados[key].estado
        };
      }
    }
    return { value: '--', unit: '', status: 'normal' };
  };

  return {
    hemoglobin: findValue('hemoglobina'),
    glucose: findValue('glucosa'),
    cholesterol: findValue('colesterolTotal'),
    // AHORA leemos directo del perfil fusionado
    heartRate: { value: profile.frecuenciaCardiaca || 72, unit: 'bpm', status: 'normal' },
    weight: { value: profile.peso || 75, unit: 'kg', status: 'normal' }
  };
};
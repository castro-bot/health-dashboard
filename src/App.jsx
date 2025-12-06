// src/App.jsx
import React from 'react';
import { usePatientData } from './hooks/usePatientData';
import { Activity, Droplet, Heart } from 'lucide-react';

const App = () => {
  const { patient, metrics, loading, updateLocalData } = usePatientData(1); // Loading Patient ID 1 (Juan Carlos)



// ... cuando el usuario de click en "Guardar"
  const handleSave = () => {
    updateLocalData({
    peso: 82, // Nuevo valor
    frecuenciaCardiaca: 95
    });
    alert("Datos guardados (¡incluso si recargas!)");
  };
  if (loading) return <div className="flex h-screen items-center justify-center">Loading Vitals...</div>;

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <header className="mb-8">
        <h1 className="text-3xl font-bold">Hola, {patient?.nombre}</h1>
        <p className="text-gray-500">
          Diagnóstico: {patient?.diagnosticoPrincipal}
          {/* Displays: "Hipertensión arterial grado 1" */}
        </p>
      </header>

      <div className="grid grid-cols-3 gap-6">
        {/* Card 1: Hemoglobin (Real data from backend) */}
        <div className="bg-white p-6 rounded-3xl shadow-sm">
          <div className="flex justify-between items-start">
            <div className="bg-red-100 p-3 rounded-full">
              <Droplet className="text-red-600" size={24} />
            </div>
            <span className={`px-2 py-1 rounded text-xs font-bold ${metrics.hemoglobin.status === 'bajo' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
              {metrics.hemoglobin.status.toUpperCase()}
            </span>
          </div>
          <div className="mt-4">
            <p className="text-gray-500 text-sm">Hemoglobina</p>
            <h3 className="text-2xl font-bold">
              {metrics.hemoglobin.value} <span className="text-sm font-normal">{metrics.hemoglobin.unit}</span>
            </h3>
          </div>
        </div>

        {/* Card 2: Glucose (Real data from backend) */}
        <div className="bg-white p-6 rounded-3xl shadow-sm">
          <div className="bg-blue-100 p-3 rounded-full w-fit mb-4">
            <Activity className="text-blue-600" size={24} />
          </div>
          <p className="text-gray-500 text-sm">Glucosa</p>
          <h3 className="text-2xl font-bold">
            {metrics.glucose.value} <span className="text-sm font-normal">{metrics.glucose.unit}</span>
          </h3>
        </div>

        {/* Card 3: Heart Rate (Mocked data) */}
        <div className="bg-white p-6 rounded-3xl shadow-sm">
          <div className="bg-orange-100 p-3 rounded-full w-fit mb-4">
            <Heart className="text-orange-600" size={24} />
          </div>
          <p className="text-gray-500 text-sm">Ritmo Cardíaco</p>
          <h3 className="text-2xl font-bold">
            {metrics.heartRate.value} <span className="text-sm font-normal">{metrics.heartRate.unit}</span>
          </h3>
        </div>
      </div>
    </div>
  );
};

export default App;
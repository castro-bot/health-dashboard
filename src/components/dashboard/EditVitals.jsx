import React, { useState } from 'react';
import { Save, X } from 'lucide-react';

const EditVitals = ({ currentMetrics, onSave, onClose }) => {
  // Inicializamos el estado con los valores actuales (quitando unidades string si es necesario)
  const [formData, setFormData] = useState({
    peso: typeof currentMetrics.weight.value === 'number' ? currentMetrics.weight.value : 75,
    frecuenciaCardiaca: typeof currentMetrics.heartRate.value === 'number' ? currentMetrics.heartRate.value : 72
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData); // Esto llama a updateLocalData del hook
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-2xl w-96 shadow-xl">
        <h3 className="text-xl font-bold mb-4">Actualizar Signos Vitales</h3>
        <form onSubmit={handleSubmit} className="space-y-4">

          <div>
            <label className="block text-sm font-medium text-gray-700">Peso (kg)</label>
            <input
              type="number"
              value={formData.peso}
              onChange={(e) => setFormData({...formData, peso: Number(e.target.value)})}
              className="w-full p-2 border rounded-lg mt-1"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Ritmo Cardíaco (bpm)</label>
            <input
              type="number"
              value={formData.frecuenciaCardiaca}
              onChange={(e) => setFormData({...formData, frecuenciaCardiaca: Number(e.target.value)})}
              className="w-full p-2 border rounded-lg mt-1"
            />
          </div>

          <div className="flex gap-2 justify-end mt-6">
            <button type="button" onClick={onClose} className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg">
              <X size={20} />
            </button>
            <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700">
              <Save size={18} /> Guardar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditVitals;
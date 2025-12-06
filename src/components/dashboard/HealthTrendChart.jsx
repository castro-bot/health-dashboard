import React, { useMemo, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const HealthTrendChart = ({ exams }) => {
  // Estado para saber qué métrica quiere ver el usuario
  const [selectedMetric, setSelectedMetric] = useState('hemoglobina');

  // 1. Transformar datos del Backend al formato de Recharts
  const chartData = useMemo(() => {
    if (!exams) return [];

    // Filtramos y ordenamos por fecha (antiguo a nuevo)
    const sortedExams = [...exams].sort((a, b) => new Date(a.fecha) - new Date(b.fecha));

    return sortedExams.map(exam => {
        // Extraemos el valor numérico de la cadena (ej: "12.5" -> 12.5)
        const val = exam.resultados[selectedMetric]?.valor;
        return {
          date: new Date(exam.fecha).toLocaleDateString('es-ES', { month: 'short', day: 'numeric' }),
          value: val ? parseFloat(val) : null,
        };
    }).filter(item => item.value !== null); // Quitamos exámenes que no tengan esa métrica
  }, [exams, selectedMetric]);

  return (
    <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-bold text-slate-800">Historial Médico</h3>

        {/* Selector de Métrica */}
        <select
          value={selectedMetric}
          onChange={(e) => setSelectedMetric(e.target.value)}
          className="bg-gray-100 border-none text-sm rounded-lg p-2 outline-none font-medium text-slate-600 cursor-pointer"
        >
          <option value="hemoglobina">Hemoglobina</option>
          <option value="colesterolTotal">Colesterol</option>
          <option value="glucosa">Glucosa</option>
          <option value="TSH">Hormonas (TSH)</option>
        </select>
      </div>

      <div className="h-64 w-full">
        {chartData.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
              <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} dy={10} />
              <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
              <Tooltip
                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
              />
              <Line
                type="monotone"
                dataKey="value"
                stroke="#3b82f6"
                strokeWidth={4}
                dot={{r: 4, fill: '#3b82f6', strokeWidth: 2, stroke: '#fff'}}
                activeDot={{r: 6}}
              />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-full flex items-center justify-center text-gray-400 text-sm">
            No hay datos históricos para esta métrica.
          </div>
        )}
      </div>
    </div>
  );
};

export default HealthTrendChart;
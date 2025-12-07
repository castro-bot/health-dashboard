import React, { useState } from 'react';
import { usePatientData } from './hooks/usePatientData';
import {
  Activity, Droplet, Heart, Search, Bell, Menu,
  Home, Calendar as CalendarIcon, Settings, User,
  MessageSquare, ChevronRight, Mic, Send, Edit3, X
} from 'lucide-react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';
import EditVitals from './components/dashboard/EditVitals';
import ChatWidget from './components/chat/ChatWidget';

const App = () => {
  const { patient, metrics, loading, updateLocalData } = usePatientData(1);
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');

  // Chat State
  const [chatInput, setChatInput] = useState("");
  const [messages, setMessages] = useState([
    { type: 'bot', text: "Hello! I'm your personal health assistant. I noticed your cholesterol is slightly high. How are you feeling today?" }
  ]);

  if (loading) return <div className="flex h-screen w-full items-center justify-center bg-[#F0F2F5] text-slate-400">Loading Health Data...</div>;

  // Mock data for the chart to match the curvy line in your design
  const chartData = [
    { name: 'Mon', value: 65 },
    { name: 'Tue', value: 59 },
    { name: 'Wed', value: 80 },
    { name: 'Thu', value: 81 },
    { name: 'Fri', value: 56 },
    { name: 'Sat', value: 55 },
    { name: 'Sun', value: 40 },
  ];

  const handleSendMessage = () => {
    if(!chatInput.trim()) return;
    setMessages([...messages, { type: 'user', text: chatInput }]);
    // Simulate bot thinking
    setTimeout(() => {
      setMessages(prev => [...prev, { type: 'bot', text: "I'm analyzing your latest vitals. Based on your glucose levels, I recommend maintaining a low-sugar diet today." }]);
    }, 1000);
    setChatInput("");
  };

  return (
    <div className="flex h-screen bg-[#F0F2F5] overflow-hidden selection:bg-blue-100">

      {/* --- 1. LEFT SIDEBAR (Navigation) --- */}
      <aside className="w-24 bg-white flex flex-col items-center py-8 border-r border-slate-100 z-20 hidden md:flex shadow-[4px_0_24px_rgba(0,0,0,0.02)]">
        <div className="mb-12">
          <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-200">
             <Activity className="text-white" size={24} />
          </div>
        </div>

        <nav className="flex flex-col gap-8 flex-1">
          <NavIcon icon={<Home size={22} />} active={activeTab === 'dashboard'} onClick={() => setActiveTab('dashboard')} />
          <NavIcon icon={<CalendarIcon size={22} />} />
          <NavIcon icon={<MessageSquare size={22} />} />
          <NavIcon icon={<Settings size={22} />} />
        </nav>

        <div className="mt-auto">
           <img
            src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix"
            alt="User"
            className="w-10 h-10 rounded-full border-2 border-slate-100 hover:border-blue-500 transition cursor-pointer"
           />
        </div>
      </aside>

      {/* --- 2. MAIN DASHBOARD (Center) --- */}
      <main className="flex-1 flex flex-col overflow-hidden relative">

        {/* Top Bar */}
        <header className="px-8 py-6 flex justify-between items-center bg-white/50 backdrop-blur-md sticky top-0 z-10">
          <div className="flex-1 max-w-xl">
            <div className="relative group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition" size={20} />
              <input
                type="text"
                placeholder="Search for health records, doctors..."
                className="w-full bg-white pl-12 pr-4 py-3 rounded-2xl border-none ring-1 ring-slate-100 focus:ring-2 focus:ring-blue-100 outline-none shadow-sm transition text-sm font-medium text-slate-600 placeholder:text-slate-400"
              />
            </div>
          </div>

          <div className="flex items-center gap-4 ml-6">
             <button onClick={() => setIsEditing(true)} className="p-3 bg-white rounded-2xl shadow-sm hover:shadow-md transition border border-slate-50 text-slate-600 hover:text-blue-600 relative group">
                <Edit3 size={20} />
                <span className="absolute top-10 right-0 bg-slate-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition whitespace-nowrap">Edit Vitals</span>
             </button>
             <button className="p-3 bg-white rounded-2xl shadow-sm hover:shadow-md transition border border-slate-50 text-slate-600 relative">
                <Bell size={20} />
                <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
             </button>
          </div>
        </header>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto px-8 pb-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-slate-800 tracking-tight">Health Overview</h1>
            <p className="text-slate-500 mt-1 font-medium">
  Welcome back, {patient?.nombre ? patient.nombre.split(" ")[0] : "User"}
</p>
          </div>

          {/* COLORFUL CARDS (Exact Gradient Match) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">

            {/* 1. Heart Rate (Blue Gradient) */}
            <div className="relative overflow-hidden bg-gradient-to-br from-blue-500 to-blue-600 rounded-[2rem] p-6 text-white shadow-xl shadow-blue-200 hover:-translate-y-1 transition duration-300">
               <div className="bg-white/20 w-12 h-12 rounded-2xl flex items-center justify-center backdrop-blur-sm mb-4">
                 <Heart className="text-white fill-white/20" size={24} />
               </div>
               <p className="text-blue-100 font-medium text-sm mb-1">Heart Rate</p>
               <h3 className="text-3xl font-bold">{metrics.heartRate.value} <span className="text-lg font-normal opacity-80">bpm</span></h3>

               {/* Decorative Circles */}
               <div className="absolute -right-4 -bottom-4 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
            </div>

            {/* 2. Blood Pressure (Cyan Gradient) */}
            <div className="relative overflow-hidden bg-gradient-to-br from-cyan-400 to-blue-400 rounded-[2rem] p-6 text-white shadow-xl shadow-cyan-200 hover:-translate-y-1 transition duration-300">
               <div className="bg-white/20 w-12 h-12 rounded-2xl flex items-center justify-center backdrop-blur-sm mb-4">
                 <Activity className="text-white" size={24} />
               </div>
               <p className="text-cyan-50 font-medium text-sm mb-1">Blood Pressure</p>
               <h3 className="text-3xl font-bold">120/80 <span className="text-lg font-normal opacity-80">mmHg</span></h3>
               <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full blur-xl -translate-y-1/2 translate-x-1/2"></div>
            </div>

             {/* 3. Glucose (Purple/Pink Gradient) */}
             <div className="relative overflow-hidden bg-gradient-to-br from-purple-500 to-pink-500 rounded-[2rem] p-6 text-white shadow-xl shadow-purple-200 hover:-translate-y-1 transition duration-300">
               <div className="bg-white/20 w-12 h-12 rounded-2xl flex items-center justify-center backdrop-blur-sm mb-4">
                 <Droplet className="text-white fill-white/20" size={24} />
               </div>
               <p className="text-purple-100 font-medium text-sm mb-1">Glucose Level</p>
               <h3 className="text-3xl font-bold">{metrics.glucose.value} <span className="text-lg font-normal opacity-80">{metrics.glucose.unit}</span></h3>
               <div className="absolute bottom-0 right-10 w-20 h-20 bg-white/10 rounded-full blur-xl translate-y-1/2"></div>
            </div>

          </div>

          {/* CHART SECTION */}
          <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-slate-100">
            <div className="flex justify-between items-center mb-6">
               <h3 className="text-xl font-bold text-slate-800">Activity & Vitals</h3>
               <select className="bg-slate-50 border-none text-sm font-semibold text-slate-600 rounded-xl px-4 py-2 outline-none cursor-pointer hover:bg-slate-100 transition">
                 <option>Weekly</option>
                 <option>Monthly</option>
               </select>
            </div>

            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                  <Tooltip
                    contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'}}
                    cursor={{stroke: '#3b82f6', strokeWidth: 2, strokeDasharray: '4 4'}}
                  />
                  <Area type="monotone" dataKey="value" stroke="#3b82f6" strokeWidth={4} fillOpacity={1} fill="url(#colorValue)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

        </div>
      </main>

      {/* --- 3. RIGHT PANEL (Chatbot/Assistant) --- */}
      <aside className="w-[400px] bg-white border-l border-slate-100 hidden xl:flex flex-col relative z-20">

        {/* Profile Header */}
        <div className="p-8 border-b border-slate-50">
           <div className="flex items-center gap-4">
             <div className="w-14 h-14 rounded-2xl bg-slate-100 overflow-hidden">
                <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" alt="Profile" className="w-full h-full object-cover" />
             </div>
             <div>
                <h2 className="font-bold text-slate-800 text-lg">{patient?.nombre}</h2>
                <p className="text-slate-400 text-sm font-medium">{patient?.edad} years • {patient?.genero === 'M' ? 'Male' : 'Female'}</p>
             </div>
           </div>

           <div className="mt-6 flex gap-4">
              <div className="flex-1 bg-blue-50 rounded-2xl p-4 flex flex-col items-center justify-center">
                 <span className="text-blue-600 font-bold text-xl">{metrics.weight.value}<small className="text-xs font-normal">kg</small></span>
                 <span className="text-blue-400 text-xs font-medium uppercase tracking-wide mt-1">Weight</span>
              </div>
              <div className="flex-1 bg-purple-50 rounded-2xl p-4 flex flex-col items-center justify-center">
                 <span className="text-purple-600 font-bold text-xl">A+</span>
                 <span className="text-purple-400 text-xs font-medium uppercase tracking-wide mt-1">Blood</span>
              </div>
           </div>
        </div>

        {/* Chat Interface */}
        <div className="flex-1 flex flex-col overflow-hidden bg-slate-50/50">
           <div className="p-4 bg-white shadow-sm z-10 flex justify-between items-center">
              <h3 className="font-bold text-slate-700 flex items-center gap-2">
                 <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                 Medical Assistant
              </h3>
           </div>

           <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((msg, i) => (
                <div key={i} className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                   {msg.type === 'bot' && (
                     <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-500 to-purple-500 flex items-center justify-center text-white text-xs mr-2 shadow-md">
                        AI
                     </div>
                   )}
                   <div className={`max-w-[80%] p-4 rounded-2xl text-sm leading-relaxed shadow-sm ${
                      msg.type === 'user'
                      ? 'bg-blue-600 text-white rounded-tr-none'
                      : 'bg-white text-slate-600 border border-slate-100 rounded-tl-none'
                   }`}>
                      {msg.text}
                   </div>
                </div>
              ))}
           </div>

           <div className="p-4 bg-white border-t border-slate-100">
              <div className="relative">
                 <input
                    type="text"
                    placeholder="Ask about your health..."
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                    className="w-full bg-slate-100 border-none rounded-xl pl-4 pr-12 py-3.5 text-sm focus:ring-2 focus:ring-blue-500/20 outline-none transition"
                 />
                 <button
                    onClick={handleSendMessage}
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition shadow-md hover:shadow-lg"
                 >
                    <Send size={16} />
                 </button>
              </div>
           </div>
        </div>
      </aside>
      <ChatWidget />
      {/* Edit Modal (Logic connected) */}
      {isEditing && (
        <EditVitals
          currentMetrics={metrics}
          onSave={(newData) => updateLocalData(newData)}
          onClose={() => setIsEditing(false)}
        />
      )}

    </div>
  );
};

// Simple Nav Component for Sidebar
const NavIcon = ({ icon, active, onClick }) => (
  <button
    onClick={onClick}
    className={`p-3 mx-auto rounded-xl transition-all duration-300 relative group ${
      active ? 'bg-blue-50 text-blue-600' : 'text-slate-400 hover:bg-slate-50 hover:text-slate-600'
    }`}
  >
    {icon}
    {active && <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-blue-600 rounded-l-full"></div>}
  </button>
);

export default App;
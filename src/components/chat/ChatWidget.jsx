import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, Send, X, Minimize2, Bot, User, Loader2 } from 'lucide-react';
import { useChat } from '../../hooks/useChat';

const ChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [inputText, setInputText] = useState("");
  const { messages, isLoading, sendMessage } = useChat(1); // User ID 1 hardcoded for demo
  const messagesEndRef = useRef(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isOpen]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (inputText.trim() && !isLoading) {
      sendMessage(inputText);
      setInputText("");
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">

      {/* --- THE CHAT WINDOW --- */}
      {isOpen && (
        <div className="mb-4 w-[350px] md:w-[400px] h-[500px] bg-white rounded-3xl shadow-2xl border border-slate-100 flex flex-col overflow-hidden animate-in slide-in-from-bottom-10 fade-in duration-300">

          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-4 flex justify-between items-center text-white">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white/20 rounded-xl backdrop-blur-sm">
                <Bot size={20} className="text-white" />
              </div>
              <div>
                <h3 className="font-bold text-sm">Asistente Médico</h3>
                <p className="text-xs text-blue-100 flex items-center gap-1">
                  <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                  En línea
                </p>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="hover:bg-white/20 p-2 rounded-full transition">
              <Minimize2 size={18} />
            </button>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50">
            {messages.map((msg, idx) => (
              <div key={idx} className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                {msg.role === 'bot' && (
                  <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center shrink-0">
                    <Bot size={14} className="text-indigo-600" />
                  </div>
                )}

                <div className={`max-w-[80%] p-3 rounded-2xl text-sm leading-relaxed shadow-sm ${
                  msg.role === 'user'
                    ? 'bg-blue-600 text-white rounded-tr-sm'
                    : 'bg-white text-slate-700 border border-slate-200 rounded-tl-sm'
                }`}>
                  {msg.content}
                </div>

                {msg.role === 'user' && (
                  <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
                    <User size={14} className="text-blue-600" />
                  </div>
                )}
              </div>
            ))}

            {/* Loading Indicator */}
            {isLoading && (
              <div className="flex gap-3 justify-start">
                <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center">
                  <Bot size={14} className="text-indigo-600" />
                </div>
                <div className="bg-white border border-slate-200 p-3 rounded-2xl rounded-tl-sm flex gap-2 items-center text-slate-400 text-xs">
                  <Loader2 size={14} className="animate-spin" /> Analizando...
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <form onSubmit={handleSubmit} className="p-3 bg-white border-t border-slate-100">
            <div className="flex gap-2 relative">
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Escribe tu consulta..."
                disabled={isLoading}
                className="w-full bg-slate-100 border-none rounded-xl pl-4 pr-12 py-3 text-sm focus:ring-2 focus:ring-blue-500/20 outline-none transition disabled:opacity-50"
              />
              <button
                type="submit"
                disabled={!inputText.trim() || isLoading}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:bg-slate-300 shadow-md"
              >
                <Send size={16} />
              </button>
            </div>
          </form>
        </div>
      )}

      {/* --- FLOATING TOGGLE BUTTON --- */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`p-4 rounded-full shadow-2xl transition-all duration-300 hover:scale-105 active:scale-95 ${
          isOpen ? 'bg-slate-800 rotate-90' : 'bg-gradient-to-r from-blue-600 to-indigo-600 animate-bounce-slow'
        }`}
      >
        {isOpen ? <X className="text-white" size={24} /> : <MessageSquare className="text-white" size={24} />}
      </button>
    </div>
  );
};

export default ChatWidget;
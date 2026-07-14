import { useState, useRef, useEffect } from 'react';

const Chatbot = ({ routeId, routeTitle, onClose }) => {
  const [messages, setMessages] = useState([
    {
      sender: 'AI',
      text: `¡Hola! Soy tu tutor virtual de la EPN para la ruta de ${routeTitle}. ¿En qué te puedo ayudar hoy o prefieres que te ponga un reto práctico?`
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId, setSessionId] = useState(null);
  
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { sender: 'STUDENT', text: userMessage }]);
    setIsLoading(true);

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:3000/api/chat/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          routeId,
          message: userMessage,
          sessionId
        })
      });

      const data = await response.json();

      if (response.ok) {
        if (!sessionId) {
          setSessionId(data.sessionId);
        }
        setMessages(prev => [...prev, { sender: 'AI', text: data.reply.content }]);
      } else {
        setMessages(prev => [...prev, { sender: 'AI', text: 'Lo siento, hubo un error de conexión con el servidor.' }]);
      }
    } catch (error) {
      setMessages(prev => [...prev, { sender: 'AI', text: 'Error de red al intentar contactar a la IA.' }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-24 right-8 w-96 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-2xl overflow-hidden flex flex-col z-50">
      
      <div className="bg-gradient-to-r from-violet-600 to-indigo-600 p-4 flex justify-between items-center text-white">
        <div className="flex items-center gap-3">
          <span className="text-2xl">🤖</span>
          <div>
            <h3 className="font-bold text-sm leading-tight">Tutor IA - ESFOT</h3>
            <span className="text-[10px] text-violet-200 font-semibold">{routeTitle}</span>
          </div>
        </div>
        <button onClick={onClose} className="text-white hover:text-red-300 transition-colors">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
        </button>
      </div>

      <div className="h-96 overflow-y-auto p-4 space-y-4 bg-slate-50 dark:bg-slate-950">
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex ${msg.sender === 'STUDENT' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[80%] rounded-2xl p-3 text-sm ${
              msg.sender === 'STUDENT' 
                ? 'bg-violet-600 text-white rounded-tr-none' 
                : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 rounded-tl-none shadow-sm'
            }`}>
              {msg.text}
            </div>
          </div>
        ))}
        
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl rounded-tl-none p-4 flex gap-1 shadow-sm">
              <div className="w-2 h-2 bg-violet-400 rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-violet-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              <div className="w-2 h-2 bg-violet-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-3 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-700">
        <form onSubmit={handleSend} className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={isLoading}
            placeholder="Escribe tu respuesta o duda..."
            className="flex-grow bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-white rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 disabled:opacity-50"
          />
          <button 
            type="submit" 
            disabled={isLoading || !input.trim()}
            className="bg-violet-600 text-white p-2 rounded-xl hover:bg-violet-700 disabled:bg-slate-300 disabled:dark:bg-slate-700 transition-colors flex items-center justify-center"
          >
            <svg className="w-5 h-5 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path></svg>
          </button>
        </form>
      </div>

    </div>
  );
};

export default Chatbot;
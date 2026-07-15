import { useState } from 'react';
import Editor from '@monaco-editor/react';

const CodeWorkspace = ({ onSendToAI }) => {
  const [language, setLanguage] = useState('python');
  const [code, setCode] = useState('');
  const [output, setOutput] = useState('');
  const [isRunning, setIsRunning] = useState(false);

  const languages = [
    { id: 'python', name: 'Python' },
    { id: 'cpp', name: 'C++' },
    { id: 'java', name: 'Java' },
    { id: 'javascript', name: 'JavaScript' }
  ];

  const handleEditorChange = (value) => {
    setCode(value);
  };

  const handleRunCode = async () => {
    setIsRunning(true);
    setOutput('Compilando código...');

    try {
      const token = sessionStorage.getItem('token') || localStorage.getItem('token');
      const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000';
      
      const response = await fetch(`${backendUrl}/api/execute/run`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ language, code })
      });

      const data = await response.json();

      if (response.ok) {
        if (data.stderr) {
          setOutput(`Error:\n${data.stderr}`);
        } else {
          setOutput(data.output || 'Programa ejecutado sin salida en consola.');
        }
      } else {
        setOutput(`Error del servidor:\n${data.error}`);
      }
    } catch (error) {
      setOutput('Error de red: No se pudo conectar con el servidor.');
    } finally {
      setIsRunning(false);
    }
  };

  const handleEvaluate = () => {
    if (!code.trim()) return;
    onSendToAI(code, language, output);
  };

  return (
    <div className="flex flex-col h-[650px] w-full rounded-2xl overflow-hidden border border-slate-700/50 shadow-2xl bg-[#0f111a] ring-1 ring-white/10">
      
      <div className="flex items-center justify-between px-4 py-3 bg-[#1a1d27] border-b border-slate-800/80">
        <div className="flex items-center gap-4">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
            <div className="w-3 h-3 rounded-full bg-amber-500/80"></div>
            <div className="w-3 h-3 rounded-full bg-emerald-500/80"></div>
          </div>
          <div className="h-4 w-px bg-slate-700"></div>
          <select 
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="bg-[#0f111a] border border-slate-700 text-slate-300 text-xs font-mono rounded-md focus:ring-violet-500 focus:border-violet-500 block px-2 py-1 outline-none cursor-pointer"
          >
            {languages.map(lang => (
              <option key={lang.id} value={lang.id}>{lang.name}</option>
            ))}
          </select>
        </div>

        <div className="flex gap-3">
          <button 
            onClick={handleRunCode}
            disabled={isRunning || !code.trim()}
            className="flex items-center gap-2 px-4 py-1.5 text-xs font-bold text-emerald-400 bg-emerald-400/10 border border-emerald-400/20 rounded-lg hover:bg-emerald-400/20 disabled:opacity-50 transition-all"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"></path></svg>
            RUN
          </button>
          <button 
            onClick={handleEvaluate}
            disabled={!code.trim()}
            className="flex items-center gap-2 px-4 py-1.5 text-xs font-bold text-white bg-gradient-to-r from-violet-600 to-indigo-600 rounded-lg hover:from-violet-500 hover:to-indigo-500 shadow-lg shadow-violet-500/20 disabled:opacity-50 transition-all"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
            EVALUAR CON IA
          </button>
        </div>
      </div>

      <div className="flex-grow grid grid-rows-3 lg:grid-rows-1 lg:grid-cols-4">
        <div className="row-span-2 lg:col-span-3 border-b lg:border-b-0 lg:border-r border-slate-800/80 relative">
          <Editor
            height="100%"
            language={language}
            theme="vs-dark"
            value={code}
            onChange={handleEditorChange}
            options={{
              minimap: { enabled: false },
              fontSize: 15,
              fontFamily: "'Fira Code', 'JetBrains Mono', monospace",
              fontLigatures: true,
              wordWrap: "on",
              padding: { top: 20, bottom: 20 },
              scrollBeyondLastLine: false,
              smoothScrolling: true,
              cursorBlinking: "smooth",
              cursorSmoothCaretAnimation: "on",
              formatOnPaste: true,
              quickSuggestions: true,
              wordBasedSuggestions: "currentDocument",
              suggestOnTriggerCharacters: true,
              acceptSuggestionOnEnter: "on",
            }}
          />
        </div>

        <div className="row-span-1 lg:col-span-1 bg-[#0a0a0f] flex flex-col">
          <div className="px-4 py-2 bg-[#12141c] border-b border-slate-800/80 flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Console</span>
            <button onClick={() => setOutput('')} className="text-slate-500 hover:text-slate-300">
               <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
            </button>
          </div>
          <div className="flex-grow p-4 overflow-y-auto">
            <pre className="text-sm font-mono text-slate-300 whitespace-pre-wrap leading-relaxed">
              {output || <span className="text-slate-600 select-none">Esperando ejecución...</span>}
            </pre>
          </div>
        </div>
      </div>

    </div>
  );
};

export default CodeWorkspace;
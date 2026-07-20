import { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { toast } from 'react-toastify';
import CodeWorkspace from './CodeWorkspace';
import AIAssessmentForm from './AIAssessmentForm';

const RouteDetail = ({ route, viewMode, setViewMode, onBack, contextoEvaluacion, onSendToAI, onOpenChat }) => {
  const [expandedModule, setExpandedModule] = useState(null);
  const [assessmentData, setAssessmentData] = useState(null);
  const [isGeneratingAssessment, setIsGeneratingAssessment] = useState(false);

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'BEGINNER': return 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20';
      case 'INTERMEDIATE': return 'bg-sky-500/10 text-sky-500 border-sky-500/20';
      case 'ADVANCED': return 'bg-violet-500/10 text-violet-500 border-violet-500/20';
      default: return 'bg-slate-500/10 text-slate-500 border-slate-500/20';
    }
  };

  const getDifficultyText = (difficulty) => {
    switch (difficulty) {
      case 'BEGINNER': return 'Principiante';
      case 'INTERMEDIATE': return 'Intermedio';
      case 'ADVANCED': return 'Avanzado';
      default: return difficulty;
    }
  };

  const getResourceIcon = (type) => {
    switch (type) {
      case 'PDF': return '📄';
      case 'VIDEO': return '▶️';
      case 'LINK': return '🔗';
      case 'IMAGE': return '🖼️';
      default: return '📁';
    }
  };

  const toggleModule = (moduleId) => {
    setExpandedModule(expandedModule === moduleId ? null : moduleId);
  };

  const handleGenerateAssessment = async (moduleId) => {
    if (isGeneratingAssessment) return;
    
    setIsGeneratingAssessment(true);
    try {
      const token = sessionStorage.getItem('token') || localStorage.getItem('token');
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';

      const endpoint = apiUrl.endsWith('/api') 
        ? `${apiUrl}/chat/assessment` 
        : `${apiUrl}/api/chat/assessment`;

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ moduleId })
      });

      if (response.status === 429) {
        throw new Error('429');
      }

      if (!response.ok) {
        throw new Error('Error al generar evaluación');
      }

      const data = await response.json();
      setAssessmentData(data);
      setViewMode('practica');
      toast.success('¡Evaluación generada con éxito!');
    } catch (error) {
      if (error.message === '429') {
        toast.warning('La IA está procesando demasiadas solicitudes. Espera un minuto y vuelve a intentarlo.');
      } else {
        toast.error('Hubo un error al generar la evaluación. Inténtalo de nuevo.');
      }
    } finally {
      setIsGeneratingAssessment(false);
    }
  };

  return (
    <div className="space-y-6">
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-slate-500 hover:text-violet-600 dark:hover:text-violet-400 font-semibold transition-colors"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
        Volver a Explorar Rutas
      </button>

      <div className="bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 rounded-3xl p-8 shadow-sm">
        <div className="flex flex-wrap gap-3 mb-6">
          <span className={`px-3 py-1 rounded-lg text-xs font-bold border ${getDifficultyColor(route.difficulty)}`}>
            {getDifficultyText(route.difficulty)}
          </span>
          <span className="px-3 py-1 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-lg text-xs font-bold border border-slate-200 dark:border-slate-700">
            ⏱️ {route.estimatedTime} Minutos
          </span>
        </div>

        <h2 className="text-3xl md:text-4xl font-black text-slate-800 dark:text-white tracking-tight mb-4">{route.title}</h2>
        <p className="text-slate-600 dark:text-slate-400 text-lg leading-relaxed mb-8 max-w-3xl">
          {route.description}
        </p>

        <div className="flex gap-4 mb-8 border-b border-slate-200 dark:border-slate-800 pb-px">
          <button
            onClick={() => setViewMode('teoria')}
            className={`pb-4 px-2 text-sm font-bold border-b-2 transition-colors ${viewMode === 'teoria' ? 'border-violet-600 text-violet-600 dark:text-violet-400' : 'border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
          >
            Módulos de Estudio
          </button>
          <button
            onClick={() => setViewMode('practica')}
            className={`pb-4 px-2 text-sm font-bold border-b-2 transition-colors ${viewMode === 'practica' ? 'border-violet-600 text-violet-600 dark:text-violet-400' : 'border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
          >
            Entorno de Práctica
          </button>
        </div>

        {viewMode === 'teoria' ? (
          <div className="space-y-4">
            {(!route.modules || route.modules.length === 0) ? (
              <div className="bg-[#1e2333] border border-gray-800 rounded-2xl p-8 text-center">
                <p className="text-slate-400">Esta ruta aún no tiene módulos asignados.</p>
              </div>
            ) : (
              route.modules.map((mod, index) => {
                const isExpanded = expandedModule === mod.id;
                
                return (
                  <div key={mod.id} className="bg-[#1e2333] border border-gray-800 rounded-xl overflow-hidden transition-all duration-300">
                    <button
                      onClick={() => toggleModule(mod.id)}
                      className="w-full flex items-center justify-between p-5 hover:bg-[#252b3e] transition-colors text-left"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-8 h-8 rounded-full bg-violet-600/20 text-violet-400 flex items-center justify-center font-bold text-sm border border-violet-500/30">
                          {index + 1}
                        </div>
                        <h3 className="text-lg font-bold text-white">{mod.title}</h3>
                      </div>
                      <svg 
                        className={`w-5 h-5 text-gray-400 transform transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`} 
                        fill="none" stroke="currentColor" viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                      </svg>
                    </button>

                    {isExpanded && (
                      <div className="p-6 border-t border-gray-800 bg-[#161a27] animate-in slide-in-from-top-2 duration-200">
                        {mod.description && (
                          <p className="text-gray-400 text-sm mb-6 leading-relaxed">{mod.description}</p>
                        )}

                        <div className="space-y-3 mb-6">
                          <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Recursos del módulo</h4>
                          {(!mod.resources || mod.resources.length === 0) ? (
                            <p className="text-gray-500 text-sm italic">No hay recursos en este módulo.</p>
                          ) : (
                            mod.resources.map((mr, rIndex) => {
                              const res = mr.resource;
                              if (!res) return null;
                              return (
                                <a
                                  key={rIndex}
                                  href={res.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="flex items-center justify-between p-4 bg-[#1e2333] rounded-lg border border-gray-700 hover:border-violet-500/50 hover:bg-[#252b3e] transition-colors group"
                                >
                                  <div className="flex items-center gap-3">
                                    <span className="text-xl">{getResourceIcon(res.type)}</span>
                                    <div>
                                      <h5 className="font-semibold text-gray-200 group-hover:text-violet-300 transition-colors">{res.title}</h5>
                                      <span className="text-xs text-gray-500">{res.type}</span>
                                    </div>
                                  </div>
                                  <svg className="w-4 h-4 text-gray-500 group-hover:text-violet-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path></svg>
                                </a>
                              );
                            })
                          )}
                        </div>

                        <div className="mt-4 pt-6 border-t border-gray-800 flex flex-col md:flex-row items-center justify-between gap-4">
                          <p className="text-sm text-gray-400">Despeja tus dudas o evalúa tus conocimientos sobre este módulo.</p>
                          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
                            <button
                              onClick={() => handleGenerateAssessment(mod.id)}
                              disabled={isGeneratingAssessment}
                              className="w-full sm:w-auto px-6 py-2.5 bg-[#252b3e] hover:bg-[#2d354a] text-white text-sm font-bold rounded-lg transition-colors border border-gray-700 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              {isGeneratingAssessment ? 'Generando...' : '📝 Generar Evaluación'}
                            </button>
                            <button
                              onClick={() => onOpenChat(mod.id)}
                              className="w-full sm:w-auto px-6 py-2.5 bg-violet-600 hover:bg-violet-700 text-white text-sm font-bold rounded-lg transition-colors shadow-lg shadow-violet-900/20 flex items-center justify-center gap-2"
                            >
                              <span>🤖</span> Hablar con la IA
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        ) : (
          <div className="animate-in fade-in space-y-6">
            {assessmentData ? (
              <AIAssessmentForm 
                assessmentData={assessmentData} 
                onRetake={() => setAssessmentData(null)} 
              />
            ) : (
              <>
                <div className="p-5 bg-slate-100 dark:bg-[#12141c] border border-slate-200 dark:border-slate-800 rounded-xl">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-lg font-bold text-slate-800 dark:text-white">Instrucciones del Reto</h2>
                    {contextoEvaluacion && (
                      <span className="px-2 py-1 bg-violet-500/20 text-violet-400 text-xs font-bold rounded">Generado por IA</span>
                    )}
                  </div>
                  <div className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
                    <ReactMarkdown
                      components={{
                        p: ({node, ...props}) => <p className="mb-3 last:mb-0" {...props} />,
                        strong: ({node, ...props}) => <strong className="font-bold text-slate-800 dark:text-slate-200" {...props} />,
                        ul: ({node, ...props}) => <ul className="list-disc pl-5 mb-3 space-y-1" {...props} />,
                        ol: ({node, ...props}) => <ol className="list-decimal pl-5 mb-3 space-y-1" {...props} />,
                        li: ({node, ...props}) => <li {...props} />,
                        code: ({node, className, children, ...props}) => {
                          const match = /language-(\w+)/.exec(className || '');
                          const isInline = !match && !String(children).includes('\n');
                          return isInline ? (
                            <code className="bg-slate-200 dark:bg-slate-800 px-1.5 py-0.5 rounded text-violet-600 dark:text-violet-400 font-mono text-[13px]" {...props}>
                              {children}
                            </code>
                          ) : (
                            <code className="block bg-slate-200 dark:bg-slate-800 p-3 rounded-lg text-violet-600 dark:text-violet-400 font-mono text-[13px] my-3 overflow-x-auto" {...props}>
                              {children}
                            </code>
                          );
                        }
                      }}
                    >
                      {contextoEvaluacion || route?.description || "Escribe el código necesario para resolver este ejercicio."}
                    </ReactMarkdown>
                  </div>
                </div>

                <CodeWorkspace onSendToAI={onSendToAI} />
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default RouteDetail;
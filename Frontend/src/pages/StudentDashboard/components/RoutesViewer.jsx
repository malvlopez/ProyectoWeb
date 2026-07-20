import { useState, useEffect } from 'react';

const RoutesViewer = ({ onOpenChat, setActiveTab }) => {
  const [rutas, setRutas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [moduloActivo, setModuloActivo] = useState(null);

  useEffect(() => {
    const fetchRutas = async () => {
      try {
        const token = sessionStorage.getItem('token') || localStorage.getItem('token');
        const response = await fetch('http://localhost:3000/api/routes', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (!response.ok) throw new Error('Error al cargar las rutas');
        
        const data = await response.json();
        setRutas(data);
      } catch (error) {
        console.error("Error obteniendo las rutas:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRutas();
  }, []);

  const toggleModulo = (id) => {
    setModuloActivo(moduloActivo === id ? null : id);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-violet-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Catálogo de Rutas</h1>
          <p className="text-slate-400 mt-2 text-lg">Explora el contenido y evalúa tus conocimientos con la IA.</p>
        </div>
        <button
          onClick={() => setActiveTab('crear-ruta')}
          className="shrink-0 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-bold py-3 px-6 rounded-xl flex items-center gap-2 transition-all transform hover:scale-105 shadow-lg shadow-violet-600/25 border border-violet-500/30"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
          Crear Ruta Personalizada
        </button>
      </div>

      {rutas.length === 0 ? (
        <div className="text-center mt-20 p-12 bg-[#1a1d27] rounded-xl border border-slate-700/50 shadow-2xl flex flex-col items-center">
          <svg className="w-16 h-16 text-slate-600 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path></svg>
          <p className="text-xl text-slate-300 font-medium mb-2">Aún no hay rutas publicadas</p>
          <p className="text-slate-500 max-w-md">Puedes esperar a que un administrador publique contenido o utilizar la IA para generar una ruta a tu medida ahora mismo.</p>
        </div>
      ) : (
        <div className="space-y-8">
          {rutas.map((ruta) => (
            <div key={ruta.id} className="bg-[#1a1d27] rounded-xl overflow-hidden border border-slate-700/50 shadow-2xl">
              <div className="bg-[#12141c] p-5 flex items-center justify-between border-b border-slate-700/50">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shadow-inner">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"></path>
                    </svg>
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-white">{ruta.title}</h2>
                    <p className="text-sm text-slate-400 mt-0.5">{ruta.modules?.length || 0} módulos disponibles</p>
                  </div>
                </div>
                <span className="text-xs px-3 py-1 bg-slate-800 rounded-full text-slate-400 border border-slate-700">
                  {ruta.difficulty}
                </span>
              </div>

              <div className="p-4 space-y-2 max-h-[600px] overflow-y-auto custom-scrollbar">
                {ruta.modules?.map((modulo) => (
                  <div key={modulo.id} className="rounded-lg overflow-hidden border border-slate-700/50 bg-[#232736] transition-all">
                    <button
                      onClick={() => toggleModulo(modulo.id)}
                      className="w-full flex items-center justify-between p-4 text-left hover:bg-slate-700/50 transition-colors focus:outline-none"
                    >
                      <span className="font-semibold text-slate-200 text-[15px]">{modulo.title}</span>
                      <div className={`w-6 h-6 rounded-full bg-slate-800 flex items-center justify-center transition-transform duration-300 ${moduloActivo === modulo.id ? 'rotate-90 bg-violet-600' : ''}`}>
                        <svg className={`w-4 h-4 ${moduloActivo === modulo.id ? 'text-white' : 'text-slate-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                        </svg>
                      </div>
                    </button>

                    <div className={`transition-all duration-300 ease-in-out ${moduloActivo === modulo.id ? 'max-h-[800px] opacity-100' : 'max-h-0 opacity-0 overflow-hidden'}`}>
                      <div className="p-5 border-t border-slate-700/50 bg-[#1e212b]">
                        <p className="text-sm text-slate-300 mb-5 leading-relaxed bg-black/20 p-4 rounded-lg border border-black/20">
                          {modulo.description}
                        </p>
                        
                        <div className="space-y-4">
                          {modulo.resources && modulo.resources.length > 0 && (
                            <>
                              <h4 className="text-[11px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path></svg>
                                Recursos del módulo
                              </h4>
                              
                              <div className="grid gap-2">
                                {modulo.resources.map((modRes) => (
                                  <a
                                    key={modRes.resource.id}
                                    href={modRes.resource.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-3 p-3 rounded-lg bg-[#12141c] border border-slate-700/30 hover:border-violet-500/50 hover:bg-violet-500/10 transition-all group"
                                  >
                                    <div className="w-8 h-8 rounded-md bg-slate-800 flex items-center justify-center text-slate-400 group-hover:text-violet-400 group-hover:bg-violet-500/20 transition-colors">
                                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"></path></svg>
                                    </div>
                                    <div className="flex-grow">
                                      <h5 className="text-sm font-medium text-slate-200 group-hover:text-violet-300 transition-colors">{modRes.resource.title}</h5>
                                      <span className="text-[11px] font-bold text-slate-500">{modRes.resource.type}</span>
                                    </div>
                                  </a>
                                ))}
                              </div>
                            </>
                          )}

                          <button 
                            onClick={() => onOpenChat(modulo.id, modulo.title)}
                            className="mt-4 w-full flex items-center justify-center gap-2 py-3 bg-violet-600/20 hover:bg-violet-600/30 text-violet-400 border border-violet-500/30 rounded-lg transition-colors font-medium text-sm"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"></path></svg>
                            Iniciar Evaluación con IA
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default RoutesViewer;
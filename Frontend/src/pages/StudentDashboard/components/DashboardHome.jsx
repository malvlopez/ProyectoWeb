import { useState, useEffect } from 'react';

const DashboardHome = ({ userData, setActiveTab }) => {
  const [activeRoutes, setActiveRoutes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecentRoutes = async () => {
      try {
        const token = sessionStorage.getItem('token') || localStorage.getItem('token');
        const response = await fetch('http://localhost:3000/api/routes/my-routes', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (response.ok) {
          const data = await response.json();
          setActiveRoutes(data.slice(0, 2));
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchRecentRoutes();
  }, []);

  const dailyChallenge = {
    title: 'Corregir lógica de Triggers',
    category: 'Bases de Datos • PostgreSQL',
    description: 'El script falla al calcular el id_periodo durante la inserción masiva. Encuentra el error.',
    timeLimit: '04:59'
  };

  const heatmapDays = Array.from({ length: 42 }, () => {
    const activityLevel = Math.random();
    if (activityLevel > 0.8) return 'bg-emerald-500';
    if (activityLevel > 0.5) return 'bg-emerald-400';
    if (activityLevel > 0.2) return 'bg-emerald-300 dark:bg-emerald-700';
    return 'bg-slate-100 dark:bg-slate-800';
  });

  return (
    <>
      <section className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-sm mb-8 overflow-hidden flex flex-col md:flex-row">
        <div className="p-8 md:p-10 flex-grow relative overflow-hidden">
          <div className="absolute -right-20 -top-20 w-64 h-64 bg-violet-600/10 rounded-full blur-3xl"></div>
          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-violet-50 dark:bg-violet-500/10 text-violet-600 dark:text-violet-400 rounded-lg text-xs font-bold uppercase tracking-wider mb-4 border border-violet-100 dark:border-violet-500/20">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z"></path></svg>
              Bienvenido de nuevo
            </div>
            <h2 className="text-3xl md:text-4xl font-black text-slate-800 dark:text-white mb-3 tracking-tight">Hola, {userData.name.split(' ')[0]}</h2>
            <p className="text-slate-500 dark:text-slate-400 max-w-xl text-base leading-relaxed">Tienes rutas en progreso y retos pendientes. Sigue sumando experiencia para subir de nivel.</p>
            <button onClick={() => setActiveTab('mis-rutas')} className="mt-6 bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold px-6 py-3 rounded-xl hover:scale-105 transition-transform">
              Continuar Aprendiendo
            </button>
          </div>
        </div>

        <div className="bg-slate-50 dark:bg-slate-800/30 p-8 border-l border-slate-200 dark:border-slate-800 w-full md:w-80 flex flex-col justify-center">
          <h3 className="text-sm font-bold text-slate-800 dark:text-white mb-4 flex items-center gap-2">
            <svg className="w-5 h-5 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path></svg>
            Actividad Reciente
          </h3>
          <div className="grid grid-cols-7 gap-1.5 mb-2">
            {heatmapDays.map((color, index) => (
              <div key={index} className={`w-full aspect-square rounded-sm ${color} transition-colors hover:ring-2 hover:ring-violet-500`}></div>
            ))}
          </div>
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <div>
            <div className="flex justify-between items-end mb-5">
              <div>
                <h3 className="text-xl font-bold text-slate-800 dark:text-white flex items-center gap-2">
                  <svg className="w-6 h-6 text-violet-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
                  Reto Relámpago EPN
                </h3>
              </div>
              <span className="bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 font-mono text-xs px-2.5 py-1 rounded-lg font-bold border border-red-100 dark:border-red-500/20">
                Tiempo: {dailyChallenge.timeLimit}
              </span>
            </div>
            <div className="bg-slate-900 rounded-2xl p-6 shadow-lg border border-slate-800 relative overflow-hidden group cursor-pointer">
              <div className="absolute top-0 left-0 w-1 h-full bg-violet-500"></div>
              <div className="flex justify-between items-start">
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-2">{dailyChallenge.category}</span>
                  <h4 className="text-white font-semibold text-lg mb-2">{dailyChallenge.title}</h4>
                  <p className="text-slate-400 text-sm">{dailyChallenge.description}</p>
                </div>
              </div>
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-5">
              <h3 className="text-xl font-bold text-slate-800 dark:text-white">Mis Rutas Activas</h3>
              <button onClick={() => setActiveTab('mis-rutas')} className="text-sm font-bold text-violet-600 dark:text-violet-400 hover:underline">Ver todas</button>
            </div>
            
            {loading ? (
              <div className="flex justify-center py-10">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-violet-600"></div>
              </div>
            ) : activeRoutes.length === 0 ? (
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-8 text-center">
                <p className="text-slate-500 dark:text-slate-400 mb-4">No tienes rutas activas en este momento.</p>
                <button onClick={() => setActiveTab('explorar')} className="bg-violet-600 text-white px-4 py-2 rounded-lg font-bold hover:bg-violet-700 transition-colors">
                  Explorar Catálogo
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {activeRoutes.map((route) => (
                  <div key={route.id} onClick={() => setActiveTab('mis-rutas')} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 hover:border-violet-400 transition-colors cursor-pointer group">
                    <div className="flex justify-between items-start mb-4">
                      <span className="text-xs font-bold px-2 py-1 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-md">En curso</span>
                    </div>
                    <h4 className="font-bold text-slate-800 dark:text-white mb-1 group-hover:text-violet-600 line-clamp-1">{route.title}</h4>
                    <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-1.5 mt-4">
                      <div className="h-1.5 rounded-full bg-emerald-500" style={{ width: `50%` }}></div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="space-y-8">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm">
            <h3 className="text-base font-bold text-slate-800 dark:text-white mb-6 text-center">Radar de Habilidades</h3>
            <div className="relative w-full aspect-square flex items-center justify-center">
              <svg className="absolute w-full h-full text-slate-200 dark:text-slate-800" viewBox="0 0 100 100">
                <polygon points="50,5 95,25 95,75 50,95 5,75 5,25" fill="none" stroke="currentColor" strokeWidth="1" />
                <line x1="50" y1="50" x2="50" y2="5" stroke="currentColor" strokeWidth="1" />
                <line x1="50" y1="50" x2="95" y2="25" stroke="currentColor" strokeWidth="1" />
                <line x1="50" y1="50" x2="95" y2="75" stroke="currentColor" strokeWidth="1" />
                <line x1="50" y1="50" x2="50" y2="95" stroke="currentColor" strokeWidth="1" />
                <line x1="50" y1="50" x2="5" y2="75" stroke="currentColor" strokeWidth="1" />
                <line x1="50" y1="50" x2="5" y2="25" stroke="currentColor" strokeWidth="1" />
              </svg>
              <svg className="absolute w-full h-full text-violet-500/50 dark:text-violet-500/40" viewBox="0 0 100 100">
                <polygon points="50,15 85,30 60,65 50,75 15,55 25,25" fill="currentColor" stroke="rgb(139, 92, 246)" strokeWidth="2" strokeLinejoin="round" />
              </svg>

              <span className="absolute top-0 text-[9px] font-bold text-slate-500 -translate-y-2">Backend</span>
              <span className="absolute top-[20%] right-0 text-[9px] font-bold text-slate-500 translate-x-3">Frontend</span>
              <span className="absolute bottom-[20%] right-0 text-[9px] font-bold text-slate-500 translate-x-2">Bases de Datos</span>
              <span className="absolute bottom-0 text-[9px] font-bold text-slate-500 translate-y-2">DevOps</span>
              <span className="absolute bottom-[20%] left-0 text-[9px] font-bold text-slate-500 -translate-x-2">Redes</span>
              <span className="absolute top-[20%] left-0 text-[9px] font-bold text-slate-500 -translate-x-3">Arquitectura</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default DashboardHome;
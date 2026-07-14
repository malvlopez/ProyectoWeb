import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFetch } from '../hooks/useFetch';
import AuthContext from '../context/AuthProvider';
import { getRoutes } from '../api/route.api';
import Chatbot from '../components/Chatbot';

const StudentDashboard = () => {
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');
  const [activeTab, setActiveTab] = useState('inicio');
  const [showChat, setShowChat] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [userData, setUserData] = useState(null);
  const [loadingProfile, setLoadingProfile] = useState(true);

  const [availableRoutes, setAvailableRoutes] = useState([]);
  const [loadingRoutes, setLoadingRoutes] = useState(true);
  const [selectedRoute, setSelectedRoute] = useState(null);

  const { fetchDataBackend } = useFetch();
  const { logoutAuth } = useContext(AuthContext);
  const navigate = useNavigate();

  const [activeRoutes] = useState([
    {
      id: 1,
      title: 'Dominio de Subredes VLSM',
      source: 'Material de Redes de Computadores',
      progress: 65,
      type: 'official',
      colorTheme: 'blue'
    },
    {
      id: 2,
      title: 'Integración React & Express',
      source: 'Ruta Generada por IA',
      progress: 12,
      type: 'ai',
      colorTheme: 'emerald'
    }
  ]);

  const [dailyChallenge] = useState({
    title: 'Corregir lógica de Triggers',
    category: 'Bases de Datos • PostgreSQL',
    description: 'El script falla al calcular el id_periodo durante la inserción masiva. Encuentra el error.',
    timeLimit: '04:59'
  });

  const heatmapDays = Array.from({ length: 42 }, () => {
    const activityLevel = Math.random();
    if (activityLevel > 0.8) return 'bg-emerald-500';
    if (activityLevel > 0.5) return 'bg-emerald-400';
    if (activityLevel > 0.2) return 'bg-emerald-300 dark:bg-emerald-700';
    return 'bg-slate-100 dark:bg-slate-800';
  });

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  useEffect(() => {
    const loadProfile = async () => {
      const response = await fetchDataBackend('/auth/profile', null, 'GET', {}, false);
      if (response && !response.error) {
        const nameParts = response.name.split(' ');
        const calculatedInitials = nameParts.length > 1
          ? `${nameParts[0][0]}${nameParts[1][0]}`.toUpperCase()
          : response.name.substring(0, 2).toUpperCase();

        setUserData({
          ...response,
          primaryRole: 'STUDENT',
          initials: calculatedInitials,
          streak: response.streak || 0,
          level: response.level || 1,
          xp: response.xp || 0,
          nextRankXp: 1000
        });
      }
      setLoadingProfile(false);
    };
    loadProfile();
  }, []);

  useEffect(() => {
    const fetchAvailableRoutes = async () => {
      try {
        const data = await getRoutes();
        setAvailableRoutes(data);
      } catch (error) {
        console.error("Error al cargar las rutas:", error);
      } finally {
        setLoadingRoutes(false);
      }
    };
    fetchAvailableRoutes();
  }, []);

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  const handleLogout = () => {
    logoutAuth();
    navigate('/');
  };

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

  const renderContent = () => {
    if (activeTab === 'inicio') {
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
                <h2 className="text-3xl md:text-4xl font-black text-slate-800 dark:text-white mb-3 tracking-tight">Es hora de subir tu nivel.</h2>
                <p className="text-slate-500 dark:text-slate-400 max-w-xl text-base leading-relaxed">Tienes pendientes retos prácticos en el módulo de Arquitectura de Base de Datos.</p>
                <button className="mt-6 bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold px-6 py-3 rounded-xl hover:scale-105 transition-transform">
                  Continuar Ruta Activa
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
                <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-5">Mis Rutas Activas</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  {activeRoutes.map((route) => (
                    <div key={route.id} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 hover:border-violet-400 transition-colors cursor-pointer group">
                      <div className="flex justify-between items-start mb-4">
                        <span className="text-xs font-bold px-2 py-1 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-md">{route.progress}%</span>
                      </div>
                      <h4 className="font-bold text-slate-800 dark:text-white mb-1 group-hover:text-violet-600">{route.title}</h4>
                      <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-1.5 mt-4">
                        <div className="h-1.5 rounded-full bg-emerald-500" style={{ width: `${route.progress}%` }}></div>
                      </div>
                    </div>
                  ))}
                </div>
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
    }

    if (activeTab === 'explorar') {
      return (
        <div className="space-y-6">
          <div>
            <h2 className="text-3xl font-black text-slate-800 dark:text-white tracking-tight mb-2">Explorar Rutas</h2>
            <p className="text-slate-500 dark:text-slate-400">Descubre nuevos caminos de aprendizaje estructurados por tus profesores.</p>
          </div>

          {loadingRoutes ? (
            <div className="flex justify-center py-20">
              <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-violet-600"></div>
            </div>
          ) : availableRoutes.length === 0 ? (
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-12 text-center shadow-sm">
              <span className="text-4xl block mb-4">📚</span>
              <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-2">No hay rutas disponibles</h3>
              <p className="text-slate-500 dark:text-slate-400">Pronto se añadirán nuevas rutas de aprendizaje a la plataforma.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {availableRoutes.map((route) => (
                <div key={route.id} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden hover:border-violet-500/50 transition-all hover:shadow-lg hover:shadow-violet-500/10 flex flex-col h-full group shadow-sm">
                  <div className="p-6 flex-grow">
                    <div className="flex justify-between items-start mb-4">
                      <span className={`px-3 py-1 rounded-lg text-xs font-bold border ${getDifficultyColor(route.difficulty)}`}>
                        {getDifficultyText(route.difficulty)}
                      </span>
                      <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 flex items-center gap-1">
                        ⏱️ {route.estimatedTime} min
                      </span>
                    </div>

                    <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-3 line-clamp-2 group-hover:text-violet-500 transition-colors">
                      {route.title}
                    </h3>

                    <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-3">
                      {route.description || 'Sin descripción disponible.'}
                    </p>
                  </div>

                  <div className="p-6 pt-0 mt-auto">
                    <button
                      onClick={() => {
                        setSelectedRoute(route);
                        setActiveTab('detalle-ruta');
                      }}
                      className="w-full bg-slate-50 dark:bg-slate-800 hover:bg-violet-600 hover:text-white dark:hover:bg-violet-600 text-slate-700 dark:text-slate-300 font-bold py-3 px-4 rounded-xl transition-all duration-300"
                    >
                      Ver Detalles
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      );
    }

    if (activeTab === 'detalle-ruta' && selectedRoute) {
      return (
        <div className="space-y-6">
          <button
            onClick={() => setActiveTab('explorar')}
            className="flex items-center gap-2 text-slate-500 hover:text-violet-600 dark:hover:text-violet-400 font-semibold transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
            Volver al catálogo
          </button>

          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 shadow-sm">
            <div className="flex flex-wrap gap-3 mb-6">
              <span className={`px-3 py-1 rounded-lg text-xs font-bold border ${getDifficultyColor(selectedRoute.difficulty)}`}>
                {getDifficultyText(selectedRoute.difficulty)}
              </span>
              <span className="px-3 py-1 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-lg text-xs font-bold border border-slate-200 dark:border-slate-700">
                ⏱️ {selectedRoute.estimatedTime} Minutos
              </span>
            </div>

            <h2 className="text-3xl md:text-4xl font-black text-slate-800 dark:text-white tracking-tight mb-4">{selectedRoute.title}</h2>
            <p className="text-slate-600 dark:text-slate-400 text-lg leading-relaxed mb-10 max-w-3xl">
              {selectedRoute.description}
            </p>

            <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-6 border-b border-slate-200 dark:border-slate-800 pb-4">
              Material de Estudio
            </h3>

            {(!selectedRoute.resources || selectedRoute.resources.length === 0) ? (
              <p className="text-slate-500 dark:text-slate-400">Esta ruta aún no tiene recursos asignados.</p>
            ) : (
              <div className="space-y-4 mb-10">
                {selectedRoute.resources.map((item, index) => {
                  const res = item.resource || item;
                  return (
                    <div key={index} className="flex flex-col sm:flex-row sm:items-center justify-between p-5 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-700 hover:border-violet-400 transition-colors gap-4">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-white dark:bg-slate-700 rounded-xl flex items-center justify-center text-2xl shadow-sm">
                          {getResourceIcon(res.type)}
                        </div>
                        <div>
                          <h4 className="font-bold text-slate-800 dark:text-white">{res.title}</h4>
                          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">{res.type}</span>
                        </div>
                      </div>
                      <a
                        href={res.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-center sm:text-left bg-white dark:bg-slate-700 hover:bg-violet-50 dark:hover:bg-violet-500/20 text-violet-600 dark:text-violet-400 border border-slate-200 dark:border-slate-600 px-5 py-2.5 rounded-xl font-bold text-sm transition-colors"
                      >
                        Abrir Recurso
                      </a>
                    </div>
                  );
                })}
              </div>
            )}

            <div className="bg-violet-600/10 border border-violet-500/20 rounded-2xl p-6 flex flex-col md:flex-row items-center justify-between gap-6">
              <div>
                <h4 className="font-bold text-slate-800 dark:text-white text-lg mb-1">¿Terminaste de estudiar?</h4>
                <p className="text-sm text-slate-600 dark:text-slate-400">Abre el asistente de IA para poner a prueba tus conocimientos y ganar XP.</p>
              </div>
              <button
                onClick={() => setShowChat(true)}
                className="whitespace-nowrap bg-violet-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-violet-700 transition-colors shadow-lg shadow-violet-500/20 flex items-center gap-2"
              >
                <span>🤖</span> Hablar con la IA
              </button>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-200 dark:border-slate-800">
        <h2 className="text-2xl font-bold mb-4">Vista Activa: {activeTab}</h2>
        <p className="text-slate-500">Módulo en construcción.</p>
      </div>
    );
  };

  if (loadingProfile || !userData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-violet-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 font-sans text-slate-900 dark:text-slate-100 flex transition-colors duration-300">

      <aside className="w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 hidden md:flex flex-col justify-between p-6 z-10">
        <div className="space-y-8">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-br from-violet-600 to-indigo-700 text-white p-2 rounded-xl font-black text-lg tracking-tighter shadow-lg shadow-violet-500/30">
              EPN
            </div>
            <div>
              <span className="text-xl font-bold text-slate-800 dark:text-white tracking-tight block leading-none">Rutas</span>
              <span className="text-[10px] font-bold text-violet-600 dark:text-violet-400 uppercase tracking-widest">Estudiante</span>
            </div>
          </div>

          <nav className="space-y-2">
            <button onClick={() => setActiveTab('inicio')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-semibold text-sm transition-all ${activeTab === 'inicio' ? 'bg-violet-600 text-white shadow-lg shadow-violet-500/20' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'}`}>Centro de Mando</button>
            <button onClick={() => setActiveTab('explorar')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-semibold text-sm transition-all ${activeTab === 'explorar' ? 'bg-violet-600 text-white shadow-lg shadow-violet-500/20' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'}`}>Explorar Rutas</button>
            <button onClick={() => setActiveTab('mis-rutas')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-semibold text-sm transition-all ${activeTab === 'mis-rutas' ? 'bg-violet-600 text-white shadow-lg shadow-violet-500/20' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'}`}>Mis Rutas</button>
            <button onClick={() => setActiveTab('boveda')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-semibold text-sm transition-all ${activeTab === 'boveda' ? 'bg-violet-600 text-white shadow-lg shadow-violet-500/20' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'}`}>Bóveda de Snippets</button>
          </nav>
        </div>

        <div className="space-y-4">
          <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-2xl border border-slate-100 dark:border-slate-800">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase">Progreso Global</span>
              <span className="text-xs font-black text-violet-600 dark:text-violet-400">Nvl. {userData.level}</span>
            </div>
            <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-1.5 mb-1">
              <div className="bg-violet-600 h-1.5 rounded-full" style={{ width: `${(userData.xp / userData.nextRankXp) * 100}%` }}></div>
            </div>
            <span className="text-[10px] text-slate-400">{userData.xp} XP para ascender</span>
          </div>

          <div className="border-t border-slate-200 dark:border-slate-800 pt-4 flex gap-2">
            <button onClick={toggleTheme} className="flex-1 flex justify-center items-center p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">Tema</button>
            <button onClick={handleLogout} className="flex-[4] flex items-center justify-center gap-2 px-4 py-2 text-sm font-semibold text-red-500 bg-red-50 hover:bg-red-100 dark:bg-red-500/10 dark:hover:bg-red-500/20 rounded-xl transition-all">Salir</button>
          </div>
        </div>
      </aside>

      <div className="flex-grow flex flex-col min-w-0 relative">
        <header className="h-20 px-6 md:px-10 flex justify-between items-center shrink-0 border-b border-slate-200 dark:border-slate-800/50 bg-white/50 dark:bg-slate-900/50 backdrop-blur-md sticky top-0 z-20">
          <div className="flex items-center gap-4">
            <h1 className="text-xl font-extrabold text-slate-800 dark:text-white hidden sm:block">Centro de Entrenamiento Técnico</h1>
          </div>

          <div className="flex items-center gap-5">
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-amber-50 dark:bg-amber-500/10 rounded-lg border border-amber-200 dark:border-amber-500/20">
              <span className="text-amber-500 text-lg">🔥</span>
              <div className="flex flex-col">
                <span className="text-[10px] font-bold text-amber-600 dark:text-amber-400 uppercase leading-none">Racha Actual</span>
                <span className="text-sm font-black text-slate-800 dark:text-white leading-none mt-0.5">{userData.streak} Días</span>
              </div>
            </div>
            <div className="w-px h-8 bg-slate-200 dark:bg-slate-700 hidden sm:block"></div>

            <div className="relative">
              <button onClick={() => setShowProfileMenu(!showProfileMenu)} className="flex items-center gap-3 text-left focus:outline-none">
                <div className="text-right hidden sm:block">
                  <div className="text-sm font-bold text-slate-800 dark:text-white">{userData.name}</div>
                  <div className="text-xs font-semibold text-violet-600 dark:text-violet-400">Estudiante</div>
                </div>
                <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-violet-600 to-indigo-600 text-white flex items-center justify-center font-bold shadow-md shadow-violet-500/20 border-2 border-white dark:border-slate-800">
                  {userData.initials}
                </div>
              </button>
              {showProfileMenu && (
                <div className="absolute right-0 mt-3 w-56 bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-100 dark:border-slate-700 overflow-hidden z-50">
                  <div className="p-2">
                    <button onClick={() => { setActiveTab('perfil'); setShowProfileMenu(false); }} className="w-full text-left px-3 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/50 rounded-lg transition-colors">Gestionar Perfil</button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        <main className="flex-grow p-6 md:p-10 overflow-y-auto">
          {renderContent()}
        </main>
      </div>

      {showChat && selectedRoute && (
        <Chatbot
          routeId={selectedRoute.id}
          routeTitle={selectedRoute.title}
          onClose={() => setShowChat(false)}
        />
      )}

      {selectedRoute && (
        <button
          onClick={() => setShowChat(!showChat)}
          className="fixed bottom-8 right-8 bg-slate-900 dark:bg-white text-white dark:text-slate-900 p-4 rounded-full shadow-2xl shadow-slate-900/50 hover:scale-110 transition-transform z-50 flex items-center justify-center group"
        >
          <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"></path></svg>
        </button>
      )}
    </div>
  );
};

export default StudentDashboard;
import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFetch } from '../../hooks/useFetch';
import AuthContext from '../../context/AuthProvider';
import { getRoutes } from '../../api/route.api';

import StudentSidebar from './components/StudentSidebar';
import StudentHeader from './components/StudentHeader';
import DashboardHome from './components/DashboardHome';
import RouteExplorer from './components/RouteExplorer';
import RouteDetails from './components/RouteDetails';
import Chatbot from './components/Chatbot';
import RoutesViewer from './components/RoutesViewer';
import StudentProfile from './components/StudentProfile'; 
import RouteGenerator from './components/RouteGenerator';

const StudentDashboard = () => {
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');
  const [activeTab, setActiveTab] = useState('inicio');
  const [routeViewMode, setRouteViewMode] = useState('teoria');
  const [showChat, setShowChat] = useState(false);
  const [userData, setUserData] = useState(null);
  const [loadingProfile, setLoadingProfile] = useState(true);

  const [availableRoutes, setAvailableRoutes] = useState([]);
  const [loadingRoutes, setLoadingRoutes] = useState(true);
  const [selectedRoute, setSelectedRoute] = useState(null);
  const [activeModuleForChat, setActiveModuleForChat] = useState(null);

  const { fetchDataBackend } = useFetch();
  const { logoutAuth } = useContext(AuthContext);
  const navigate = useNavigate();

  const [codeToEvaluate, setCodeToEvaluate] = useState(null);
  const [contextoEvaluacion, setContextoEvaluacion] = useState(() => {
    const saved = localStorage.getItem('retoActualIA');
    if (!saved) return "";
    try {
      return JSON.parse(saved);
    } catch (e) {
      return saved;
    }
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
      } finally {
        setLoadingRoutes(false);
      }
    };
    fetchAvailableRoutes();
  }, []);

  useEffect(() => {
    localStorage.setItem('retoActualIA', typeof contextoEvaluacion === 'object' ? JSON.stringify(contextoEvaluacion) : contextoEvaluacion);
  }, [contextoEvaluacion]);

  const toggleTheme = () => setTheme(theme === 'light' ? 'dark' : 'light');
  
  const handleLogout = () => {
    logoutAuth();
    navigate('/');
  };

  const handleOpenChat = (moduleId = null, moduleTitle = null) => {
    setActiveModuleForChat({ id: moduleId, title: moduleTitle });
    setShowChat(true);
  };

  const handleSendCodeToAI = (code, language, output) => {
    let mensajeFormateado = "";
    if (language === 'multitask') {
      mensajeFormateado = code;
    } else {
      let instruccionFinal = "";
      if (typeof contextoEvaluacion === 'object') {
        instruccionFinal = contextoEvaluacion?.context || "Reto práctico.";
      } else {
        instruccionFinal = contextoEvaluacion || selectedRoute?.description || "Resuelve el problema planteado.";
      }
      mensajeFormateado = `¡Hola! Necesito que evalúes mi código en ${language}.\n\nInstrucción del reto:\n${instruccionFinal}\n\nMi código:\n${code}\n\nSalida en consola:\n${output || "Sin salida en consola"}`;
    }
    
    setCodeToEvaluate(mensajeFormateado);
    setShowChat(true);
  };

  const handleUpdateUserPhoto = (newPhotoUrl) => {
    setUserData(prev => ({ ...prev, profilePicture: newPhotoUrl }));
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'inicio':
        return <DashboardHome userData={userData} setActiveTab={setActiveTab} />;
      case 'explorar':
        return (
          <RouteExplorer 
            routes={availableRoutes} 
            loading={loadingRoutes} 
            onSelectRoute={(route) => {
              setSelectedRoute(route);
              setRouteViewMode('teoria');
              setActiveTab('detalle-ruta');
              setContextoEvaluacion("");
            }} 
          />
        );
      case 'mis-rutas':
        return (
          <RoutesViewer 
            setActiveTab={setActiveTab}
            onSelectRoute={(route) => {
              setSelectedRoute(route);
              setRouteViewMode('teoria');
              setActiveTab('detalle-ruta');
              setContextoEvaluacion("");
            }} 
          />
        );
      case 'perfil':
        return <StudentProfile userData={userData} onPhotoUpdate={handleUpdateUserPhoto} />;
      case 'crear-ruta':
        return <RouteGenerator onBack={() => setActiveTab('mis-rutas')} />;
      case 'detalle-ruta':
        return (
          <RouteDetails 
            route={selectedRoute} 
            viewMode={routeViewMode}
            setViewMode={setRouteViewMode}
            onBack={() => setActiveTab('explorar')}
            contextoEvaluacion={contextoEvaluacion}
            setContextoEvaluacion={setContextoEvaluacion}
            onSendToAI={handleSendCodeToAI}
            onOpenChat={handleOpenChat}
          />
        );
      default:
        return (
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-200 dark:border-slate-800">
            <h2 className="text-2xl font-bold mb-4">Vista Activa: {activeTab}</h2>
            <p className="text-slate-500">Módulo en construcción.</p>
          </div>
        );
    }
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
      
      <StudentSidebar activeTab={activeTab} setActiveTab={setActiveTab} userData={userData} toggleTheme={toggleTheme} onLogout={handleLogout} />

      <div className="flex-grow flex flex-col min-w-0 relative">
        <StudentHeader userData={userData} setActiveTab={setActiveTab} />
        <main className="flex-grow p-6 md:p-10 overflow-y-auto">
          {renderContent()}
        </main>
      </div>

      <Chatbot
        showChat={showChat}
        routeId={selectedRoute?.id}
        routeTitle={selectedRoute?.title}
        activeModule={activeModuleForChat}
        onClose={() => setShowChat(false)}
        onAsignarNuevoReto={(nuevoRetoTexto) => setContextoEvaluacion(nuevoRetoTexto)}
        codeToEvaluate={codeToEvaluate}
        onCodeEvaluated={() => setCodeToEvaluate(null)}
      />

      {!showChat && (
        <button
          onClick={() => {
            setActiveModuleForChat(null); 
            setShowChat(true);
          }}
          className="fixed bottom-8 right-8 bg-slate-900 dark:bg-white text-white dark:text-slate-900 p-4 rounded-full shadow-2xl shadow-slate-900/50 hover:scale-110 transition-transform z-50 flex items-center justify-center group"
        >
          <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"></path></svg>
        </button>
      )}
    </div>
  );
};

export default StudentDashboard;
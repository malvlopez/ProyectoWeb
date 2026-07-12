import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFetch } from '../hooks/useFetch';
import AuthContext from '../context/AuthProvider';

const AdminDashboard = () => {
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');
  const [activeTab, setActiveTab] = useState('inicio');
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [userData, setUserData] = useState(null);
  const [loadingProfile, setLoadingProfile] = useState(true);

  const { fetchDataBackend } = useFetch();
  const { logoutAuth } = useContext(AuthContext);
  const navigate = useNavigate();

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
          primaryRole: 'ADMIN',
          initials: calculatedInitials,
        });
      }
      setLoadingProfile(false);
    };
    loadProfile();
  }, []);

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  const handleLogout = () => {
    logoutAuth();
    navigate('/');
  };

  const renderContent = () => {
    if (activeTab === 'inicio') {
      return (
        <div className="space-y-8">
          <section className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-sm overflow-hidden">
            <div className="p-8 md:p-10 relative overflow-hidden">
              <div className="absolute -right-20 -top-20 w-64 h-64 bg-emerald-600/10 rounded-full blur-3xl"></div>
              <div className="relative z-10">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-lg text-xs font-bold uppercase tracking-wider mb-4 border border-emerald-100 dark:border-emerald-500/20">
                  Panel de Administración
                </div>
                <h2 className="text-3xl md:text-4xl font-black text-slate-800 dark:text-white mb-3 tracking-tight">Gestión Operativa de Rutas</h2>
                <p className="text-slate-500 dark:text-slate-400 max-w-xl text-base leading-relaxed">Desde aquí puedes configurar el acceso de los estudiantes, gestionar la base de conocimientos y revisar las métricas de la IA.</p>
              </div>
            </div>
          </section>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6">
              <h3 className="text-slate-500 dark:text-slate-400 text-sm font-bold mb-2">Estudiantes Activos</h3>
              <p className="text-4xl font-black text-slate-800 dark:text-white">0</p>
            </div>
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6">
              <h3 className="text-slate-500 dark:text-slate-400 text-sm font-bold mb-2">Recursos Subidos</h3>
              <p className="text-4xl font-black text-slate-800 dark:text-white">0</p>
            </div>
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6">
              <h3 className="text-slate-500 dark:text-slate-400 text-sm font-bold mb-2">Sesiones de IA</h3>
              <p className="text-4xl font-black text-slate-800 dark:text-white">0</p>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-200 dark:border-slate-800">
        <h2 className="text-2xl font-bold mb-4">Vista Activa: {activeTab}</h2>
        <p className="text-slate-500">Módulo de administración en construcción.</p>
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
            <div className="bg-slate-900 text-white p-2 rounded-xl font-black text-lg tracking-tighter">
              EPN
            </div>
            <div>
              <span className="text-xl font-bold text-slate-800 dark:text-white tracking-tight block leading-none">Rutas</span>
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Administración</span>
            </div>
          </div>

          <nav className="space-y-2">
            <button onClick={() => setActiveTab('inicio')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-semibold text-sm transition-all ${activeTab === 'inicio' ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'}`}>Resumen Operativo</button>
            <button onClick={() => setActiveTab('usuarios')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-semibold text-sm transition-all ${activeTab === 'usuarios' ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'}`}>Gestión de Usuarios</button>
            <button onClick={() => setActiveTab('recursos')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-semibold text-sm transition-all ${activeTab === 'recursos' ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'}`}>Gestión de Recursos</button>
            <button onClick={() => setActiveTab('metricas')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-semibold text-sm transition-all ${activeTab === 'metricas' ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'}`}>Métricas Generales</button>
          </nav>
        </div>

        <div className="space-y-4">
          <div className="border-t border-slate-200 dark:border-slate-800 pt-4 flex gap-2">
            <button onClick={toggleTheme} className="flex-1 flex justify-center items-center p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">Tema</button>
            <button onClick={handleLogout} className="flex-[4] flex items-center justify-center gap-2 px-4 py-2 text-sm font-semibold text-red-500 bg-red-50 hover:bg-red-100 dark:bg-red-500/10 dark:hover:bg-red-500/20 rounded-xl transition-all">Salir</button>
          </div>
        </div>
      </aside>

      <div className="flex-grow flex flex-col min-w-0 relative">
        <header className="h-20 px-6 md:px-10 flex justify-between items-center shrink-0 border-b border-slate-200 dark:border-slate-800/50 bg-white/50 dark:bg-slate-900/50 backdrop-blur-md sticky top-0 z-20">
          <div className="flex items-center gap-4">
            <h1 className="text-xl font-extrabold text-slate-800 dark:text-white hidden sm:block">Panel de Control Interno</h1>
          </div>
          
          <div className="flex items-center gap-5">
            <div className="relative">
              <button onClick={() => setShowProfileMenu(!showProfileMenu)} className="flex items-center gap-3 text-left focus:outline-none">
                <div className="text-right hidden sm:block">
                  <div className="text-sm font-bold text-slate-800 dark:text-white">{userData.name}</div>
                  <div className="text-xs font-semibold text-slate-500">Administrador</div>
                </div>
                <div className="w-11 h-11 rounded-2xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 flex items-center justify-center font-bold shadow-md border-2 border-slate-200 dark:border-slate-800">
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
    </div>
  );
};

export default AdminDashboard;
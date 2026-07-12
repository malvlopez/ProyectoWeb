import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const Landing = () => {
  const [theme, setTheme] = useState(
    localStorage.getItem('theme') || 'light'
  );

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  return (
    <div className="min-h-screen bg-white dark:bg-slate-900 font-sans text-slate-900 dark:text-slate-100 transition-colors duration-300">
      
      <nav className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 sticky top-0 z-50 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-6 md:px-12 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="bg-gradient-to-r from-violet-600 to-indigo-600 text-white p-2 rounded-lg font-bold text-xl tracking-tighter">
              ESFOT
            </div>
            <span className="text-xl font-bold text-slate-800 dark:text-white tracking-tight">Rutas</span>
          </div>
          
          <div className="hidden lg:flex items-center space-x-6 text-sm font-medium text-slate-600 dark:text-slate-300">
            <a href="#soluciones" className="hover:text-violet-600 dark:hover:text-violet-400 transition-colors">Soluciones TSDS</a>
            <a href="#malla" className="hover:text-violet-600 dark:hover:text-violet-400 transition-colors">Filtros de la Malla</a>
            <a href="#equipo" className="hover:text-violet-600 dark:hover:text-violet-400 transition-colors">El Equipo</a>
            <a href="#faq" className="hover:text-violet-600 dark:hover:text-violet-400 transition-colors">FAQ Politécnico</a>
          </div>

          <div className="flex items-center space-x-4">
            <button 
              onClick={toggleTheme} 
              className="p-2 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
            >
              {theme === 'light' ? (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"></path></svg>
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>
              )}
            </button>
            <Link to="/login" className="hidden sm:block text-slate-600 dark:text-slate-300 hover:text-violet-600 dark:hover:text-violet-400 font-semibold transition-colors">
              Ingreso EPN
            </Link>
            <Link to="/register" className="bg-gradient-to-r from-violet-600 to-indigo-600 text-white px-5 py-2.5 rounded-lg hover:from-violet-700 hover:to-indigo-700 font-semibold shadow-md transition-all active:scale-95">
              Registrarse
            </Link>
          </div>
        </div>
      </nav>

      <main>
        <section className="relative pt-24 pb-20 px-6 md:px-12 overflow-hidden flex justify-center text-center">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-violet-100 via-white to-white dark:from-violet-900/20 dark:via-slate-900 dark:to-slate-900 -z-10"></div>
          <div className="max-w-5xl mx-auto relative z-10">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-violet-50 dark:bg-violet-500/10 text-violet-700 dark:text-violet-300 text-sm font-semibold mb-8 border border-violet-200 dark:border-violet-500/20">
              <span className="flex h-2 w-2 rounded-full bg-red-500 animate-pulse"></span>
              Plataforma de Supervivencia Académica ESFOT
            </div>
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight mb-8 text-slate-900 dark:text-white">
              Supera los verdaderos filtros <br className="hidden md:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-600 to-red-500">
                de Desarrollo de Software
              </span>
            </h1>
            <p className="text-lg md:text-xl text-slate-600 dark:text-slate-400 mb-10 max-w-3xl mx-auto leading-relaxed">
              Diseñada exclusivamente para estudiantes de TSDS de la Politécnica Nacional. Prepárate para aprobar Redes de Computadores, dominar la integración Full-Stack y gestionar tus bases de datos sin reprobar en el intento.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link to="/register" className="bg-gradient-to-r from-violet-600 to-indigo-600 text-white px-8 py-4 rounded-xl font-bold text-lg hover:shadow-lg hover:shadow-violet-500/30 transition-all flex items-center justify-center gap-2">
                Estructurar mi Semestre
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6"></path></svg>
              </Link>
            </div>
          </div>
        </section>

        <section className="py-10 border-y border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50">
          <div className="max-w-7xl mx-auto px-6 overflow-hidden">
            <p className="text-center text-sm font-semibold text-slate-500 dark:text-slate-400 mb-6 uppercase tracking-wider">Conceptos críticos de la malla curricular</p>
            <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16 opacity-70 transition-all duration-500">
              <span className="text-xl md:text-2xl font-bold font-mono text-slate-800 dark:text-slate-200 hover:text-violet-600 transition-colors">Modelo OSI</span>
              <span className="text-xl md:text-2xl font-bold font-mono text-slate-800 dark:text-slate-200 hover:text-violet-600 transition-colors">Enrutamiento TCP/IP</span>
              <span className="text-xl md:text-2xl font-bold font-mono text-slate-800 dark:text-slate-200 hover:text-violet-600 transition-colors">APIs RESTful</span>
              <span className="text-xl md:text-2xl font-bold font-mono text-slate-800 dark:text-slate-200 hover:text-violet-600 transition-colors">Triggers SQL</span>
            </div>
          </div>
        </section>

        <section id="soluciones" className="py-24 px-6 md:px-12 bg-white dark:bg-slate-900">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Soluciones a los peores dolores de cabeza de TSDS</h2>
              <p className="text-slate-600 dark:text-slate-400">Sabemos exactamente dónde se estancan los estudiantes de la ESFOT.</p>
            </div>
            <div className="grid md:grid-cols-3 gap-12 relative">
              <div className="hidden md:block absolute top-12 left-1/6 right-1/6 h-0.5 bg-gradient-to-r from-violet-200 to-violet-200 dark:from-slate-700 dark:to-slate-700 -z-10"></div>
              
              <div className="text-center bg-white dark:bg-slate-900">
                <div className="w-24 h-24 mx-auto bg-red-100 dark:bg-slate-800 border-4 border-white dark:border-slate-900 rounded-full flex items-center justify-center mb-6 shadow-xl">
                  <svg className="w-10 h-10 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
                </div>
                <h3 className="text-xl font-bold mb-3">Redes de Computadores</h3>
                <p className="text-slate-600 dark:text-slate-400">Prepárate para la materia más temida. Estructura el conocimiento necesario sobre subredes, topologías, protocolos de enrutamiento y supera la altísima exigencia de esta cátedra.</p>
              </div>

              <div className="text-center bg-white dark:bg-slate-900">
                <div className="w-24 h-24 mx-auto bg-violet-600 text-white border-4 border-white dark:border-slate-900 rounded-full flex items-center justify-center mb-6 shadow-xl shadow-violet-500/30">
                  <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"></path></svg>
                </div>
                <h3 className="text-xl font-bold mb-3">Integración Full-Stack</h3>
                <p className="text-slate-600 dark:text-slate-400">Evita el colapso a final de semestre. Gestiona el paso a paso para conectar correctamente el backend con tu frontend sin que los errores de CORS arruinen tu proyecto integrador.</p>
              </div>

              <div className="text-center bg-white dark:bg-slate-900">
                <div className="w-24 h-24 mx-auto bg-emerald-100 dark:bg-slate-800 border-4 border-white dark:border-slate-900 rounded-full flex items-center justify-center mb-6 shadow-xl">
                  <svg className="w-10 h-10 text-emerald-600 dark:text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4"></path></svg>
                </div>
                <h3 className="text-xl font-bold mb-3">Lógica de Bases de Datos</h3>
                <p className="text-slate-600 dark:text-slate-400">Domina las estructuras relacionales antes de escribir código. Proyecta tus esquemas, controla los conflictos de llaves foráneas y domina las consultas complejas y disparadores.</p>
              </div>
            </div>
          </div>
        </section>

        <section id="malla" className="py-24 px-6 md:px-12 bg-slate-50 dark:bg-slate-800/30">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center">Navegando los semestres de especialidad</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border-t-4 border-blue-500">
                <div className="text-blue-500 font-black text-4xl mb-4">02</div>
                <h3 className="font-bold text-lg mb-2">Fundamentos de POO</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400">El inicio de la especialidad. Sienta las bases de la Programación Orientada a Objetos y la lógica algorítmica.</p>
              </div>
              <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border-t-4 border-red-500">
                <div className="text-red-500 font-black text-4xl mb-4">03</div>
                <h3 className="font-bold text-lg mb-2">Redes de Computadores</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400">El filtro definitivo. Modelos de comunicación, subredes, configuración de equipos y un rigor académico brutal.</p>
              </div>
              <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border-t-4 border-violet-500">
                <div className="text-violet-500 font-black text-4xl mb-4">04</div>
                <h3 className="font-bold text-lg mb-2">Desarrollo de Aplicaciones</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400">Construcción Web y Móvil. La exigencia de integrar interfaces con bases de datos operativas en tiempo real.</p>
              </div>
              <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border-t-4 border-emerald-500">
                <div className="text-emerald-500 font-black text-4xl mb-4">05</div>
                <h3 className="font-bold text-lg mb-2">Titulación Práctica</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400">Desarrollo del proyecto integrador final demostrando dominio en infraestructura y software empresarial.</p>
              </div>
            </div>
          </div>
        </section>

        <section id="equipo" className="py-24 px-6 md:px-12 bg-white dark:bg-slate-900">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col lg:flex-row items-center gap-16">
              <div className="lg:w-1/2">
                <div className="inline-block px-3 py-1 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-full text-sm font-semibold mb-4">
                  Escuela de Formación de Tecnólogos - EPN
                </div>
                <h2 className="text-3xl md:text-5xl font-bold mb-6">Quiénes Somos</h2>
                <p className="text-slate-600 dark:text-slate-400 text-lg mb-6 leading-relaxed">
                  Rutas nació en los laboratorios de la ESFOT. Como estudiantes, vivimos en carne propia la frustración de enfrentarnos a las materias de especialidad, viendo cómo excelentes compañeros se quedaban estancados en Redes de Computadores o fallaban en las entregas de Desarrollo Web por no saber planificar la integración del código.
                </p>
                <p className="text-slate-600 dark:text-slate-400 text-lg mb-8 leading-relaxed">
                  Desarrollado en equipo por Andrés, Selena, José y Daniel, este sistema busca ser el apoyo definitivo para los estudiantes politécnicos de TSDS, dándoles las herramientas para mapear sus requerimientos y sobrevivir a la malla curricular.
                </p>
                <div className="flex gap-4">
                  <div className="flex -space-x-4">
                    <div className="w-12 h-12 rounded-full border-2 border-white dark:border-slate-900 bg-violet-200 dark:bg-violet-800 flex items-center justify-center font-bold text-violet-700 dark:text-violet-200">A</div>
                    <div className="w-12 h-12 rounded-full border-2 border-white dark:border-slate-900 bg-blue-200 dark:bg-blue-800 flex items-center justify-center font-bold text-blue-700 dark:text-blue-200">S</div>
                    <div className="w-12 h-12 rounded-full border-2 border-white dark:border-slate-900 bg-emerald-200 dark:bg-emerald-800 flex items-center justify-center font-bold text-emerald-700 dark:text-emerald-200">J</div>
                    <div className="w-12 h-12 rounded-full border-2 border-white dark:border-slate-900 bg-pink-200 dark:bg-pink-800 flex items-center justify-center font-bold text-pink-700 dark:text-pink-200">D</div>
                  </div>
                  <div className="flex flex-col justify-center">
                    <span className="font-bold text-slate-900 dark:text-white">Estudiantes TSDS</span>
                    <span className="text-sm text-slate-500 dark:text-slate-400">Equipo de Desarrollo</span>
                  </div>
                </div>
              </div>
              <div className="lg:w-1/2 w-full">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-slate-100 dark:bg-slate-800 rounded-3xl p-6 transform translate-y-8">
                    <div className="w-10 h-10 bg-white dark:bg-slate-700 rounded-full flex items-center justify-center mb-4">
                      <svg className="w-5 h-5 text-violet-600 dark:text-violet-400" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd"></path></svg>
                    </div>
                    <h4 className="font-bold mb-2">Visión Politécnica</h4>
                    <p className="text-sm text-slate-600 dark:text-slate-400">Entendemos el rigor de la EPN y diseñamos funciones para mitigar el impacto de las materias más duras.</p>
                  </div>
                  <div className="bg-violet-600 text-white rounded-3xl p-6">
                    <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center mb-4">
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"></path></svg>
                    </div>
                    <h4 className="font-bold mb-2">Solución Real</h4>
                    <p className="text-sm text-violet-100">Más allá de la teoría. Una herramienta para organizar el código y la arquitectura antes de la entrega final.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="faq" className="py-24 px-6 md:px-12 bg-slate-50 dark:bg-slate-800/50">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold mb-10 text-center">Dudas Frecuentes - Estudiantes ESFOT</h2>
            <div className="space-y-6">
              <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700">
                <h4 className="text-lg font-bold mb-2">¿Cómo me ayuda la plataforma con Redes de Computadores?</h4>
                <p className="text-slate-600 dark:text-slate-400">Sabemos que es la materia más pesada. La plataforma te permite estructurar tus apuntes de topologías, modelado OSI y protocolos TCP/IP de forma lógica, para que no llegues en blanco a los exámenes de la cátedra más exigente de la carrera.</p>
              </div>
              <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700">
                <h4 className="text-lg font-bold mb-2">¿Es útil para evitar los bloqueos de código a fin de semestre?</h4>
                <p className="text-slate-600 dark:text-slate-400">Sí. El 80% de los proyectos integradores fallan en la conexión entre el frontend y el backend. Nuestro sistema te obliga a mapear la arquitectura y las rutas de tu API antes de programar, mitigando los errores de CORS y dependencias.</p>
              </div>
              <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700">
                <h4 className="text-lg font-bold mb-2">¿Qué pasa si me retraso en una materia clave?</h4>
                <p className="text-slate-600 dark:text-slate-400">La malla de TSDS tiene asignaturas en cadena estricta. Si tienes problemas con Bases de Datos, la plataforma proyectará visualmente cómo esto afectará tu avance hacia el Desarrollo Web y el proyecto de titulación.</p>
              </div>
            </div>
          </div>
        </section>

        <section className="py-24 px-6 md:px-12 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-5xl font-bold mb-8">No dejes tu título al azar</h2>
            <p className="text-xl text-slate-600 dark:text-slate-400 mb-10">Ingresa con tu correo institucional y asegura tu paso firme por las materias de especialidad de la EPN.</p>
            <Link to="/register" className="inline-block bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-10 py-4 rounded-xl font-bold text-lg hover:scale-105 transition-transform shadow-2xl">
              Acceder a Rutas TSDS
            </Link>
          </div>
        </section>
      </main>

      <footer className="bg-slate-900 text-slate-400 py-12 px-6 md:px-12">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2 grayscale brightness-200">
            <div className="bg-violet-600 text-white p-1.5 rounded-md font-bold text-lg">ESFOT</div>
            <span className="text-lg font-bold text-white">Rutas</span>
          </div>
          <div className="text-sm text-center md:text-left">
            &copy; 2026 Estudiantes TSDS - Escuela Politécnica Nacional. <br className="sm:hidden"/>Todos los derechos reservados.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
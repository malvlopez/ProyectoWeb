const AdminHome = () => {
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
};

export default AdminHome;
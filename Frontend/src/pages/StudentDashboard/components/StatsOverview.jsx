const StatsOverview = () => {
  const stats = [
    { label: 'Nivel Actual', value: '1', icon: 'M13 10V3L4 14h7v7l9-11h-7z', color: 'text-amber-400', bg: 'bg-amber-400/10', border: 'border-amber-400/20' },
    { label: 'Puntos de Experiencia', value: '0 XP', icon: 'M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a2 2 0 10-4 0v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-3a1 1 0 00-1-1H4a2 2 0 110-4h1a1 1 0 001-1V7a1 1 0 011-1h3a1 1 0 001-1V4z', color: 'text-emerald-400', bg: 'bg-emerald-400/10', border: 'border-emerald-400/20' },
    { label: 'Racha de Estudio', value: '0 días', icon: 'M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z', color: 'text-rose-400', bg: 'bg-rose-400/10', border: 'border-rose-400/20' }
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h1 className="text-3xl font-bold text-white tracking-tight">Bienvenido de vuelta</h1>
        <p className="text-slate-400 mt-2 text-lg">Aquí tienes el resumen de tu progreso en la plataforma.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, idx) => (
          <div key={idx} className={`p-6 rounded-2xl bg-[#12141c] border ${stat.border} shadow-lg relative overflow-hidden group hover:scale-[1.02] transition-transform`}>
            <div className={`absolute top-0 right-0 w-24 h-24 rounded-bl-full opacity-20 ${stat.bg} -mr-4 -mt-4 transition-transform group-hover:scale-110`}></div>
            <div className="flex items-center gap-4 relative z-10">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${stat.bg} ${stat.color}`}>
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={stat.icon}></path>
                </svg>
              </div>
              <div>
                <p className="text-sm font-medium text-slate-400 mb-1">{stat.label}</p>
                <h3 className="text-2xl font-bold text-white">{stat.value}</h3>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="p-8 rounded-2xl bg-[#12141c] border border-slate-800/80 shadow-lg">
        <h2 className="text-xl font-bold text-white mb-4">Perfil de Aprendizaje</h2>
        <div className="h-40 flex items-center justify-center rounded-xl bg-slate-900/50 border border-slate-800 border-dashed">
          <p className="text-slate-500 text-sm">Completa más módulos para que la IA defina tu perfil.</p>
        </div>
      </div>
    </div>
  );
};

export default StatsOverview;
import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { getResources } from '../../../api/resource.api';
import { createRoute } from '../../../api/route.api';

const RouteBuilder = ({ initialData, onCancel, onSaveSuccess }) => {
  const isEditing = !!initialData;

  const [formData, setFormData] = useState({
    title: initialData?.title || '',
    description: initialData?.description || '',
    category: initialData?.category || '',
    estimatedTime: initialData?.estimatedTime || '',
    difficulty: initialData?.difficulty || 'BEGINNER',
    evaluationRules: initialData?.evaluationRules || '',
    modules: initialData?.modules?.map(mod => ({
      id: mod.id,
      title: mod.title,
      description: mod.description || '',
      resourceIds: mod.resources ? mod.resources.map(r => r.resourceId || r.id) : []
    })) || []
  });

  const [availableResources, setAvailableResources] = useState([]);
  const [loadingResources, setLoadingResources] = useState(true);

  const predefinedCategories = [
    "Ingeniería de Software",
    "Datos e Información",
    "Infraestructura y Redes",
    "Gestión y Proyectos de TI",
    "Sistemas y Arquitectura",
    "Fundamentos y Lógica"
  ];

  useEffect(() => {
    const fetchResources = async () => {
      try {
        const resourcesData = await getResources();
        setAvailableResources(resourcesData);
      } catch (error) {
        toast.error('No se pudieron cargar los recursos disponibles');
      } finally {
        setLoadingResources(false);
      }
    };
    fetchResources();
  }, []);

  const addModule = () => {
    setFormData({
      ...formData,
      modules: [...formData.modules, { title: '', description: '', resourceIds: [] }]
    });
  };

  const updateModule = (index, field, value) => {
    const updatedModules = [...formData.modules];
    updatedModules[index][field] = value;
    setFormData({ ...formData, modules: updatedModules });
  };

  const removeModule = (index) => {
    const updatedModules = formData.modules.filter((_, i) => i !== index);
    setFormData({ ...formData, modules: updatedModules });
  };

  const toggleResource = (moduleIndex, resourceId) => {
    const currentModule = formData.modules[moduleIndex];
    const currentIndex = currentModule.resourceIds.indexOf(resourceId);
    const newResourceIds = [...currentModule.resourceIds];

    if (currentIndex === -1) {
      newResourceIds.push(resourceId);
    } else {
      newResourceIds.splice(currentIndex, 1);
    }
    updateModule(moduleIndex, 'resourceIds', newResourceIds);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      if (isEditing) {
        const token = sessionStorage.getItem('token') || localStorage.getItem('token');
        const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';
        const response = await fetch(`${apiUrl}/api/routes/${initialData.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(formData)
        });
        if (!response.ok) throw new Error('Error al actualizar');
      } else {
        await createRoute(formData);
      }

      toast.success(isEditing ? 'Ruta actualizada exitosamente' : 'Ruta creada exitosamente');
      onSaveSuccess();
    } catch (error) {
      toast.error('Hubo un problema al guardar la ruta');
    }
  };

  return (
    <div className="min-h-screen bg-[#0f172a] text-gray-200 p-8 font-sans">
      <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-black text-white tracking-tight">
              {isEditing ? 'Editar Ruta de Aprendizaje' : 'Diseño de Rutas de Aprendizaje'}
            </h1>
            <p className="text-gray-400 mt-2 text-base">
              {isEditing ? 'Modifica los detalles, cursos o recursos asignados.' : 'Estructura el aprendizaje organizado por Escuelas, Rutas y Cursos.'}
            </p>
          </div>
          <button 
            onClick={onCancel}
            className="px-6 py-2 border border-gray-600 text-gray-300 hover:bg-gray-800 rounded-lg font-medium transition-colors"
          >
            Volver al Listado
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          
          <div className="bg-[#1e2333] p-8 rounded-2xl border border-gray-800 shadow-lg relative overflow-hidden">
            <div className="absolute left-0 top-0 bottom-0 w-1 bg-violet-500"></div>
            <h2 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
              <span className="bg-violet-500/20 text-violet-400 w-8 h-8 rounded-lg flex items-center justify-center text-sm">1</span>
              Eje de Conocimiento (Clasificación)
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {predefinedCategories.map((cat, idx) => (
                <label 
                  key={idx} 
                  className={`flex items-center p-4 border rounded-xl cursor-pointer transition-all ${formData.category === cat ? 'border-violet-500 bg-violet-500/10 ring-1 ring-violet-500' : 'border-gray-700 hover:border-violet-400 bg-[#0f172a]'}`}
                >
                  <input 
                    type="radio" 
                    name="category"
                    value={cat}
                    checked={formData.category === cat}
                    onChange={(e) => setFormData({...formData, category: e.target.value})}
                    className="hidden"
                  />
                  <span className={`font-semibold text-sm ${formData.category === cat ? 'text-violet-400' : 'text-gray-300'}`}>
                    {cat}
                  </span>
                </label>
              ))}
              
              <label className={`flex items-center p-4 border rounded-xl cursor-pointer transition-all ${!predefinedCategories.includes(formData.category) && formData.category !== '' ? 'border-violet-500 bg-violet-500/10 ring-1 ring-violet-500' : 'border-gray-700 bg-[#0f172a]'}`}>
                <input 
                  type="radio" 
                  name="category"
                  value="custom"
                  checked={!predefinedCategories.includes(formData.category) && formData.category !== ''}
                  onChange={() => setFormData({...formData, category: 'Nueva Categoría'})}
                  className="hidden"
                />
                <input 
                  type="text"
                  placeholder="Otra clasificación..."
                  value={!predefinedCategories.includes(formData.category) ? formData.category : ''}
                  onChange={(e) => setFormData({...formData, category: e.target.value})}
                  className="w-full bg-transparent border-none focus:ring-0 p-0 text-sm font-semibold text-gray-300 placeholder-gray-500 outline-none"
                  onClick={() => {
                    if(predefinedCategories.includes(formData.category)) {
                      setFormData({...formData, category: ''})
                    }
                  }}
                />
              </label>
            </div>
          </div>

          <div className="bg-[#1e2333] p-8 rounded-2xl border border-gray-800 shadow-lg relative overflow-hidden">
            <div className="absolute left-0 top-0 bottom-0 w-1 bg-emerald-500"></div>
            <h2 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
              <span className="bg-emerald-500/20 text-emerald-400 w-8 h-8 rounded-lg flex items-center justify-center text-sm">2</span>
              Materia / Detalles de la Ruta
            </h2>

            <div className="space-y-6">
              <div>
                <label className="text-sm font-bold text-gray-400 block mb-2">Título de la Ruta (Materia)</label>
                <input 
                  type="text" 
                  placeholder="Ej: Programación Orientada a Objetos"
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  className="w-full bg-[#0f172a] border border-gray-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-colors"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="text-sm font-bold text-gray-400 block mb-2">Tiempo estimado (Minutos)</label>
                  <input 
                    type="number" 
                    placeholder="Ej: 144"
                    value={formData.estimatedTime}
                    onChange={(e) => setFormData({...formData, estimatedTime: e.target.value})}
                    className="w-full bg-[#0f172a] border border-gray-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-emerald-500 transition-colors"
                  />
                </div>
                <div>
                  <label className="text-sm font-bold text-gray-400 block mb-2">Nivel de Dificultad</label>
                  <select
                    value={formData.difficulty}
                    onChange={(e) => setFormData({...formData, difficulty: e.target.value})}
                    className="w-full bg-[#0f172a] border border-gray-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-emerald-500 transition-colors"
                  >
                    <option value="BEGINNER">Principiante (Ej. Semestre 2)</option>
                    <option value="INTERMEDIATE">Intermedio (Ej. Semestre 3-4)</option>
                    <option value="ADVANCED">Avanzado (Ej. Semestre 5)</option>
                  </select>
                </div>
              </div>
              
              <div>
                <label className="text-sm font-bold text-gray-400 block mb-2">Descripción General</label>
                <textarea 
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  className="w-full bg-[#0f172a] border border-gray-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-emerald-500 transition-colors h-24 resize-none"
                  required
                />
              </div>

              <div className="bg-emerald-500/5 p-5 rounded-xl border border-emerald-500/20">
                <label className="flex items-center gap-2 text-sm font-bold text-emerald-400 mb-2">
                  <span className="text-xl">🤖</span> Directrices para la IA (System Prompt)
                </label>
                <p className="text-xs text-gray-400 mb-3">
                  Define cómo debe comportarse el chatbot de Gemini al evaluar esta ruta específica.
                </p>
                <textarea 
                  placeholder="Ej: Actúa como un profesor estricto de la EPN..."
                  value={formData.evaluationRules}
                  onChange={(e) => setFormData({...formData, evaluationRules: e.target.value})}
                  className="w-full bg-[#0f172a] border border-emerald-500/30 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-emerald-500 transition-colors h-28 resize-none"
                />
              </div>
            </div>
          </div>

          <div className="bg-[#1e2333] p-8 rounded-2xl border border-gray-800 shadow-lg relative overflow-hidden">
            <div className="absolute left-0 top-0 bottom-0 w-1 bg-amber-500"></div>
            
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
              <div>
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  <span className="bg-amber-500/20 text-amber-400 w-8 h-8 rounded-lg flex items-center justify-center text-sm">3</span>
                  Cursos de la Ruta (Submódulos)
                </h2>
                <p className="text-sm text-gray-400 mt-1 sm:ml-10">Crea los submódulos y asígnales los recursos existentes.</p>
              </div>
              <button 
                type="button" 
                onClick={addModule}
                className="px-4 py-2 bg-amber-500/10 text-amber-400 hover:bg-amber-500/20 border border-amber-500/20 rounded-xl text-sm font-bold transition-colors"
              >
                + Añadir Curso
              </button>
            </div>

            <div className="space-y-4">
              {formData.modules.length === 0 && (
                <div className="text-center py-8 border-2 border-dashed border-gray-700 rounded-xl">
                  <p className="text-gray-500 text-sm">Aún no has agregado cursos a esta ruta.</p>
                </div>
              )}

              {formData.modules.map((mod, index) => (
                <div key={index} className="bg-[#0f172a] p-5 rounded-xl border border-gray-700 relative group flex gap-4">
                  
                  <div className="flex-shrink-0 flex items-center justify-center w-10 h-10 bg-[#1e2333] rounded-lg border border-gray-700 text-gray-500 font-bold">
                    {index + 1}
                  </div>

                  <div className="flex-grow space-y-4">
                    <input 
                      type="text" 
                      placeholder="Nombre del Curso (Ej: Conceptos básicos de Redes)"
                      value={mod.title}
                      onChange={(e) => updateModule(index, 'title', e.target.value)}
                      className="w-full bg-[#1e2333] border border-gray-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-amber-500 text-sm font-bold"
                      required
                    />
                    
                    <textarea 
                      placeholder="Breve descripción del curso..."
                      value={mod.description}
                      onChange={(e) => updateModule(index, 'description', e.target.value)}
                      className="w-full bg-[#1e2333] border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-amber-500 text-sm h-12 resize-none"
                    />
                    
                    <div className="mt-4 border-t border-gray-800 pt-4">
                      <label className="text-xs font-bold text-gray-400 block mb-3 uppercase tracking-wider">
                        Catálogo de Recursos (Selecciona para añadir)
                      </label>
                      
                      {loadingResources ? (
                        <div className="text-sm text-gray-500 italic">Cargando recursos...</div>
                      ) : availableResources.length === 0 ? (
                        <div className="bg-amber-500/10 text-amber-500 p-3 rounded-lg text-sm border border-amber-500/20">
                          No hay recursos disponibles. Sube recursos primero.
                        </div>
                      ) : (
                        <div className="max-h-40 overflow-y-auto bg-[#1e2333] border border-gray-700 rounded-lg p-2 space-y-1 custom-scrollbar">
                          {availableResources.map((res) => (
                            <label key={res.id} className="flex items-center gap-3 p-2 hover:bg-[#252b3e] rounded-md cursor-pointer transition-colors">
                              <input 
                                type="checkbox"
                                checked={mod.resourceIds.includes(res.id)}
                                onChange={() => toggleResource(index, res.id)}
                                className="w-4 h-4 text-amber-500 bg-gray-900 border-gray-600 focus:ring-amber-500 rounded"
                              />
                              <div className="flex flex-col">
                                <span className="text-sm font-medium text-gray-300 line-clamp-1">{res.title}</span>
                                <span className="text-[10px] text-gray-500 uppercase">{res.type}</span>
                              </div>
                            </label>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  <button 
                    type="button" 
                    onClick={() => removeModule(index)}
                    className="flex-shrink-0 self-start text-gray-500 hover:text-red-500 bg-[#1e2333] hover:bg-red-500/10 p-2 rounded-lg transition-colors border border-gray-700 hover:border-red-500/30"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-end pt-4">
            <button 
              type="submit"
              className="px-8 py-4 bg-white text-slate-900 font-bold rounded-xl transition-transform hover:scale-105 shadow-xl shadow-white/10 text-lg"
            >
              {isEditing ? 'Guardar Cambios' : 'Ensamblar y Guardar Ruta'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RouteBuilder;
import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { getRoutes, createRoute, deleteRoute } from '../api/route.api';
import { getResources } from '../api/resource.api';

const RoutesManager = () => {
  const [routes, setRoutes] = useState([]);
  const [availableResources, setAvailableResources] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    difficulty: 'BEGINNER',
    estimatedTime: '',
    evaluationRules: ''
  });

  const [selectedResources, setSelectedResources] = useState([]);

  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    setFetching(true);
    try {
      const [routesData, resourcesData] = await Promise.all([
        getRoutes(),
        getResources()
      ]);
      setRoutes(routesData);
      setAvailableResources(resourcesData);
    } catch (error) {
      toast.error('Error al cargar la información inicial');
    } finally {
      setFetching(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const toggleResourceSelection = (resourceId) => {
    if (selectedResources.includes(resourceId)) {
      setSelectedResources(selectedResources.filter(id => id !== resourceId));
    } else {
      setSelectedResources([...selectedResources, resourceId]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title) return toast.warning('El título es obligatorio');
    if (selectedResources.length === 0) return toast.warning('Debes seleccionar al menos un recurso');

    setLoading(true);
    try {
      const newRoute = {
        ...formData,
        estimatedTime: parseInt(formData.estimatedTime) || 0,
        resourceIds: selectedResources
      };

      await createRoute(newRoute);
      toast.success('Ruta de aprendizaje creada exitosamente');

      setFormData({ title: '', description: '', difficulty: 'BEGINNER', estimatedTime: '', evaluationRules: '' });
      setSelectedResources([]);
      loadInitialData();
    } catch (error) {
      toast.error(error.response?.data?.error || 'Error al crear la ruta');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('¿Estás seguro de eliminar esta ruta?')) return;

    try {
      await deleteRoute(id);
      toast.success('Ruta eliminada');
      loadInitialData();
    } catch (error) {
      toast.error('Error al eliminar la ruta');
    }
  };

  return (
    <div className="min-h-screen bg-[#0f172a] text-gray-200 p-8 font-sans">
      <div className="max-w-6xl mx-auto space-y-8">

        <div>
          <h1 className="text-3xl font-bold text-white">Diseño de Rutas de Aprendizaje</h1>
          <p className="text-gray-400 mt-2">Agrupa los recursos subidos para crear caminos estructurados e inyecta inteligencia artificial.</p>
        </div>

        <div className="bg-[#1e2333] border border-gray-800 rounded-xl p-6 shadow-lg">
          <h2 className="text-xl font-semibold text-white mb-6">Ensamblar Nueva Ruta</h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Título de la Ruta</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  className="w-full bg-[#0f172a] border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-colors"
                  placeholder="Ej. Fundamentos de Arquitectura"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Dificultad</label>
                  <select
                    name="difficulty"
                    value={formData.difficulty}
                    onChange={handleInputChange}
                    className="w-full bg-[#0f172a] border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-colors"
                  >
                    <option value="BEGINNER">Principiante</option>
                    <option value="INTERMEDIATE">Intermedio</option>
                    <option value="ADVANCED">Avanzado</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Tiempo (Minutos)</label>
                  <input
                    type="number"
                    name="estimatedTime"
                    value={formData.estimatedTime}
                    onChange={handleInputChange}
                    min="1"
                    className="w-full bg-[#0f172a] border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-colors"
                    placeholder="Ej. 120"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Descripción General</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                className="w-full bg-[#0f172a] border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-colors"
                rows="2"
                placeholder="Objetivo principal de esta ruta..."
              ></textarea>
            </div>

            <div className="bg-blue-900/20 border border-blue-500/30 rounded-xl p-5">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xl">🤖</span>
                <label className="block text-sm font-bold text-blue-400">Directrices para la IA (System Prompt)</label>
              </div>
              <p className="text-xs text-gray-400 mb-3">Define cómo debe comportarse el chatbot al evaluar esta ruta. Ej: "Actúa como un profesor de la EPN, sé estricto con la sintaxis de C++ y no des respuestas directas".</p>
              <textarea
                name="evaluationRules"
                value={formData.evaluationRules}
                onChange={handleInputChange}
                className="w-full bg-[#0f172a] border border-blue-500/50 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-400 transition-colors"
                rows="3"
                placeholder="Instrucciones secretas para el modelo de lenguaje..."
              ></textarea>
            </div>

            <div className="border-t border-gray-800 pt-6">
              <label className="block text-sm font-medium text-gray-400 mb-4">Catálogo de Recursos (Selecciona para añadir a la ruta)</label>
              {availableResources.length === 0 ? (
                <p className="text-yellow-500 text-sm bg-yellow-500/10 p-4 rounded-lg">No hay recursos disponibles. Sube recursos primero en la pestaña anterior.</p>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 max-h-64 overflow-y-auto pr-2">
                  {availableResources.map(resource => (
                    <div
                      key={resource.id}
                      onClick={() => toggleResourceSelection(resource.id)}
                      className={`p-4 rounded-lg cursor-pointer border transition-all ${
                        selectedResources.includes(resource.id)
                          ? 'bg-blue-600/20 border-blue-500'
                          : 'bg-[#0f172a] border-gray-700 hover:border-gray-500'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <h3 className="text-sm font-semibold text-white line-clamp-2">{resource.title}</h3>
                        <div className={`w-4 h-4 rounded-full border flex items-center justify-center mt-1 shrink-0 ${
                          selectedResources.includes(resource.id) ? 'border-blue-500 bg-blue-500' : 'border-gray-500'
                        }`}>
                          {selectedResources.includes(resource.id) && <div className="w-2 h-2 bg-white rounded-full"></div>}
                        </div>
                      </div>
                      <span className="text-xs text-gray-400 mt-2 block">{resource.type}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="flex justify-end pt-4">
              <button
                type="submit"
                disabled={loading || availableResources.length === 0}
                className={`px-6 py-3 rounded-lg font-bold transition-all ${
                  loading || availableResources.length === 0 ? 'bg-blue-800 text-gray-300 cursor-not-allowed' : 'bg-blue-600 text-white hover:bg-blue-700 shadow-lg'
                }`}
              >
                {loading ? 'Guardando...' : 'Guardar Ruta'}
              </button>
            </div>
          </form>
        </div>

        <div className="bg-[#1e2333] border border-gray-800 rounded-xl p-6 shadow-lg">
          <h2 className="text-xl font-semibold text-white mb-6">Rutas Existentes</h2>

          {fetching ? (
            <p className="text-gray-400 text-center py-4">Cargando rutas...</p>
          ) : routes.length === 0 ? (
            <p className="text-gray-400 text-center py-4">No hay rutas estructuradas aún.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-gray-800">
                    <th className="py-4 px-4 font-semibold text-gray-400">Título</th>
                    <th className="py-4 px-4 font-semibold text-gray-400">Dificultad</th>
                    <th className="py-4 px-4 font-semibold text-gray-400">IA Activa</th>
                    <th className="py-4 px-4 font-semibold text-gray-400 text-right">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {routes.map((route) => (
                    <tr key={route.id} className="border-b border-gray-800/50 hover:bg-[#252b3e] transition-colors">
                      <td className="py-4 px-4 font-medium text-white">{route.title}</td>
                      <td className="py-4 px-4">
                        <span className="bg-gray-800 text-gray-300 px-2 py-1 rounded text-xs font-semibold">
                          {route.difficulty}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        {route.evaluationRules ? (
                           <span className="text-blue-400 flex items-center gap-1 text-sm">🤖 Sí</span>
                        ) : (
                           <span className="text-gray-500 text-sm">No</span>
                        )}
                      </td>
                      <td className="py-4 px-4 text-right">
                        <button
                          onClick={() => handleDelete(route.id)}
                          className="text-red-500 hover:text-red-400 font-medium"
                        >
                          Eliminar
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default RoutesManager;
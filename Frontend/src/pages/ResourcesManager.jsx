import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { getResources, uploadFile, createResource, deleteResource } from '../api/resource.api';

const ResourcesManager = () => {
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: 'LINK',
    url: ''
  });
  const [selectedFile, setSelectedFile] = useState(null);

  useEffect(() => {
    loadResources();
  }, []);

  const loadResources = async () => {
    try {
      const data = await getResources();
      setResources(data);
    } catch (error) {
      toast.error('Error al cargar los recursos');
    } finally {
      setFetching(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title) return toast.warning('El título es obligatorio');
    
    setLoading(true);
    try {
      let finalUrl = formData.url;

      if ((formData.type === 'PDF' || formData.type === 'IMAGE') && selectedFile) {
        toast.info('Subiendo archivo a la nube...', { autoClose: 2000 });
        finalUrl = await uploadFile(selectedFile);
      }

      if (!finalUrl) {
        setLoading(false);
        return toast.warning('Debes proporcionar un enlace o subir un archivo');
      }

      const newResource = {
        title: formData.title,
        description: formData.description,
        type: formData.type,
        url: finalUrl
      };

      await createResource(newResource);
      toast.success('Recurso guardado exitosamente');
      
      setFormData({ title: '', description: '', type: 'LINK', url: '' });
      setSelectedFile(null);
      loadResources();
      
    } catch (error) {
      toast.error(error.response?.data?.error || 'Error al guardar el recurso');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('¿Estás seguro de eliminar este recurso?')) return;
    
    try {
      await deleteResource(id);
      toast.success('Recurso eliminado');
      loadResources();
    } catch (error) {
      toast.error('Error al eliminar el recurso');
    }
  };

  return (
    <div className="min-h-screen bg-[#0f172a] text-gray-200 p-8 font-sans">
      <div className="max-w-6xl mx-auto space-y-8">
        
        <div>
          <h1 className="text-3xl font-bold text-white">Gestión de Recursos</h1>
          <p className="text-gray-400 mt-2">Sube archivos o guarda enlaces para usarlos en las rutas de aprendizaje.</p>
        </div>

        <div className="bg-[#1e2333] border border-gray-800 rounded-xl p-6 shadow-lg">
          <h2 className="text-xl font-semibold text-white mb-6">Agregar Nuevo Recurso</h2>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Título</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  className="w-full bg-[#0f172a] border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-colors"
                  placeholder="Ej. Guía de Instalación de Node.js"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Tipo de Recurso</label>
                <select
                  name="type"
                  value={formData.type}
                  onChange={handleInputChange}
                  className="w-full bg-[#0f172a] border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-colors"
                >
                  <option value="LINK">Enlace Externo (Artículo/Sitio)</option>
                  <option value="VIDEO">Video (YouTube/Vimeo)</option>
                  <option value="PDF">Documento PDF</option>
                  <option value="IMAGE">Imagen</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Descripción (Opcional)</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                className="w-full bg-[#0f172a] border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-colors"
                rows="2"
                placeholder="Breve explicación de lo que contiene el recurso..."
              ></textarea>
            </div>

            {formData.type === 'LINK' || formData.type === 'VIDEO' ? (
              <div key="url-container">
                <label className="block text-sm font-medium text-gray-400 mb-2">URL del Enlace o Video</label>
                <input
                  key="url-input"
                  type="url"
                  name="url"
                  value={formData.url}
                  onChange={handleInputChange}
                  className="w-full bg-[#0f172a] border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-colors"
                  placeholder="https://..."
                />
              </div>
            ) : (
              <div key="file-container">
                <label className="block text-sm font-medium text-gray-400 mb-2">Subir Archivo</label>
                <input
                  key="file-input"
                  type="file"
                  onChange={handleFileChange}
                  accept={formData.type === 'PDF' ? '.pdf' : 'image/*'}
                  className="w-full bg-[#0f172a] border border-gray-700 rounded-lg px-4 py-2 text-white file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-700 cursor-pointer"
                />
              </div>
            )}

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={loading}
                className={`px-6 py-3 rounded-lg font-bold transition-all ${
                  loading ? 'bg-blue-800 text-gray-300 cursor-not-allowed' : 'bg-blue-600 text-white hover:bg-blue-700 shadow-lg'
                }`}
              >
                {loading ? 'Guardando...' : 'Guardar Recurso'}
              </button>
            </div>
          </form>
        </div>

        <div className="bg-[#1e2333] border border-gray-800 rounded-xl p-6 shadow-lg">
          <h2 className="text-xl font-semibold text-white mb-6">Recursos Disponibles</h2>
          
          {fetching ? (
            <p className="text-gray-400 text-center py-4">Cargando recursos...</p>
          ) : resources.length === 0 ? (
            <p className="text-gray-400 text-center py-4">No hay recursos guardados aún.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-gray-800">
                    <th className="py-4 px-4 font-semibold text-gray-400">Título</th>
                    <th className="py-4 px-4 font-semibold text-gray-400">Tipo</th>
                    <th className="py-4 px-4 font-semibold text-gray-400">Enlace</th>
                    <th className="py-4 px-4 font-semibold text-gray-400 text-right">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {resources.map((resource) => (
                    <tr key={resource.id} className="border-b border-gray-800/50 hover:bg-[#252b3e] transition-colors">
                      <td className="py-4 px-4 font-medium text-white">{resource.title}</td>
                      <td className="py-4 px-4">
                        <span className="bg-gray-800 text-gray-300 px-2 py-1 rounded text-xs font-semibold">
                          {resource.type}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-blue-400">
                        <a href={resource.url} target="_blank" rel="noreferrer" className="hover:underline">
                          Ver Recurso
                        </a>
                      </td>
                      <td className="py-4 px-4 text-right">
                        <button
                          onClick={() => handleDelete(resource.id)}
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

export default ResourcesManager;
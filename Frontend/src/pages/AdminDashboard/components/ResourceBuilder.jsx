import { useState } from 'react';
import { toast } from 'react-toastify';
import { createResource, uploadFile } from '../../../api/resource.api';

const ResourceBuilder = ({ initialData, onCancel, onSaveSuccess }) => {
  const isEditing = !!initialData;
  const [loading, setLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);

  const [formData, setFormData] = useState({
    title: initialData?.title || '',
    description: initialData?.description || '',
    type: initialData?.type || 'LINK',
    url: initialData?.url || ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const maxSizeBytes = 5 * 1024 * 1024;
      if (file.size > maxSizeBytes) {
        toast.error('El archivo es demasiado pesado. El límite máximo es de 5MB.');
        e.target.value = '';
        setSelectedFile(null);
        return;
      }
      setSelectedFile(file);
    }
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

      if (!finalUrl && !isEditing) {
        setLoading(false);
        return toast.warning('Debes proporcionar un enlace o subir un archivo');
      }

      const resourcePayload = {
        title: formData.title,
        description: formData.description,
        type: formData.type,
        url: finalUrl
      };

      if (isEditing) {
        const token = sessionStorage.getItem('token') || localStorage.getItem('token');
        const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';
        const response = await fetch(`${apiUrl}/api/resources/${initialData.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(resourcePayload)
        });
        if (!response.ok) throw new Error('Error al actualizar');
      } else {
        await createResource(resourcePayload);
      }

      toast.success(isEditing ? 'Recurso actualizado exitosamente' : 'Recurso guardado exitosamente');
      onSaveSuccess();
      
    } catch (error) {
      toast.error('Error al guardar el recurso. Verifica tu conexión.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0f172a] text-gray-200 p-8 font-sans">
      <div className="max-w-2xl mx-auto space-y-8 animate-in fade-in duration-500">
        
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white">
              {isEditing ? 'Editar Recurso' : 'Nuevo Recurso'}
            </h1>
          </div>
          <button 
            onClick={onCancel}
            className="px-6 py-2 border border-gray-600 text-gray-300 hover:bg-gray-800 rounded-lg font-medium transition-colors"
          >
            Volver
          </button>
        </div>

        <form onSubmit={handleSubmit} className="bg-[#1e2333] p-8 rounded-2xl border border-gray-800 shadow-xl relative overflow-hidden space-y-6">
          <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-500"></div>
          
          <div>
            <label className="block text-xs font-bold text-blue-400 uppercase tracking-wider mb-2">Título</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              className="w-full bg-[#0f172a] border border-gray-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-1 focus:ring-blue-500 transition-colors"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-bold text-blue-400 uppercase tracking-wider mb-2">Tipo</label>
              <select
                name="type"
                value={formData.type}
                onChange={handleInputChange}
                className="w-full bg-[#0f172a] border border-gray-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-1 focus:ring-blue-500 transition-colors"
              >
                <option value="LINK">Link</option>
                <option value="VIDEO">Video</option>
                <option value="PDF">PDF</option>
                <option value="IMAGE">Imagen</option>
              </select>
            </div>

            {formData.type === 'LINK' || formData.type === 'VIDEO' ? (
              <div>
                <label className="block text-xs font-bold text-blue-400 uppercase tracking-wider mb-2">URL Pública</label>
                <input
                  type="url"
                  name="url"
                  value={formData.url}
                  onChange={handleInputChange}
                  className="w-full bg-[#0f172a] border border-gray-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-1 focus:ring-blue-500 transition-colors font-mono text-sm"
                  placeholder="https://"
                />
              </div>
            ) : (
              <div>
                <label className="block text-xs font-bold text-blue-400 uppercase tracking-wider mb-2">Subir Archivo (Máx 5MB)</label>
                <input
                  type="file"
                  onChange={handleFileChange}
                  accept={formData.type === 'PDF' ? '.pdf' : 'image/*'}
                  className="w-full text-white file:mr-3 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-700 cursor-pointer text-sm"
                />
                {isEditing && formData.url && !selectedFile && (
                  <p className="text-xs text-emerald-500 mt-2">Ya existe un archivo guardado.</p>
                )}
              </div>
            )}
          </div>

          <div>
            <label className="block text-xs font-bold text-blue-400 uppercase tracking-wider mb-2">Descripción</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              className="w-full bg-[#0f172a] border border-gray-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-1 focus:ring-blue-500 transition-colors h-24 resize-none"
            ></textarea>
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-4 rounded-xl font-bold transition-all text-lg ${
              loading ? 'bg-blue-800 text-gray-300 cursor-not-allowed' : 'bg-blue-600 text-white hover:bg-blue-700 shadow-lg shadow-blue-900/20'
            }`}
          >
            {loading ? 'Guardando...' : 'Guardar en Catálogo'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResourceBuilder;
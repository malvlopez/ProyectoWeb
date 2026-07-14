import { useState, useEffect } from 'react';
import { createUser, updateUser } from '../../api/admin.api';

const UserFormModal = ({ isOpen, onClose, userToEdit, token }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    roleName: 'STUDENT'
  });

  useEffect(() => {
    if (userToEdit) {
      setFormData({
        name: userToEdit.name,
        email: userToEdit.email,
        password: '',
        roleName: userToEdit.roles[0] || 'STUDENT'
      });
    }
  }, [userToEdit]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (userToEdit) {
        await updateUser(userToEdit.id, { name: formData.name, email: formData.email }, token);
      } else {
        await createUser(formData, token);
      }
      onClose();
    } catch (error) {
      console.error(error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center p-4 z-50">
      <div className="bg-[#1e2333] rounded-xl p-6 w-full max-w-md shadow-2xl border border-gray-700">
        <h2 className="text-xl font-bold mb-4 text-white">
          {userToEdit ? 'Editar Usuario' : 'Crear Usuario'}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Nombre</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full rounded-lg bg-[#161a26] border border-gray-600 text-white p-2.5 outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Correo Institucional</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full rounded-lg bg-[#161a26] border border-gray-600 text-white p-2.5 outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />
          </div>
          {!userToEdit && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Contraseña</label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className="w-full rounded-lg bg-[#161a26] border border-gray-600 text-white p-2.5 outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Rol</label>
                <select
                  name="roleName"
                  value={formData.roleName}
                  onChange={handleChange}
                  className="w-full rounded-lg bg-[#161a26] border border-gray-600 text-white p-2.5 outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all appearance-none"
                >
                  <option value="STUDENT">Estudiante</option>
                  <option value="ADMIN">Administrador</option>
                </select>
              </div>
            </>
          )}
          <div className="flex justify-end space-x-3 mt-8 pt-4 border-t border-gray-700">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-transparent text-gray-300 rounded-lg hover:bg-gray-700 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-lg"
            >
              Guardar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserFormModal;
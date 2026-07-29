import { useState, useEffect } from 'react';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchUsers = async () => {
    try {
      const token = sessionStorage.getItem('token') || localStorage.getItem('token');
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

      const response = await fetch(`${apiUrl}/users`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();

      if (!response.ok) throw new Error(data.error || 'Error al cargar los usuarios');

      setUsers(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const toggleUserStatus = async (userId, currentStatus) => {
    try {
      const token = sessionStorage.getItem('token') || localStorage.getItem('token');
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';
      const newStatus = currentStatus === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';

      const response = await fetch(`${apiUrl}/users/${userId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status: newStatus })
      });

      if (!response.ok) throw new Error('Error al actualizar el estado del usuario');

      fetchUsers();
    } catch (err) {
      alert(err.message);
    }
  };

  if (loading) return <div className="p-8 text-center text-slate-400">Cargando el panel de usuarios...</div>;
  if (error) return <div className="p-8 text-center text-red-500">{error}</div>;

  return (
    <div className="max-w-6xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-10">
      <div>
        <h2 className="text-3xl font-bold text-white tracking-tight">Gestión de Usuarios</h2>
        <p className="text-slate-400 mt-2">Administra las cuentas, roles y accesos de la plataforma ESFOT.</p>
      </div>

      <div className="bg-[#1a1d27] rounded-2xl border border-slate-700/50 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#12141c] border-b border-slate-700/50 text-slate-400 text-sm">
                <th className="p-4 font-bold">Nombre</th>
                <th className="p-4 font-bold">Correo Institucional</th>
                <th className="p-4 font-bold">Rol</th>
                <th className="p-4 font-bold">Estado</th>
                <th className="p-4 font-bold text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700/50">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-slate-800/50 transition-colors">
                  <td className="p-4 text-white font-medium">{user.name}</td>
                  <td className="p-4 text-slate-400">{user.email}</td>
                  <td className="p-4">
                    <span className="px-3 py-1 bg-violet-500/10 text-violet-400 rounded-lg text-xs font-bold border border-violet-500/20">
                      {user.role}
                    </span>
                  </td>
                  <td className="p-4">
                    <span className={`px-3 py-1 rounded-lg text-xs font-bold border ${
                      user.status === 'ACTIVE'
                        ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                        : 'bg-red-500/10 text-red-400 border-red-500/20'
                    }`}>
                      {user.status === 'ACTIVE' ? 'Activo' : 'Inactivo'}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <button
                      onClick={() => toggleUserStatus(user.id, user.status)}
                      className={`text-sm font-bold transition-colors ${
                        user.status === 'ACTIVE'
                          ? 'text-red-400 hover:text-red-300'
                          : 'text-emerald-400 hover:text-emerald-300'
                      }`}
                    >
                      {user.status === 'ACTIVE' ? 'Desactivar' : 'Activar'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {users.length === 0 && (
            <div className="p-8 text-center text-slate-400">
              No hay usuarios registrados en el sistema.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserManagement;
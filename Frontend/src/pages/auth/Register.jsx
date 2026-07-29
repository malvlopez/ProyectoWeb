import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';

const Register = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    cedula: '',
    firstName: '',
    lastName: '',
    email: '',
    password: ''
  });

  const handleCedulaChange = (e) => {
    setFormData({ ...formData, cedula: e.target.value });
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const verifyCedula = async (e) => {
    e.preventDefault();
    if (formData.cedula.length !== 10) {
      toast.error("La cédula debe tener exactamente 10 dígitos.");
      return;
    }

    setLoading(true);

    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';
      const response = await fetch(`${apiUrl}/auth/verify-cedula/${formData.cedula}`);
      
      const personData = await response.json();

      if (!response.ok) {
        throw new Error(personData.error || "No se pudo obtener información o la cédula no existe.");
      }

      if (personData && personData.status && personData.status.http_code === 404) {
        throw new Error("La cédula ingresada no es válida o no existe en el Registro Civil.");
      }

      const fullName = personData.name || personData.nombre || "";
      
      if (!fullName || fullName.trim() === "") {
        throw new Error("No se encontraron los nombres para esta cédula.");
      }

      const nameParts = fullName.trim().split(' ');
      const midIndex = Math.ceil(nameParts.length / 2);
      
      const lastNames = nameParts.slice(0, midIndex).join(' ');
      const firstNames = nameParts.slice(midIndex).join(' ');

      setFormData(prev => ({
        ...prev,
        firstName: firstNames || fullName,
        lastName: lastNames || ''
      }));

      toast.success("Identidad verificada correctamente");
      setStep(2);
    } catch (err) {
      toast.error(err.message || "No se pudo conectar con el sistema de validación.");
    } finally {
      setLoading(false);
    }
  };

  const submitRegistration = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';
      
      const finalData = {
        cedula: formData.cedula,
        name: `${formData.firstName} ${formData.lastName}`.trim(),
        email: formData.email,
        password: formData.password
      };

      const response = await fetch(`${apiUrl}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(finalData)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Error al registrar la cuenta.");
      }

      toast.success("Cuenta creada exitosamente. Por favor, inicia sesión.");
      navigate("/login");
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    if (step === 2) {
      setStep(1);
    } else {
      navigate("/");
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#0f111a] p-4">
      <div className="w-full max-w-md bg-[#1a1d27] rounded-2xl border border-slate-700/50 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-500 relative">
        <div className="h-2 w-full bg-gradient-to-r from-emerald-400 to-violet-600"></div>
        
        <button 
          onClick={handleBack}
          className="absolute top-6 left-6 text-slate-400 hover:text-white transition-colors flex items-center justify-center bg-slate-800/50 hover:bg-slate-700 p-2 rounded-lg"
          title="Volver"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path></svg>
        </button>

        <div className="p-8 mt-2">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center bg-violet-600 text-white font-bold px-3 py-1 rounded-lg text-sm mb-4">
              ESFOT Rutas
            </div>
            <h2 className="text-2xl font-bold text-white tracking-tight mb-2">
              {step === 1 ? "Verificación de Identidad" : "Crea tu perfil TSDS"}
            </h2>
            <p className="text-slate-400 text-sm">
              {step === 1 
                ? "Ingresa tu número de cédula para validar tu información en el sistema." 
                : "Organiza tu malla curricular y asegura tu avance en la EPN."}
            </p>
          </div>

          {step === 1 ? (
            <form onSubmit={verifyCedula} className="space-y-5">
              <div>
                <label htmlFor="cedulaStep1" className="block text-sm font-bold text-slate-300 mb-2">Cédula de Identidad</label>
                <input
                  id="cedulaStep1"
                  name="cedula"
                  type="text"
                  required
                  maxLength="10"
                  value={formData.cedula}
                  onChange={handleCedulaChange}
                  placeholder="Ej. 1728496728"
                  className="w-full bg-[#12141c] border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-violet-500 transition-colors"
                />
              </div>

              <button
                type="submit"
                disabled={loading || formData.cedula.length < 10}
                className="w-full bg-violet-600 hover:bg-violet-700 text-white font-bold py-3.5 px-6 rounded-xl transition-all disabled:opacity-50 flex justify-center items-center gap-2"
              >
                {loading ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
                ) : (
                  "Verificar Identidad"
                )}
              </button>
            </form>
          ) : (
            <form onSubmit={submitRegistration} className="space-y-5 animate-in slide-in-from-right-4 duration-300">
              <div>
                <label htmlFor="cedulaStep2" className="block text-sm font-bold text-slate-300 mb-2">Cédula de Identidad</label>
                <input
                  id="cedulaStep2"
                  name="cedula"
                  type="text"
                  value={formData.cedula}
                  disabled
                  className="w-full bg-slate-800/50 border border-slate-700/50 rounded-xl px-4 py-3 text-slate-400 cursor-not-allowed opacity-70"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="firstName" className="block text-sm font-bold text-slate-300 mb-2">Nombres</label>
                  <input
                    id="firstName"
                    name="firstName"
                    type="text"
                    value={formData.firstName}
                    disabled
                    className="w-full bg-slate-800/50 border border-slate-700/50 rounded-xl px-4 py-3 text-slate-400 cursor-not-allowed opacity-70"
                  />
                </div>
                <div>
                  <label htmlFor="lastName" className="block text-sm font-bold text-slate-300 mb-2">Apellidos</label>
                  <input
                    id="lastName"
                    name="lastName"
                    type="text"
                    value={formData.lastName}
                    disabled
                    className="w-full bg-slate-800/50 border border-slate-700/50 rounded-xl px-4 py-3 text-slate-400 cursor-not-allowed opacity-70"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-bold text-slate-300 mb-2">Correo Institucional (@epn.edu.ec)</label>
                <input
                  id="email"
                  type="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="nombre.apellido@epn.edu.ec"
                  className="w-full bg-[#12141c] border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-violet-500 transition-colors"
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-bold text-slate-300 mb-2">Contraseña</label>
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    name="password"
                    required
                    value={formData.password}
                    onChange={handleInputChange}
                    placeholder="••••••••"
                    className="w-full bg-[#12141c] border border-slate-700 rounded-xl px-4 py-3 pr-12 text-white focus:outline-none focus:border-violet-500 transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 transition-colors p-1"
                  >
                    {showPassword ? (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"></path></svg>
                    ) : (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path></svg>
                    )}
                  </button>
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-violet-600 hover:bg-violet-700 text-white font-bold py-3.5 px-6 rounded-xl transition-all disabled:opacity-50 flex justify-center items-center gap-2"
                >
                  {loading ? (
                    <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
                  ) : (
                    "Registrarse ahora"
                  )}
                </button>
              </div>
            </form>
          )}

          <div className="mt-8 text-center">
            <span className="text-slate-400 text-sm">¿Ya tienes una cuenta? </span>
            <Link to="/login" className="text-violet-400 hover:text-violet-300 text-sm font-bold transition-colors">
              Inicia Sesión
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
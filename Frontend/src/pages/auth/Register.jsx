import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useFetch } from "../../hooks/useFetch";
import { MdVisibility, MdVisibilityOff } from "react-icons/md";

const registerSchema = z.object({
  cedula: z
    .string()
    .length(10, "La cédula debe tener exactamente 10 dígitos")
    .regex(/^[0-9]+$/, "Solo se permiten números"),
  firstName: z
    .string()
    .min(2, "El nombre debe tener al menos 2 caracteres")
    .regex(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/, "Solo se permiten letras"),
  lastName: z
    .string()
    .min(2, "El apellido debe tener al menos 2 caracteres")
    .regex(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/, "Solo se permiten letras"),
  email: z
    .string()
    .min(1, "El correo es obligatorio")
    .email("Correo electrónico inválido")
    .refine((val) => val.endsWith("@epn.edu.ec"), {
      message: "Usa tu correo institucional (@epn.edu.ec)",
    }),
  password: z
    .string()
    .min(8, "Mínimo 8 caracteres"),
});

const Register = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [apiError, setApiError] = useState(null);
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');
  
  const { fetchDataBackend, loading } = useFetch();
  const navigate = useNavigate();

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(registerSchema)
  });

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

  const onSubmit = async (dataForm) => {
    setApiError(null);
    try {
      const ecuadorApiResponse = await fetch(`https://api.ecuadorapi.com/v1/person?id=${dataForm.cedula}`);
      
      if (!ecuadorApiResponse.ok) {
        setApiError("La cédula ingresada no existe o no es válida en el Registro Civil.");
        return;
      }

      const formattedData = {
        cedula: dataForm.cedula,
        name: `${dataForm.firstName} ${dataForm.lastName}`.trim(),
        email: dataForm.email,
        password: dataForm.password
      };

      const res = await fetchDataBackend("/auth/register", formattedData, "POST");
      if (res && !res.error) {
        navigate("/login");
      }
    } catch (error) {
      setApiError("Error de conexión con EcuadorAPI. Intenta nuevamente.");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex items-center justify-center p-6 transition-colors duration-300 relative font-sans">
      
      <Link 
        to="/" 
        className="absolute top-6 left-6 md:top-10 md:left-10 flex items-center gap-2 text-slate-500 dark:text-slate-400 hover:text-violet-600 dark:hover:text-violet-400 font-semibold transition-colors bg-white dark:bg-slate-800 px-4 py-2 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 z-10"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
        </svg>
        Regresar
      </Link>

      <button 
        onClick={toggleTheme} 
        className="absolute top-6 right-6 md:top-10 md:right-10 p-2 rounded-xl bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-violet-600 dark:hover:text-violet-400 border border-slate-200 dark:border-slate-700 shadow-sm transition-colors z-10"
      >
        {theme === 'light' ? (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"></path></svg>
        ) : (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>
        )}
      </button>

      <div className="w-full max-w-lg bg-white dark:bg-slate-800 rounded-3xl shadow-2xl border border-slate-100 dark:border-slate-700 p-8 md:p-12 relative overflow-hidden my-12 mt-20 md:mt-12">
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-emerald-500 to-violet-600"></div>
        
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 mb-4">
            <div className="bg-violet-600 text-white p-1.5 rounded-md font-bold text-lg">ESFOT</div>
            <span className="text-xl font-bold text-slate-800 dark:text-white">Rutas</span>
          </div>
          <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-2">Crea tu perfil TSDS</h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm">Organiza tu malla curricular y asegura tu avance en la EPN.</p>
        </div>

        {apiError && (
          <div className="mb-6 p-4 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 rounded-xl text-red-600 dark:text-red-400 text-sm font-medium text-center">
            {apiError}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          
          <div>
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Cédula de Identidad</label>
            <input 
              type="text" 
              placeholder="17xxxxxxxx"
              maxLength="10"
              className={`w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-900/50 border ${errors.cedula ? 'border-red-500' : 'border-slate-200 dark:border-slate-600'} text-slate-900 dark:text-white focus:ring-2 focus:ring-violet-600 focus:border-transparent outline-none transition-all placeholder-slate-400`}
              {...register("cedula")}
            />
            {errors.cedula && <p className="text-red-500 dark:text-red-400 text-xs mt-1.5 font-medium">{errors.cedula.message}</p>}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Nombres</label>
              <input 
                type="text" 
                placeholder="Ej. Andrés Josué"
                className={`w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-900/50 border ${errors.firstName ? 'border-red-500' : 'border-slate-200 dark:border-slate-600'} text-slate-900 dark:text-white focus:ring-2 focus:ring-violet-600 focus:border-transparent outline-none transition-all placeholder-slate-400`}
                {...register("firstName")}
              />
              {errors.firstName && <p className="text-red-500 dark:text-red-400 text-xs mt-1.5 font-medium">{errors.firstName.message}</p>}
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Apellidos</label>
              <input 
                type="text" 
                placeholder="Ej. Caiza Pilco"
                className={`w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-900/50 border ${errors.lastName ? 'border-red-500' : 'border-slate-200 dark:border-slate-600'} text-slate-900 dark:text-white focus:ring-2 focus:ring-violet-600 focus:border-transparent outline-none transition-all placeholder-slate-400`}
                {...register("lastName")}
              />
              {errors.lastName && <p className="text-red-500 dark:text-red-400 text-xs mt-1.5 font-medium">{errors.lastName.message}</p>}
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Correo Institucional (@epn.edu.ec)</label>
            <input 
              type="email" 
              placeholder="andres.caiza@epn.edu.ec"
              className={`w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-900/50 border ${errors.email ? 'border-red-500' : 'border-slate-200 dark:border-slate-600'} text-slate-900 dark:text-white focus:ring-2 focus:ring-violet-600 focus:border-transparent outline-none transition-all placeholder-slate-400`}
              {...register("email")}
            />
            {errors.email && <p className="text-red-500 dark:text-red-400 text-xs mt-1.5 font-medium">{errors.email.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Contraseña</label>
            <div className="relative">
              <input 
                type={showPassword ? "text" : "password"}
                placeholder="Mínimo 8 caracteres"
                className={`w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-900/50 border ${errors.password ? 'border-red-500' : 'border-slate-200 dark:border-slate-600'} text-slate-900 dark:text-white focus:ring-2 focus:ring-violet-600 focus:border-transparent outline-none transition-all placeholder-slate-400`}
                {...register("password")}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-3 flex items-center text-slate-400 hover:text-violet-600 dark:hover:text-violet-400 transition-colors"
              >
                {showPassword ? <MdVisibilityOff size={22} /> : <MdVisibility size={22} />}
              </button>
            </div>
            {errors.password && <p className="text-red-500 dark:text-red-400 text-xs mt-1.5 font-medium">{errors.password.message}</p>}
          </div>

          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed py-2">
            Al registrarte, aceptas que el sistema validará tu identidad mediante el Registro Civil y procesará tus datos académicos.
          </p>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-bold py-3.5 rounded-xl hover:shadow-lg hover:shadow-violet-500/30 transition-all active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed disabled:active:scale-100 flex justify-center items-center gap-2 mt-4"
          >
            {loading ? "Validando identidad..." : "Registrarse ahora"}
            {!loading && <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"></path></svg>}
          </button>
        </form>

        <p className="mt-8 text-center text-sm text-slate-600 dark:text-slate-400">
          ¿Ya tienes una cuenta? <Link to="/login" className="font-bold text-violet-600 dark:text-violet-400 hover:underline">Inicia Sesión</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
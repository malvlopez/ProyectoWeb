import { useForm } from "react-hook-form";
import { useFetch } from "../hooks/useFetch";
import { Link } from "react-router-dom";

const Login = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const { fetchDataBackend, loading } = useFetch();

  const onSubmit = async (data) => {
    const response = await fetchDataBackend("/auth/login", data, "POST");
    
    if (response) {
      console.log("Datos del usuario:", response);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-center text-gray-900">
          Plataforma de Mentorías ESFOT
        </h2>
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Correo Institucional
            </label>
            <input
              type="email"
              {...register("email", { required: true })}
              className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring focus:border-blue-500"
            />
            {errors.email && (
              <span className="text-sm text-red-500">Este campo es requerido</span>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Contraseña
            </label>
            <input
              type="password"
              {...register("password", { required: true })}
              className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring focus:border-blue-500"
            />
            {errors.password && (
              <span className="text-sm text-red-500">Este campo es requerido</span>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full px-4 py-2 text-white bg-blue-600 rounded hover:bg-blue-700 disabled:bg-blue-300 transition-colors"
          >
            {loading ? "Cargando..." : "Iniciar Sesión"}
          </button>
        </form>

        <div className="mt-4 flex flex-col space-y-3 text-sm text-center">
          <Link to="/forgot" className="text-blue-600 hover:underline">
            ¿Olvidaste tu contraseña?
          </Link>
          
          <div className="flex justify-center items-center space-x-2 mt-2 pt-4 border-t">
            <span className="text-gray-600">¿No tienes cuenta?</span>
            <Link to="/register" className="font-semibold text-blue-600 hover:underline">
              Regístrate aquí
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
import { useState } from "react";
import { MdVisibility, MdVisibilityOff } from "react-icons/md";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useFetch } from "../hooks/useFetch";

const Register = () => {
  const [showPassword, setShowPassword] = useState(false);
  const { fetchDataBackend, loading } = useFetch();
  const { register, handleSubmit, formState: { errors } } = useForm();

  const registerUser = async (dataForm) => {
    await fetchDataBackend("/estudiante/registro", dataForm, "POST");
  };

  return (
    <div className="flex flex-col sm:flex-row h-screen">
      <div className="w-full sm:w-1/2 h-screen bg-white flex justify-center items-center">
        <div className="md:w-4/5 sm:w-full px-4">
          <h1 className="text-3xl font-semibold mb-2 text-center uppercase text-gray-800">Bienvenido(a)</h1>
          <small className="text-gray-500 block my-4 text-sm text-center">Ingresa tus datos institucionales</small>

          <form onSubmit={handleSubmit(registerUser)}>
            <div className="mb-3">
              <label className="mb-2 block text-sm font-semibold">Nombre</label>
              <input
                type="text"
                placeholder="Ingresa tu nombre"
                className="block w-full rounded-md border border-gray-300 py-2 px-3 text-gray-700 focus:outline-none focus:border-blue-500"
                {...register("nombre", { required: "El nombre es obligatorio" })}
              />
              {errors.nombre && <p className="text-red-600 text-sm mt-1">{errors.nombre.message}</p>}
            </div>

            <div className="mb-3">
              <label className="mb-2 block text-sm font-semibold">Apellido</label>
              <input
                type="text"
                placeholder="Ingresa tu apellido"
                className="block w-full rounded-md border border-gray-300 py-2 px-3 text-gray-700 focus:outline-none focus:border-blue-500"
                {...register("apellido", { required: "El apellido es obligatorio" })}
              />
              {errors.apellido && <p className="text-red-600 text-sm mt-1">{errors.apellido.message}</p>}
            </div>

            <div className="mb-3">
              <label className="mb-2 block text-sm font-semibold">Correo Institucional</label>
              <input
                type="email"
                placeholder="nombre.apellido@epn.edu.ec"
                className="block w-full rounded-md border border-gray-300 py-2 px-3 text-gray-700 focus:outline-none focus:border-blue-500"
                {...register("email", { required: "El correo es obligatorio" })}
              />
              {errors.email && <p className="text-red-600 text-sm mt-1">{errors.email.message}</p>}
            </div>

            <div className="mb-3">
              <label className="block text-sm font-semibold mb-1">Contraseña</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="****************"
                  className="w-full rounded-md border border-gray-300 px-3 py-2 pr-10 focus:outline-none focus:border-blue-500"
                  {...register("password", { required: "La contraseña es obligatoria" })}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-3 flex items-center text-gray-500 hover:text-gray-700"
                >
                  {showPassword ? <MdVisibilityOff size={20} /> : <MdVisibility size={20} />}
                </button>
              </div>
              {errors.password && <p className="text-red-600 text-sm mt-1">{errors.password.message}</p>}
            </div>

            <div className="mb-3 mt-6">
              <button
                disabled={loading}
                className="bg-blue-600 text-white py-2 w-full rounded-xl hover:bg-blue-800 duration-300 disabled:bg-blue-300"
              >
                {loading ? "Registrando..." : "Registrarse"}
              </button>
            </div>
          </form>

          <div className="mt-5 text-sm flex justify-between items-center">
            <p className="text-gray-600">¿Ya posees una cuenta?</p>
            <Link to="/login" className="py-2 px-5 bg-gray-100 text-gray-600 border rounded-xl hover:scale-105 duration-300">
              Iniciar sesión
            </Link>
          </div>
        </div>
      </div>

      <div className="w-full sm:w-1/2 h-1/3 sm:h-screen bg-blue-50 hidden sm:flex items-center justify-center">
        <div className="text-center p-8">
          <h2 className="text-3xl font-bold text-blue-800 mb-4">Plataforma TSDS</h2>
          <p className="text-gray-600">Descubre tu ruta de aprendizaje y resuelve tus dudas con nuestra IA entrenada con los sílabos de la ESFOT.</p>
        </div>
      </div>
    </div>
  );
};

export default Register;
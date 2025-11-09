import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { useAuth } from '../../context/AuthContext';

const Login = () => {
  const { t } = useTranslation();
  const navegar = useNavigate();
  const { iniciarSesion } = useAuth();
  
  const [datosFormulario, setDatosFormulario] = useState({
    email: '',
    password: ''
  });
  
  const [cargando, setCargando] = useState(false);
  const [errores, setErrores] = useState({});
  const [indiceCarrusel, setIndiceCarrusel] = useState(0);
  
  const imagenesCarrusel = [
    {
      url: 'https://res.cloudinary.com/drec8g03e/image/upload/v1762667317/perfumes_hrhw7k.jpg',
      texto: 'Descubre tu esencia perfecta'
    },
    {
      url: 'https://res.cloudinary.com/drec8g03e/image/upload/v1762667317/perfumes1_qccydw.jpg',
      texto: 'Fragancias exclusivas para ti'
    },
    {
      url: 'https://res.cloudinary.com/drec8g03e/image/upload/v1762667317/perfumes2_g64pal.jpg',
      texto: 'Elegancia en cada gota'
    }
  ];

  useEffect(() => {
    const intervalo = setInterval(() => {
      setIndiceCarrusel((prevIndice) => (prevIndice + 1) % imagenesCarrusel.length);
    }, 5000);
    
    return () => clearInterval(intervalo);
  }, []);

  const validarFormulario = () => {
    const nuevosErrores = {};
    
    if (!datosFormulario.email) {
      nuevosErrores.email = t('auth.emailRequired');
    } else if (!/\S+@\S+\.\S+/.test(datosFormulario.email)) {
      nuevosErrores.email = t('auth.emailInvalid');
    }
    
    if (!datosFormulario.password) {
      nuevosErrores.password = t('auth.passwordRequired');
    } else if (datosFormulario.password.length < 6) {
      nuevosErrores.password = t('auth.passwordMinLength');
    }
    
    setErrores(nuevosErrores);
    return Object.keys(nuevosErrores).length === 0;
  };

  const manejarCambio = (e) => {
    const { name, value } = e.target;
    setDatosFormulario(prev => ({
      ...prev,
      [name]: value
    }));
    
    if (errores[name]) {
      setErrores(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const manejarEnvio = async (e) => {
    e.preventDefault();
    
    if (!validarFormulario()) return;
    
    setCargando(true);
    
    try {
      const datosUsuario = await iniciarSesion(datosFormulario.email, datosFormulario.password);
      
      await Swal.fire({
        icon: 'success',
        title: '¡Bienvenido!',
        text: t('message.loginSuccess'),
        confirmButtonColor: '#2563eb',
        timer: 2000,
        showConfirmButton: false
      });
      
      if (datosUsuario.role === 'ADMIN') {
        navegar('/admin');
      } else {
        navegar('/');
      }
      
    } catch (error) {
      console.error('Error en login:', error);
      
      let mensajeError = 'Error al iniciar sesión';
      let tituloError = 'Error de autenticación';
      let iconoError = 'error';
      
      // Verificar el código de error del backend
      const codigoError = error.response?.data?.codigo;
      
      if (codigoError === 'EMAIL_NO_ENCONTRADO') {
        tituloError = 'Correo no encontrado';
        mensajeError = error.response.data.error || 'No existe una cuenta con este correo electrónico';
        iconoError = 'warning';
      } else if (codigoError === 'CONTRASENA_INCORRECTA') {
        tituloError = 'Contraseña incorrecta';
        mensajeError = error.response.data.error || 'La contraseña ingresada es incorrecta';
        iconoError = 'error';
      } else if (error.response?.data?.error) {
        mensajeError = error.response.data.error;
      } else if (error.message) {
        mensajeError = error.message;
      } else if (error.response?.status === 401) {
        mensajeError = 'Credenciales incorrectas';
      } else if (error.response?.status === 404) {
        tituloError = 'Usuario no encontrado';
        mensajeError = 'No existe una cuenta con este correo';
        iconoError = 'warning';
      }
      
      await Swal.fire({
        icon: iconoError,
        title: tituloError,
        text: mensajeError,
        confirmButtonColor: '#2563eb',
        confirmButtonText: 'Intentar de nuevo'
      });
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="fixed top-0 left-0 w-screen h-screen flex font-['Lato',sans-serif] overflow-hidden z-40">
      {/* Panel de Imagen */}
      <div className="flex-[1.2] relative flex items-end p-10 overflow-hidden">
        {imagenesCarrusel.map((imagen, indice) => (
          <img
            key={indice}
            src={imagen.url}
            alt={`Perfume ${indice + 1}`}
            className={`absolute top-0 left-0 w-full h-full object-cover transition-opacity duration-1000 ${
              indice === indiceCarrusel ? 'opacity-100' : 'opacity-0'
            }`}
          />
        ))}
        
        <div className="relative z-10">
          <h2 className="font-['Merriweather',serif] font-bold text-4xl text-white mb-4 drop-shadow-lg">
            {imagenesCarrusel[indiceCarrusel].texto}
          </h2>
          <div className="flex gap-3">
            {imagenesCarrusel.map((_, indice) => (
              <span
                key={indice}
                onClick={() => setIndiceCarrusel(indice)}
                className={`w-3.5 h-3.5 rounded-full border-2 border-white cursor-pointer transition-all ${
                  indice === indiceCarrusel ? 'bg-white' : 'bg-white/30'
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Panel de Formulario */}
      <div className="flex-1 flex flex-col bg-white p-8 overflow-y-auto relative">
        {/* Botón Home */}
        <button
          onClick={() => navegar('/')}
          className="absolute top-8 right-8 p-2 rounded-full text-gray-400 hover:bg-gray-100 hover:text-blue-600 transition-colors z-10"
          aria-label="Volver a inicio"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
            <polyline points="9 22 9 12 15 12 15 22"></polyline>
          </svg>
        </button>

        {/* Contenido del Formulario */}
        <div className="flex-grow flex flex-col justify-center w-full max-w-md mx-auto">
          {/* Logo */}
          <div className="flex justify-center mb-8">
            <img
              src="https://res.cloudinary.com/drec8g03e/image/upload/v1762655746/jyjessence_y75wqc.webp"
              alt="JyJ Essence Logo"
              className="h-32 w-32 object-contain"
            />
          </div>

          <h1 className="font-['Lato',sans-serif] font-black text-4xl text-gray-800 text-center mb-12">
            {t('auth.loginTitle')}
          </h1>
          
          <form className="space-y-6" onSubmit={manejarEnvio}>
            <div className="text-left">
              <label htmlFor="email" className="block mb-2 font-bold text-gray-700 text-sm">
                {t('auth.email')}
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className={`w-full px-5 py-3.5 border rounded-lg bg-gray-50 text-base text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-600 ${
                  errores.email ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder={t('auth.email')}
                value={datosFormulario.email}
                onChange={manejarCambio}
              />
              {errores.email && (
                <p className="mt-1 text-sm text-red-600">{errores.email}</p>
              )}
            </div>
            
            <div className="text-left">
              <label htmlFor="password" className="block mb-2 font-bold text-gray-700 text-sm">
                {t('auth.password')}
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className={`w-full px-5 py-3.5 border rounded-lg bg-gray-50 text-base text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-600 ${
                  errores.password ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder={t('auth.password')}
                value={datosFormulario.password}
                onChange={manejarCambio}
              />
              {errores.password && (
                <p className="mt-1 text-sm text-red-600">{errores.password}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={cargando}
              className="w-full py-3.5 px-4 rounded-lg border-none bg-blue-600 text-white text-lg font-bold cursor-pointer transition-all shadow-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed mt-4"
            >
              {cargando ? t('common.loading') : t('auth.login')}
            </button>
          </form>

          <div className="text-center mt-8 text-gray-700">
            <span>
              {t('auth.noAccount')}{' '}
              <button
                onClick={() => navegar('/auth/register')}
                className="text-blue-600 font-bold hover:underline"
              >
                {t('auth.register')}
              </button>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
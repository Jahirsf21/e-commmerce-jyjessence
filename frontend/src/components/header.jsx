import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';
import ModalPerfil from './ModalPerfil';

const Header = () => {
  const { t, i18n } = useTranslation();
  const navegar = useNavigate();
  const { usuario, estaAutenticado } = useAuth();
  const [mostrarMenuIdioma, setMostrarMenuIdioma] = useState(false);
  const [mostrarModalPerfil, setMostrarModalPerfil] = useState(false);

  const cambiarIdioma = (codigo) => {
    i18n.changeLanguage(codigo);
    setMostrarMenuIdioma(false);
  };

  const nombrePerfil = estaAutenticado 
    ? `${usuario?.nombre || ''} ${usuario?.apellido || ''}`.trim() || 'Mi Perfil'
    : 'Cuenta';

  return (
    <>
      <header className="fixed top-0 left-0 w-full z-[1000] shadow-sm bg-[#f5f5f5] border-b border-gray-200 font-['Lato',sans-serif]">
        <div className="relative flex items-center justify-between px-3 md:px-6 py-3 gap-2">
          {/* Logo */}
          <Link to="/" className="no-underline flex-shrink-0">
            <h1 className="flex items-center gap-2 md:gap-4 m-0 text-blue-600 text-xl md:text-3xl font-bold">
              <img
                src="https://res.cloudinary.com/drec8g03e/image/upload/v1762655746/jyjessence_y75wqc.webp"
                alt="JyJ Essence Logo"
                className="h-10 md:h-16"
              />
              <span className="hidden sm:inline">JyJ Essence</span>
            </h1>
          </Link>

          {/* Search bar - hidden on mobile, centered on desktop */}
          <div className="hidden lg:block absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-[500px] px-4">
            <form className="flex items-center bg-white border-2 border-blue-600 rounded-full px-2 py-1.5 shadow-md w-full transition-shadow hover:shadow-lg">
              <input
                type="text"
                className="border-none outline-none flex-grow px-5 py-2 text-base bg-transparent text-gray-700 placeholder-gray-400"
                placeholder={t('header.searchPlaceholder') || 'Buscar productos...'}
              />
              <button
                type="submit"
                className="bg-blue-600 border-none rounded-full w-10 h-10 flex justify-center items-center cursor-pointer text-white transition-colors hover:bg-blue-700"
                aria-label="Buscar"
              >
                <img
                  src="https://res.cloudinary.com/drec8g03e/image/upload/v1762674408/search_mntlda.svg"
                  alt="Buscar"
                  className="w-5 h-5 invert"
                />
              </button>
            </form>
          </div>

          {/* Right side buttons */}
          <div className="flex items-center gap-2 md:gap-3 lg:gap-5 flex-shrink-0">
            {/* Search button - only visible on mobile */}
            <button
              type="button"
              className="lg:hidden bg-white border border-gray-300 rounded-full w-10 h-10 md:w-12 md:h-12 flex justify-center items-center cursor-pointer transition-all hover:shadow-md hover:border-gray-400"
              aria-label="Buscar"
            >
              <img
                src="https://res.cloudinary.com/drec8g03e/image/upload/v1762674408/search_mntlda.svg"
                alt="Buscar"
                className="w-5 h-5"
              />
            </button>

            {/* Language dropdown */}
            <div className="relative inline-block">
              <button
                className="bg-white border border-gray-300 rounded-full px-2 md:px-4 py-2 flex items-center gap-1 md:gap-2 cursor-pointer transition-all hover:shadow-md hover:border-gray-400 h-10 md:h-12 min-w-[40px] md:min-w-[120px]"
                onClick={() => setMostrarMenuIdioma(!mostrarMenuIdioma)}
                aria-label="Cambiar idioma"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="flex-shrink-0">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="2" y1="12" x2="22" y2="12" />
                  <path d="M12 2a15.3 15.3 0 0 1 0 20a15.3 15.3 0 0 1 0-20" />
                </svg>
                <span className="hidden md:inline font-semibold text-gray-800 text-base">
                  {i18n.language === 'es' ? 'Español' : 'English'}
                </span>
              </button>
              {mostrarMenuIdioma && (
                <div className="absolute top-full left-0 bg-white border border-gray-200 rounded-lg shadow-lg min-w-[140px] md:min-w-[180px] z-[1001] mt-2 overflow-hidden">
                  <button 
                    onClick={() => cambiarIdioma('es')} 
                    className={`block w-full px-4 md:px-5 py-2 md:py-3 text-left bg-none border-none text-gray-700 text-sm md:text-base cursor-pointer transition-colors hover:bg-gray-100 ${
                      i18n.language === 'es' ? 'bg-blue-50 font-semibold' : ''
                    }`}
                  >
                    {i18n.language === 'es' && '✓ '}Español
                  </button>
                  <button 
                    onClick={() => cambiarIdioma('en')} 
                    className={`block w-full px-4 md:px-5 py-2 md:py-3 text-left bg-none border-none text-gray-700 text-sm md:text-base cursor-pointer transition-colors hover:bg-gray-100 ${
                      i18n.language === 'en' ? 'bg-blue-50 font-semibold' : ''
                    }`}
                  >
                    {i18n.language === 'en' && '✓ '}English
                  </button>
                </div>
              )}
            </div>

            {/* Cart button */}
            <Link 
              to="/cart" 
              className="bg-white border border-gray-300 rounded-full px-2 md:px-4 py-2 flex items-center gap-1 md:gap-2 cursor-pointer transition-all hover:shadow-md hover:border-gray-400 h-10 md:h-12 min-w-[40px] md:min-w-[120px] no-underline" 
              aria-label="Carrito"
            >
              <img
                src="https://res.cloudinary.com/drec8g03e/image/upload/v1762674408/carrito_idlvij.svg"
                alt="Carrito"
                className="h-5 w-5 md:h-6 md:w-6 object-contain flex-shrink-0"
              />
              <span className="hidden md:inline font-semibold text-gray-800 text-base">{t('nav.cart')}</span>
            </Link>

            {/* Profile button */}
            <button
              className="bg-white border border-gray-300 rounded-full px-2 md:px-4 py-2 flex items-center gap-1 md:gap-2 cursor-pointer transition-all hover:shadow-md hover:border-gray-400 h-10 md:h-12 min-w-[40px] md:min-w-[120px]"
              onClick={() => setMostrarModalPerfil(true)}
              aria-label="Menú de usuario"
            >
              <img
                src="https://res.cloudinary.com/drec8g03e/image/upload/v1762674408/account_r3kxej.svg"
                alt="Perfil"
                className="h-5 w-5 md:h-6 md:w-6 object-contain flex-shrink-0"
              />
              <span className="hidden md:inline font-semibold text-gray-800 text-base truncate max-w-[100px]">
                {nombrePerfil}
              </span>
            </button>
          </div>
        </div>

        {/* Mobile search bar - below header */}
        <div className="lg:hidden px-3 pb-3">
          <form className="flex items-center bg-white border-2 border-blue-600 rounded-full px-2 py-1.5 shadow-md w-full transition-shadow hover:shadow-lg">
            <input
              type="text"
              className="border-none outline-none flex-grow px-3 md:px-5 py-2 text-sm md:text-base bg-transparent text-gray-700 placeholder-gray-400"
              placeholder={t('header.searchPlaceholder') || 'Buscar productos...'}
            />
            <button
              type="submit"
              className="bg-blue-600 border-none rounded-full w-9 h-9 md:w-10 md:h-10 flex justify-center items-center cursor-pointer text-white transition-colors hover:bg-blue-700"
              aria-label="Buscar"
            >
              <img
                src="https://res.cloudinary.com/drec8g03e/image/upload/v1762674408/search_mntlda.svg"
                alt="Buscar"
                className="w-4 h-4 md:w-5 md:h-5 invert"
              />
            </button>
          </form>
        </div>
      </header>

      {mostrarModalPerfil && (
        <ModalPerfil 
          onClose={() => setMostrarModalPerfil(false)}
          estaAutenticado={estaAutenticado}
          usuario={usuario}
          navegar={navegar}
          t={t}
        />
      )}
    </>
  );
};

export default Header;
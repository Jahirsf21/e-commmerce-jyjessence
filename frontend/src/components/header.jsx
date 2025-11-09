import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';
import LanguageDropdown from './LanguageDropdown';

const Header = () => {
  const { t, i18n } = useTranslation();
  const navegar = useNavigate();
  const { usuario, estaAutenticado, cerrarSesion } = useAuth();

  const manejarCierreSesion = () => {
    cerrarSesion();
    navegar('/');
  };

  return (
    <header>
  <div className="bg-blue-900 text-white text-xs flex justify-end items-center px-4 py-2">
        <div className="mr-4">
          <LanguageDropdown
            value={i18n.language}
            onChange={codigo => i18n.changeLanguage(codigo)}
          />
        </div>
        <a
          href="https://www.instagram.com/jyj.essence"
          target="_blank"
          rel="noopener noreferrer"
          className="ml-4"
        >
          <img
            src="https://res.cloudinary.com/drec8g03e/image/upload/v1762661193/instagram_znvg6o.svg"
            alt="Instagram JyJ Essence"
            className="h-6 w-6 object-contain"
            style={{ display: 'inline-block' }}
          />
        </a>
        <a
          href="https://wa.me/50660440248"
          target="_blank"
          rel="noopener noreferrer"
          className="ml-4 mr-10"
        >
          <img
            src="https://res.cloudinary.com/drec8g03e/image/upload/v1762661324/whatsapp_yc9csu.svg"
            alt="WhatsApp JyJ Essence"
            className="h-6 w-6 object-contain"
            style={{ display: 'inline-block' }}
          />
        </a>
      </div>

      <div className="bg-white shadow-sm border-b border-gray-200 w-full">
        <div className="px-4 sm:px-6 lg:px-8 flex items-center h-20 w-full">
          <Link to="/" className="flex items-center mr-8">
            <img
              src="https://res.cloudinary.com/drec8g03e/image/upload/v1762655746/jyjessence_y75wqc.webp"
              alt="JyJ Essence Logo"
              className="h-20 w-20 object-contain"
            />
            <span className="ml-3 text-3xl font-bold text-blue-600 hover:text-blue-700">JyJ Essence</span>
          </Link>

          <nav className="flex-1 flex justify-center space-x-8">
            {usuario?.rol === 'ADMIN' && (
              <Link to="/admin" className="text-gray-700 hover:text-blue-600 text-base font-medium">{t('nav.admin')}</Link>
            )}
          </nav>

          <div className="flex items-center space-x-4">
            <Link to="/search" className="text-gray-700 hover:text-blue-600 flex items-center p-2">
              <img
                src="https://res.cloudinary.com/drec8g03e/image/upload/v1762674408/search_mntlda.svg"
                alt="Buscar"
                className="h-6 w-6 object-contain"
              />
            </Link>
            <Link to="/cart" className="text-gray-700 hover:text-blue-600 flex items-center p-2">
              <img
                src="https://res.cloudinary.com/drec8g03e/image/upload/v1762674408/carrito_idlvij.svg"
                alt="Shopping Cart"
                className="h-6 w-6 object-contain"
              />
            </Link>
            {estaAutenticado ? (
              <Link to="/account" className="text-gray-700 hover:text-blue-600 px-4 py-2 text-sm font-medium flex items-center">
                <img
                  src="https://res.cloudinary.com/drec8g03e/image/upload/v1762674408/account_r3kxej.svg"
                  alt="Account"
                  className="h-5 w-5 mr-2 object-contain"
                />
                {t('nav.myAccount')}
              </Link>
            ) : (
              <>
                <button
                  onClick={() => navegar('/auth/login')}
                  className="text-gray-700 hover:text-blue-600 px-4 py-2 text-sm font-medium flex items-center"
                >
                  <img
                    src="https://res.cloudinary.com/drec8g03e/image/upload/v1762674408/account_r3kxej.svg"
                    alt="Account"
                    className="h-5 w-5 mr-2 object-contain"
                  />
                  {t('nav.login')}
                </button>
                <button
                  onClick={() => navegar('/auth/register')}
                  className="bg-blue-600 text-white hover:bg-blue-700 px-4 py-2 text-sm font-medium rounded-md"
                >
                  {t('nav.register')}
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
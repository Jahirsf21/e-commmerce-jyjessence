import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

api.interceptors.request.use(
  (configuracion) => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decodificado = jwtDecode(token);
        const ahora = Date.now() / 1000;
        
        if (decodificado.exp < ahora) {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          window.location.href = '/login';
          return Promise.reject(new Error('Token expirado'));
        }
        
        configuracion.headers.Authorization = `Bearer ${token}`;
      } catch (error) {
        console.error('Error decodificando token:', error);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    }
    return configuracion;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (respuesta) => respuesta,
  (error) => {
    if (error.response?.status === 401) {
      const rutaActual = window.location.pathname;
      
      if (!rutaActual.includes('/auth/login') && !rutaActual.includes('/auth/register')) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/auth/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;

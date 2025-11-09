import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from './context/AuthContext';
import { ToastContainer } from 'react-toastify';
import Header from './components/header';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './pages/Home';
import 'react-toastify/dist/ReactToastify.css';
import './App.css';

// Crear QueryClient
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 5 * 60 * 1000, // 5 minutos
    },
  },
});

// Componente interno para manejar el layout
function AppLayout() {
  const location = useLocation();
  const rutasAutenticacion = ['/auth/login', '/auth/register'];
  const ocultarHeader = rutasAutenticacion.includes(location.pathname);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header - Solo se muestra si NO estamos en rutas de autenticación */}
      {!ocultarHeader && <Header />}
      
      {/* Contenido principal */}
      <main className={!ocultarHeader ? "w-full px-4 py-8" : ""}>
        <Routes>
          {/* Rutas públicas */}
          <Route path="/" element={<Home />} />
          
          {/* Rutas de autenticación */}
          <Route path="/auth/login" element={<Login />} />
          <Route path="/auth/register" element={<Register />} />
          
          {/* Rutas protegidas */}
          <Route path="/account" element={
            <ProtectedRoute>
              <div className="text-center">
                <h1 className="text-4xl font-bold text-blue-600 mb-8">
                  Mi Cuenta
                </h1>
                <p className="text-gray-600">
                  Bienvenido a tu panel de usuario
                </p>
              </div>
            </ProtectedRoute>
          } />
          
          <Route path="/admin" element={
            <ProtectedRoute requiredRole="ADMIN">
              <div className="text-center">
                <h1 className="text-4xl font-bold text-blue-600 mb-8">
                  Panel de Administración
                </h1>
                <p className="text-gray-600">
                  Solo visible para administradores
                </p>
              </div>
            </ProtectedRoute>
          } />
          
          {/* Rutas de catálogo y carrito (públicas por ahora) */}
          <Route path="/products" element={
            <div className="text-center">
              <h1 className="text-4xl font-bold text-blue-600 mb-8">
                Catálogo de Productos
              </h1>
              <p className="text-gray-600">
                Próximamente disponible
              </p>
            </div>
          } />
          
          <Route path="/cart" element={
            <div className="text-center">
              <h1 className="text-4xl font-bold text-blue-600 mb-8">
                Carrito de Compras
              </h1>
              <p className="text-gray-600">
                Tu carrito está vacío
              </p>
            </div>
          } />
          
          {/* Redirección por defecto */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router>
          <AppLayout />
          <ToastContainer
            position="top-right"
            autoClose={3000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="light"
          />
        </Router>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;

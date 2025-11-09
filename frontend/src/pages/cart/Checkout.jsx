import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Swal from 'sweetalert2';
import api from '../../services/api';

const Checkout = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [carrito, setCarrito] = useState({ items: [], total: 0, cantidadItems: 0 });
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    cargarCarrito();
  }, []);

  const cargarCarrito = async () => {
    try {
      setCargando(true);
      const response = await api.get('/carrito');
      console.log('🛒 Carrito cargado en checkout:', response.data);
      
      // Validar que la respuesta sea un objeto con items
      if (response.data && typeof response.data === 'object' && Array.isArray(response.data.items)) {
        setCarrito(response.data);
      } else {
        console.error('❌ Respuesta inválida del servidor:', response.data);
        throw new Error('Respuesta inválida del servidor');
      }
    } catch (error) {
      console.error('❌ Error al cargar carrito:', error);
      Swal.fire({
        icon: 'error',
        title: t('error'),
        text: t('errorLoadingCart'),
      });
      // Mantener el carrito vacío en caso de error
      setCarrito({ items: [], total: 0, cantidadItems: 0 });
    } finally {
      setCargando(false);
    }
  };

  const procesarPago = async () => {
    if (!carrito || !carrito.items || carrito.items.length === 0) {
      Swal.fire({
        icon: 'warning',
        title: t('emptyCart'),
        text: t('addProductsFirst'),
      });
      return;
    }

    setLoading(true);

    try {
      const response = await api.post('/pedidos/checkout');
      
      const { checkoutUrl, pedido } = response.data;

      // Guardar pedidoId en sessionStorage para verificar después
      sessionStorage.setItem('pendingOrderId', pedido.idPedido);

      // Redirigir a Onvo Pay
      window.location.href = checkoutUrl;
    } catch (error) {
      console.error('Error al procesar pago:', error);
      setLoading(false);
      
      Swal.fire({
        icon: 'error',
        title: t('paymentError'),
        text: error.response?.data?.error || t('tryAgainLater'),
      });
    }
  };

  if (cargando) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          {t('checkout')}
        </h1>

        {/* Resumen del Carrito */}
        <div className="bg-white shadow-md rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">{t('orderSummary')}</h2>
          
          {carrito.items.map((item) => (
            <div key={item.productoId} className="flex justify-between items-center py-3 border-b">
              <div>
                <p className="font-medium">{item.nombre}</p>
                <p className="text-sm text-gray-500">
                  {t('quantity')}: {item.cantidad} × ${item.precioUnitario.toFixed(2)}
                </p>
              </div>
              <p className="font-semibold">
                ${(item.cantidad * item.precioUnitario).toFixed(2)}
              </p>
            </div>
          ))}

          <div className="mt-4 pt-4 border-t-2 border-gray-200">
            <div className="flex justify-between items-center text-lg font-bold">
              <span>{t('total')}</span>
              <span className="text-purple-600">
                ${carrito.total.toFixed(2)} COP
              </span>
            </div>
          </div>
        </div>

        {/* Información de Pago */}
        <div className="bg-white shadow-md rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">{t('paymentMethod')}</h2>
          
          <div className="flex items-center space-x-3 p-4 border-2 border-purple-200 rounded-lg bg-purple-50">
            <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
            </svg>
            <div>
              <p className="font-semibold">Onvo Pay</p>
              <p className="text-sm text-gray-600">{t('securePayment')}</p>
            </div>
          </div>

          <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-800">
              ℹ️ {t('onvoPayInfo')}
            </p>
          </div>
        </div>

        {/* Botones de Acción */}
        <div className="flex flex-col sm:flex-row gap-4">
          <button
            onClick={() => navigate('/cart')}
            className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
            disabled={loading}
          >
            {t('backToCart')}
          </button>
          
          <button
            onClick={procesarPago}
            disabled={loading}
            className="flex-1 px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors font-medium flex items-center justify-center"
          >
            {loading ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                {t('processing')}
              </>
            ) : (
              <>
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                {t('proceedToPayment')}
              </>
            )}
          </button>
        </div>

        {/* Información de Seguridad */}
        <div className="mt-6 text-center text-sm text-gray-500">
          <p>{t('secureConnection')}</p>
        </div>
      </div>
    </div>
  );
};

export default Checkout;

import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import api from '../../services/api';

const CheckoutSuccess = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [verificando, setVerificando] = useState(true);
  const [pedido, setPedido] = useState(null);

  useEffect(() => {
    verificarPago();
  }, []);

  const verificarPago = async () => {
    const pedidoId = searchParams.get('pedido');
    const isMock = searchParams.get('mock') === 'true';
    
    if (!pedidoId) {
      navigate('/');
      return;
    }

    try {
      // En modo mock, esperar menos tiempo
      await new Promise(resolve => setTimeout(resolve, isMock ? 500 : 2000));

      const response = await api.get(`/pedidos/${pedidoId}`);
      setPedido(response.data);
      
      // Limpiar sessionStorage
      sessionStorage.removeItem('pendingOrderId');
    } catch (error) {
      console.error('Error al verificar pago:', error);
    } finally {
      setVerificando(false);
    }
  };

  if (verificando) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-green-50 to-blue-50">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-green-500 mb-4"></div>
        <p className="text-lg text-gray-700">{t('verifyingPayment')}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white shadow-xl rounded-2xl overflow-hidden">
          {/* Header con ícono de éxito */}
          <div className="bg-gradient-to-r from-green-500 to-green-600 p-8 text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-white rounded-full mb-4">
              <svg className="w-12 h-12 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">
              {t('paymentSuccessful')}
            </h1>
            <p className="text-green-100">
              {t('thankYouForPurchase')}
            </p>
          </div>

          {/* Información del pedido */}
          <div className="p-8">
            {pedido && (
              <>
                <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-gray-500">{t('orderNumber')}</p>
                      <p className="font-semibold text-lg">#{pedido.idPedido}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">{t('paymentStatus')}</p>
                      <span className="inline-block px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                        {t('paid')}
                      </span>
                    </div>
                    <div>
                      <p className="text-gray-500">{t('total')}</p>
                      <p className="font-bold text-lg text-green-600">
                        ${pedido.montoTotal?.toFixed(2) || '0.00'} COP
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-500">{t('date')}</p>
                      <p className="font-medium">
                        {new Date(pedido.fecha).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Productos */}
                <div className="mb-6">
                  <h3 className="text-lg font-semibold mb-3">{t('orderItems')}</h3>
                  <div className="space-y-2">
                    {pedido.articulos.map((item) => (
                      <div key={item.idArticulo} className="flex justify-between items-center py-2 border-b">
                        <div>
                          <p className="font-medium">{item.producto.nombre}</p>
                          <p className="text-sm text-gray-500">
                            {t('quantity')}: {item.cantidad}
                          </p>
                        </div>
                        <p className="font-semibold">
                          ${(item.cantidad * item.precioUnitario).toFixed(2)}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Información de envío */}
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg mb-6">
                  <p className="text-sm text-blue-800">
                    📧 {t('confirmationEmailSent')}
                  </p>
                </div>
              </>
            )}

            {/* Botones de acción */}
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={() => navigate('/account/orders')}
                className="flex-1 px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium"
              >
                {t('viewOrders')}
              </button>
              <button
                onClick={() => navigate('/')}
                className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
              >
                {t('backToHome')}
              </button>
            </div>
          </div>
        </div>

        {/* Siguiente paso */}
        <div className="mt-6 text-center">
          <p className="text-gray-600">
            {t('trackOrderStatus')}
          </p>
        </div>
      </div>
    </div>
  );
};

export default CheckoutSuccess;

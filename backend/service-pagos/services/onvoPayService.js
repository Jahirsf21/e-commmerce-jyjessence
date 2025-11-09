import 'dotenv/config';
import axios from 'axios';

class OnvoPayService {
  constructor() {
    // Intentar con la URL de sandbox/test para las claves de prueba
    // Posibles URLs base: sandbox.onvopay.com, test.onvopay.com, api-test.onvopay.com
    this.baseURL = process.env.ONVO_API_URL || 'https://sandbox.onvopay.com';
    this.secretKey = process.env.ONVO_SECRET_KEY;
    this.useMock = process.env.USE_MOCK_PAYMENT === 'true';
    
    if (!this.secretKey && !this.useMock) {
      throw new Error('ONVO_SECRET_KEY no está configurada en las variables de entorno');
    }
    
    if (this.useMock) {
      console.log('⚠️  MODO SIMULACIÓN ACTIVADO - No se usará la API real de Onvo Pay');
    } else {
      console.log('🔧 OnvoPayService inicializado con URL:', this.baseURL);
    }
  }

  /**
   * Crea una sesión de pago (checkout) en Onvo Pay
   * @param {Object} datos - Datos del pago
   * @param {number} datos.amount - Monto en centavos (ej: 10000 = 100.00)
   * @param {string} datos.currency - Moneda (COP, USD, etc.)
   * @param {string} datos.description - Descripción del pago
   * @param {string} datos.customerEmail - Email del cliente
   * @param {string} datos.customerName - Nombre del cliente
   * @param {string} datos.orderId - ID del pedido interno
   * @param {string} datos.successUrl - URL de redirección exitosa
   * @param {string} datos.cancelUrl - URL de cancelación
   * @returns {Promise<Object>} - Respuesta de Onvo Pay con checkout_url y payment_id
   */
  async createCheckout(datos) {
    // MODO SIMULACIÓN - Para pruebas sin API real
    if (this.useMock) {
      console.log('🎭 SIMULACIÓN: Creando checkout mock');
      const mockPaymentId = `mock_pay_${Date.now()}`;
      const mockCheckoutUrl = `${datos.successUrl}&mock=true&payment_id=${mockPaymentId}`;
      
      return {
        paymentId: mockPaymentId,
        checkoutUrl: mockCheckoutUrl,
        status: 'pending',
      };
    }
    
    // MODO REAL - Llamada a Onvo Pay
    try {
      console.log('🔷 Creando checkout en Onvo Pay...');
      console.log('🔷 URL:', `${this.baseURL}/checkout-sessions`);
      console.log('🔷 Datos:', JSON.stringify(datos, null, 2));
      
      const response = await axios.post(
        `${this.baseURL}/checkout-sessions`,
        {
          amount: datos.amount,
          currency: datos.currency || 'COP',
          description: datos.description,
          customer: {
            email: datos.customerEmail,
            name: datos.customerName,
          },
          metadata: {
            order_id: datos.orderId,
          },
          success_url: datos.successUrl,
          cancel_url: datos.cancelUrl,
        },
        {
          headers: {
            'Authorization': `Bearer ${this.secretKey}`,
            'Content-Type': 'application/json',
          },
        }
      );

      console.log('✅ Checkout creado exitosamente:', response.data);

      return {
        paymentId: response.data.id,
        checkoutUrl: response.data.checkout_url || response.data.url || response.data.payment_url,
        status: response.data.status,
      };
    } catch (error) {
      console.error('❌ Error completo:', {
        message: error.message,
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        config: {
          url: error.config?.url,
          method: error.config?.method,
          baseURL: error.config?.baseURL
        }
      });
      
      throw new Error(
        error.response?.data?.message || error.message || 'Error al crear sesión de pago con Onvo Pay'
      );
    }
  }

  /**
   * Obtiene el estado de un pago
   * @param {string} paymentId - ID del pago en Onvo Pay
   * @returns {Promise<Object>} - Estado del pago
   */
  async getPaymentStatus(paymentId) {
    try {
      const response = await axios.get(
        `${this.baseURL}/payments/${paymentId}`,
        {
          headers: {
            'Authorization': `Bearer ${this.secretKey}`,
          },
        }
      );

      return {
        id: response.data.id,
        status: response.data.status, // "pending", "succeeded", "failed", "canceled"
        amount: response.data.amount,
        currency: response.data.currency,
        metadata: response.data.metadata,
      };
    } catch (error) {
      console.error('Error obteniendo estado del pago:', error.response?.data || error.message);
      throw new Error('Error al obtener estado del pago');
    }
  }

  /**
   * Verifica la firma de un webhook de Onvo Pay
   * @param {Object} payload - Cuerpo del webhook
   * @param {string} signature - Firma del header
   * @returns {boolean} - true si la firma es válida
   */
  verifyWebhookSignature(payload, signature) {
    // Onvo Pay usa HMAC SHA-256 para firmar webhooks
    // La implementación exacta depende de su documentación
    // Por ahora, validamos que exista la firma
    return !!signature;
  }

  /**
   * Procesa un evento de webhook
   * @param {Object} event - Evento del webhook
   * @returns {Object} - Datos procesados del evento
   */
  processWebhookEvent(event) {
    const { type, data } = event;

    switch (type) {
      case 'payment.succeeded':
        return {
          action: 'confirmar_pago',
          paymentId: data.id,
          orderId: data.metadata?.order_id,
          amount: data.amount,
          status: 'pagado',
        };

      case 'payment.failed':
        return {
          action: 'marcar_fallido',
          paymentId: data.id,
          orderId: data.metadata?.order_id,
          status: 'fallido',
          errorMessage: data.failure_message,
        };

      case 'payment.canceled':
        return {
          action: 'marcar_cancelado',
          paymentId: data.id,
          orderId: data.metadata?.order_id,
          status: 'cancelado',
        };

      case 'payment.refunded':
        return {
          action: 'marcar_reembolsado',
          paymentId: data.id,
          orderId: data.metadata?.order_id,
          status: 'reembolsado',
        };

      default:
        return {
          action: 'evento_desconocido',
          type,
        };
    }
  }

  /**
   * Crea un reembolso
   * @param {string} paymentId - ID del pago a reembolsar
   * @param {number} amount - Monto a reembolsar (opcional, null = total)
   * @returns {Promise<Object>} - Datos del reembolso
   */
  async createRefund(paymentId, amount = null) {
    try {
      const response = await axios.post(
        `${this.baseURL}/refunds`,
        {
          payment_id: paymentId,
          amount: amount,
        },
        {
          headers: {
            'Authorization': `Bearer ${this.secretKey}`,
            'Content-Type': 'application/json',
          },
        }
      );

      return {
        refundId: response.data.id,
        status: response.data.status,
        amount: response.data.amount,
      };
    } catch (error) {
      console.error('Error creando reembolso:', error.response?.data || error.message);
      throw new Error('Error al crear reembolso');
    }
  }
}

export default new OnvoPayService();

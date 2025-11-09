import 'dotenv/config';
import express from 'express';
import authMiddleware from '../shared/middleware/auth.js';
import isAdmin from '../shared/middleware/admin.js';
import onvoPayService from './services/onvoPayService.js';
import prisma from '../database/config/prisma.js';

const app = express();
app.use(express.json());

/**
 * POST /api/pagos/checkout
 * Crea una sesión de pago con Onvo Pay para un pedido
 */
app.post('/api/pagos/checkout', authMiddleware, async (req, res) => {
  try {
    const { pedidoId } = req.body;
    const clienteId = req.user.idCliente;

    if (!pedidoId) {
      return res.status(400).json({ error: 'pedidoId es requerido' });
    }

    // Obtener el pedido con sus artículos
    const pedido = await prisma.pedido.findUnique({
      where: { idPedido: pedidoId },
      include: {
        articulos: {
          include: {
            producto: true,
          },
        },
        cliente: true,
      },
    });

    if (!pedido) {
      return res.status(404).json({ error: 'Pedido no encontrado' });
    }

    if (pedido.clienteId !== clienteId) {
      return res.status(403).json({ error: 'No tienes permiso para pagar este pedido' });
    }

    if (pedido.estadoPago === 'pagado') {
      return res.status(400).json({ error: 'Este pedido ya ha sido pagado' });
    }

    // Calcular el monto total si no está guardado
    let montoTotal = pedido.montoTotal;
    if (!montoTotal || montoTotal === 0) {
      montoTotal = pedido.articulos.reduce(
        (total, item) => total + item.cantidad * item.precioUnitario,
        0
      );
      
      // Actualizar monto total en el pedido
      await prisma.pedido.update({
        where: { idPedido: pedidoId },
        data: { montoTotal },
      });
    }

    // Convertir a centavos (Onvo Pay usa centavos)
    const amountInCents = Math.round(montoTotal * 100);

    // URLs de retorno
    const baseUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
    const successUrl = `${baseUrl}/checkout/success?pedido=${pedidoId}`;
    const cancelUrl = `${baseUrl}/checkout/cancel?pedido=${pedidoId}`;

    // Crear checkout en Onvo Pay
    const checkoutData = await onvoPayService.createCheckout({
      amount: amountInCents,
      currency: 'COP',
      description: `Pedido #${pedidoId} - JyJ Essence`,
      customerEmail: pedido.cliente.email,
      customerName: `${pedido.cliente.nombre} ${pedido.cliente.apellido}`,
      orderId: pedidoId,
      successUrl,
      cancelUrl,
    });

    // Actualizar pedido con datos de Onvo Pay
    const pedidoActualizado = await prisma.pedido.update({
      where: { idPedido: pedidoId },
      data: {
        onvoPaymentId: checkoutData.paymentId,
        onvoCheckoutUrl: checkoutData.checkoutUrl,
        metodoPago: 'onvo_pay',
        estadoPago: 'pendiente',
      },
    });

    res.status(200).json({
      mensaje: 'Sesión de pago creada exitosamente',
      checkoutUrl: checkoutData.checkoutUrl,
      paymentId: checkoutData.paymentId,
      pedido: pedidoActualizado,
    });
  } catch (error) {
    console.error('Error creando checkout:', error);
    res.status(500).json({ 
      error: error.message || 'Error al crear sesión de pago' 
    });
  }
});

/**
 * POST /api/pagos/webhook
 * Endpoint para recibir notificaciones de Onvo Pay
 */
app.post('/api/pagos/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  try {
    const signature = req.headers['onvo-signature'];
    
    // Verificar firma del webhook (implementar según documentación de Onvo Pay)
    if (!onvoPayService.verifyWebhookSignature(req.body, signature)) {
      return res.status(401).json({ error: 'Firma de webhook inválida' });
    }

    const event = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
    
    console.log('Webhook recibido:', event.type);

    // Procesar el evento
    const processedEvent = onvoPayService.processWebhookEvent(event);

    if (processedEvent.action === 'evento_desconocido') {
      console.log('Tipo de evento desconocido:', processedEvent.type);
      return res.status(200).json({ received: true });
    }

    // Buscar el pedido por el paymentId de Onvo Pay
    const pedido = await prisma.pedido.findUnique({
      where: { onvoPaymentId: processedEvent.paymentId },
      include: {
        articulos: true
      }
    });

    if (!pedido) {
      console.warn('Pedido no encontrado para paymentId:', processedEvent.paymentId);
      return res.status(404).json({ error: 'Pedido no encontrado' });
    }

    // Actualizar estado del pedido según el evento
    let updateData = {};

    switch (processedEvent.action) {
      case 'confirmar_pago':
        updateData = {
          estadoPago: 'pagado',
          estado: 'confirmado',
        };
        
        // Reducir stock de productos
        for (const articulo of pedido.articulos) {
          await prisma.producto.update({
            where: { idProducto: articulo.productoId },
            data: {
              stock: {
                decrement: articulo.cantidad
              }
            }
          });
        }
        
        // Limpiar carrito del cliente
        await prisma.carritoItem.deleteMany({
          where: { clienteId: pedido.clienteId }
        });
        
        console.log(`Pago confirmado para pedido ${pedido.idPedido}`);
        break;

      case 'marcar_fallido':
        updateData = {
          estadoPago: 'fallido',
          estado: 'cancelado',
        };
        console.log(`Pago fallido para pedido ${pedido.idPedido}`);
        break;

      case 'marcar_cancelado':
        updateData = {
          estadoPago: 'cancelado',
          estado: 'cancelado',
        };
        console.log(`Pago cancelado para pedido ${pedido.idPedido}`);
        break;

      case 'marcar_reembolsado':
        updateData = {
          estadoPago: 'reembolsado',
          estado: 'reembolsado',
        };
        
        // Restaurar stock de productos
        for (const articulo of pedido.articulos) {
          await prisma.producto.update({
            where: { idProducto: articulo.productoId },
            data: {
              stock: {
                increment: articulo.cantidad
              }
            }
          });
        }
        
        console.log(`Pago reembolsado para pedido ${pedido.idPedido}`);
        break;
    }

    // Actualizar el pedido
    await prisma.pedido.update({
      where: { idPedido: pedido.idPedido },
      data: updateData,
    });

    res.status(200).json({ received: true });
  } catch (error) {
    console.error('Error procesando webhook:', error);
    res.status(500).json({ error: 'Error procesando webhook' });
  }
});

/**
 * GET /api/pagos/estado/:paymentId
 * Obtiene el estado de un pago específico
 */
app.get('/api/pagos/estado/:paymentId', authMiddleware, async (req, res) => {
  try {
    const { paymentId } = req.params;
    const clienteId = req.user.idCliente;

    // Verificar que el pedido pertenece al cliente
    const pedido = await prisma.pedido.findUnique({
      where: { onvoPaymentId: paymentId },
    });

    if (!pedido) {
      return res.status(404).json({ error: 'Pago no encontrado' });
    }

    if (pedido.clienteId !== clienteId) {
      return res.status(403).json({ error: 'No tienes permiso para ver este pago' });
    }

    // Consultar estado en Onvo Pay
    const paymentStatus = await onvoPayService.getPaymentStatus(paymentId);

    // Sincronizar estado en la base de datos
    const estadosMap = {
      'succeeded': 'pagado',
      'failed': 'fallido',
      'canceled': 'cancelado',
      'pending': 'pendiente',
    };

    const nuevoEstadoPago = estadosMap[paymentStatus.status] || 'pendiente';

    if (nuevoEstadoPago !== pedido.estadoPago) {
      await prisma.pedido.update({
        where: { idPedido: pedido.idPedido },
        data: { estadoPago: nuevoEstadoPago },
      });
    }

    res.status(200).json({
      paymentId: paymentStatus.id,
      estadoPago: nuevoEstadoPago,
      monto: paymentStatus.amount / 100, // Convertir de centavos a unidades
      moneda: paymentStatus.currency,
    });
  } catch (error) {
    console.error('Error obteniendo estado del pago:', error);
    res.status(500).json({ error: 'Error al obtener estado del pago' });
  }
});

/**
 * POST /api/pagos/reembolso/:pedidoId
 * Crea un reembolso para un pedido (solo admin)
 */
app.post('/api/pagos/reembolso/:pedidoId', authMiddleware, isAdmin, async (req, res) => {
  try {
    const { pedidoId } = req.params;
    const { monto } = req.body; // Opcional: monto parcial a reembolsar

    const pedido = await prisma.pedido.findUnique({
      where: { idPedido: pedidoId },
    });

    if (!pedido) {
      return res.status(404).json({ error: 'Pedido no encontrado' });
    }

    if (!pedido.onvoPaymentId) {
      return res.status(400).json({ error: 'Este pedido no tiene un pago asociado' });
    }

    if (pedido.estadoPago !== 'pagado') {
      return res.status(400).json({ error: 'Solo se pueden reembolsar pedidos pagados' });
    }

    // Crear reembolso en Onvo Pay
    const amountInCents = monto ? Math.round(monto * 100) : null;
    const refundData = await onvoPayService.createRefund(pedido.onvoPaymentId, amountInCents);

    // Actualizar pedido
    await prisma.pedido.update({
      where: { idPedido: pedidoId },
      data: {
        estadoPago: 'reembolsado',
        estado: 'reembolsado',
      },
    });

    res.status(200).json({
      mensaje: 'Reembolso creado exitosamente',
      refundId: refundData.refundId,
      monto: refundData.amount / 100,
    });
  } catch (error) {
    console.error('Error creando reembolso:', error);
    res.status(500).json({ error: error.message || 'Error al crear reembolso' });
  }
});

const PORT = process.env.PORT || 3003;

// Solo iniciar el servidor si no estamos en Vercel
if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`Servicio de Pagos (Onvo Pay) escuchando en http://localhost:${PORT}`);
  });
}

// Exportar para Vercel
export default app;

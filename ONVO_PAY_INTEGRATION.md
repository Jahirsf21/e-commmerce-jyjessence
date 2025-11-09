# Integración de Onvo Pay - JyJ Essence

Esta guía explica cómo configurar y usar la integración de Onvo Pay en el e-commerce.

## 📋 Prerrequisitos

- Cuenta de Onvo Pay (https://onvopay.com)
- Llaves de API (Pública y Secreta)
- PostgreSQL configurado con Prisma

## 🔧 Configuración

### 1. Variables de Entorno

#### Backend - service-pagos
Crear `backend/service-pagos/.env`:
```env
ONVO_SECRET_KEY=tu_llave_secreta_de_onvo
PORT=3003
FRONTEND_URL=http://localhost:5173
```

#### Backend - service-pedido
Crear `backend/service-pedido/.env`:
```env
PORT=3002
PAYMENT_SERVICE_URL=http://localhost:3003
```

#### Frontend
Crear `frontend/.env`:
```env
VITE_ONVO_PUBLIC_KEY=tu_llave_publica_de_onvo
VITE_API_URL=http://localhost:3000
```

### 2. Instalación de Dependencias

```bash
# Backend - service-pagos
cd backend/service-pagos
pnpm install

# Backend - service-pedido
cd ../service-pedido
pnpm install axios

# Backend - database (migraciones)
cd ../database
npx prisma migrate dev --name add_payment_fields
```

### 3. Iniciar Servicios

```bash
# Terminal 1 - Base de datos
cd backend/database
# Asegúrate de que PostgreSQL esté corriendo

# Terminal 2 - Service Pagos
cd backend/service-pagos
pnpm start

# Terminal 3 - Service Pedido
cd backend/service-pedido
pnpm start

# Terminal 4 - Frontend
cd frontend
pnpm dev
```

## 🔄 Flujo de Pago

### 1. Cliente Finaliza Compra
```javascript
// Frontend llama a:
POST /api/pedidos/checkout

// Respuesta:
{
  "pedido": {...},
  "checkoutUrl": "https://checkout.onvopay.com/...",
  "paymentId": "pay_xxx"
}
```

### 2. Redirección a Onvo Pay
El cliente es redirigido a `checkoutUrl` para completar el pago.

### 3. Webhook de Confirmación
Onvo Pay envía notificaciones a:
```
POST /api/pagos/webhook
```

Eventos soportados:
- `payment.succeeded` → Confirma pago, reduce stock, actualiza pedido
- `payment.failed` → Marca pago como fallido
- `payment.canceled` → Cancela pedido
- `payment.refunded` → Reembolsa y restaura stock

### 4. Redirección al Cliente
Después del pago, el cliente es redirigido a:
- Éxito: `/checkout/success?pedido={id}`
- Cancelación: `/checkout/cancel?pedido={id}`

## 🌐 Configuración de Webhook

### Desarrollo Local con ngrok

1. Instalar ngrok:
```bash
npm install -g ngrok
```

2. Exponer puerto local:
```bash
ngrok http 3003
```

3. Copiar URL generada (ej: `https://abc123.ngrok.io`)

4. Configurar en Onvo Pay Dashboard:
```
Webhook URL: https://abc123.ngrok.io/api/pagos/webhook
```

### Producción

Configurar en Onvo Pay Dashboard:
```
Webhook URL: https://tu-dominio.com/api/pagos/webhook
```

## 📊 Modelo de Datos

### Pedido (actualizado)
```prisma
model Pedido {
  idPedido        String    @id @default(cuid())
  clienteId       String
  fecha           DateTime  @default(now())
  estado          String    @default("Pendiente")
  
  // Campos de pago
  montoTotal      Float     @default(0)
  metodoPago      String?
  estadoPago      String    @default("pendiente")
  onvoPaymentId   String?   @unique
  onvoCheckoutUrl String?
  
  // Relaciones
  cliente         Cliente   @relation(fields: [clienteId], references: [idCliente])
  articulos       Articulo[]
  
  @@index([estadoPago])
  @@index([onvoPaymentId])
}
```

## 🔐 Seguridad

### Verificación de Firma del Webhook
El servicio verifica la firma `onvo-signature` en cada webhook para autenticar la solicitud.

### Tokens JWT
Todos los endpoints de pago requieren autenticación JWT excepto el webhook.

### Variables Sensibles
**NUNCA** commitear archivos `.env` con llaves reales. Usar `.env.example` como plantilla.

## 🧪 Pruebas

### Llaves de Prueba Actuales
```
Pública: onvo_test_publishable_key_TjmAdM2vYP1jHInz2MtSF4G5-yIC9NhhKJj8LNCQmfCQgbE9bgdFPinptW_0JNcWeMbBJwT6T9d7td-08UJn6g

Secreta: onvo_test_secret_key_wbZ5F8_uOcdAt3L-AyrSaPNdrCQNrSwj10v3hQhGYYzPFF7WlQA3vvb4q5bxmmwvZjjR7J6EVSepLb2GEucnGQ
```

### Tarjetas de Prueba
Consultar documentación de Onvo Pay para tarjetas de prueba.

## 📝 API Endpoints

### Crear Checkout
```http
POST /api/pagos/checkout
Authorization: Bearer {token}
Content-Type: application/json

{
  "pedidoId": "pedido_123"
}
```

### Webhook
```http
POST /api/pagos/webhook
onvo-signature: {firma_hmac}
Content-Type: application/json

{
  "type": "payment.succeeded",
  "data": {
    "id": "pay_xxx",
    ...
  }
}
```

### Consultar Estado
```http
GET /api/pagos/estado/{paymentId}
Authorization: Bearer {token}
```

### Crear Reembolso (Admin)
```http
POST /api/pagos/reembolso/{pedidoId}
Authorization: Bearer {admin_token}
Content-Type: application/json

{
  "monto": 50.00  // Opcional, reembolso parcial
}
```

## 🐛 Troubleshooting

### Error: "No se puede crear checkout"
- Verificar que `ONVO_SECRET_KEY` esté configurada
- Comprobar que el pedido existe y tiene montoTotal > 0
- Revisar logs del servicio de pagos

### Webhook no se recibe
- Verificar URL del webhook en Onvo Pay Dashboard
- Si es local, asegurar que ngrok esté corriendo
- Revisar logs de service-pagos para errores de firma

### Stock no se reduce después del pago
- Verificar que el webhook se esté recibiendo
- Comprobar logs del evento `payment.succeeded`
- Verificar que el pedido tiene artículos asociados

## 📚 Referencias

- [Documentación Onvo Pay](https://docs.onvopay.com)
- [Prisma ORM](https://www.prisma.io/docs)
- [Express.js](https://expressjs.com)

## 🆘 Soporte

Para problemas o preguntas, contactar al equipo de desarrollo.

# JyJ Essence API

## Descripción

Este repositorio contiene el backend de **JyJ Essence**, una plataforma de e-commerce diseñada para modernizar y expandir la presencia digital de una tienda de perfumes. El proyecto reemplaza un modelo de ventas manual basado en Instagram por una solución robusta, escalable y automatizada.

La API está construida como un sistema de microservicios, siguiendo los principios de alta cohesión y bajo acoplamiento para facilitar su mantenimiento y escalabilidad.

## Funcionalidades Principales

El backend soporta todas las operaciones necesarias para una experiencia de e-commerce completa:

*   **Gestión de Cuentas de Cliente:** Registro, inicio de sesión (autenticación basada en tokens) y eliminación de cuentas.
*   **Catálogo de Productos:** Administración completa de productos, incluyendo detalles, precios y stock.
*   **Ciclo de Compra:** Funcionalidades para añadir productos al carrito, gestionar el carrito y procesar pedidos.
*   **Procesador de Pagos:** Integración segura con **Onvo Pay** para procesamiento de pagos en Colombia.
*   **Gestión de Pedidos:** Seguimiento del ciclo de vida de un pedido, desde la recepción hasta el envío.
*   **Sistema de Notificaciones:** Envío de correos transaccionales para confirmar pedidos, envíos, etc.
*   **Webhooks:** Sistema de notificaciones en tiempo real para confirmación de pagos.

## Tecnologías Utilizadas

*   **Framework:** Express.js
*   **Lenguaje:** Node.js
*   **Base de Datos:** PostgreSQL gestionada en [Neon](https://neon.tech/)
*   **ORM:** [Prisma](https://www.prisma.io/)
*   **Pasarela de Pago:** [Onvo Pay](https://onvopay.com) - Procesamiento de pagos en Colombia
*   **Arquitectura:** Microservicios
*   **API:** RESTful, con especificación OpenAPI (Swagger) para la documentación.

## Puesta en Marcha (Getting Started)

Sigue estos pasos para levantar el entorno de desarrollo local.

### Prerrequisitos

*   Node.js (versión 18.x o superior)
*   pnpm (gestor de paquetes)
*   Una base de datos PostgreSQL. Puedes usar una instancia local o una base de datos de desarrollo en Neon.

### Instalación

1.  **Clona el repositorio:**
    ```sh
    git clone https://github.com/Jahirsf21/e-commmerce-jyjessence.git
    cd e-commmerce-jyjessence
    ```

2.  **Instala las dependencias:**
    ```sh
    # Backend
    cd backend
    pnpm install
    
    # Frontend
    cd ../frontend
    pnpm install
    ```

3.  **Configura las variables de entorno:**

    Crea archivos `.env` basándote en los `.env.example` proporcionados:

    ```sh
    # Backend - service-pagos
    cp backend/service-pagos/.env.example backend/service-pagos/.env
    
    # Backend - service-pedido
    cp backend/service-pedido/.env.example backend/service-pedido/.env
    
    # Frontend
    cp frontend/.env.example frontend/.env
    ```

    Edita cada archivo `.env` con tus credenciales:
    - `ONVO_SECRET_KEY` - Llave secreta de Onvo Pay
    - `VITE_ONVO_PUBLIC_KEY` - Llave pública de Onvo Pay
    - `DATABASE_URL` - URL de conexión a PostgreSQL

    **O usa el script de configuración automática:**
    ```powershell
    .\setup-onvo-pay.ps1
    ```

4.  **Aplica las migraciones de la base de datos:**

    Prisma usará el esquema definido en `prisma/schema.prisma` para crear las tablas en tu base de datos.
    ```sh
    cd backend/database
    npx prisma migrate dev
    ```

5.  **Inicia los servicios:**
    
    ```sh
    # Terminal 1 - Service Pagos
    cd backend/service-pagos
    pnpm start
    
    # Terminal 2 - Service Pedido
    cd backend/service-pedido
    pnpm start
    
    # Terminal 3 - Frontend
    cd frontend
    pnpm dev
    ```
    
    - API de pagos: `http://localhost:3003`
    - API de pedidos: `http://localhost:3002`
    - Frontend: `http://localhost:5173`

### Configuración de Onvo Pay

Para configurar los webhooks y comenzar a recibir notificaciones de pago:

**Desarrollo Local:**
```sh
# Instalar ngrok
npm install -g ngrok

# Exponer puerto local
ngrok http 3003

# Usar URL generada en Onvo Pay Dashboard
# Webhook URL: https://abc123.ngrok.io/api/pagos/webhook
```

**Producción:**
Configura el webhook en el Dashboard de Onvo Pay:
```
https://tu-dominio.com/api/pagos/webhook
```

Para más detalles, consulta:
- [Guía de Integración Onvo Pay](ONVO_PAY_INTEGRATION.md)
- [Resumen de Implementación](ONVO_PAY_IMPLEMENTATION_SUMMARY.md)

## Esquema de la Base de Datos

El esquema de la base de datos es gestionado por Prisma y se encuentra definido en el archivo `prisma/schema.prisma`. Este archivo es la única fuente de verdad para los modelos de datos del sistema.

## API Endpoints

La API expone sus funcionalidades a través de endpoints RESTful. Para garantizar la claridad y facilitar la integración, cada servicio documenta su API siguiendo la **especificación OpenAPI**.

Puedes encontrar la documentación interactiva de la API (generada por Swagger) en el endpoint `/api-docs` una vez que el servidor esté en funcionamiento.

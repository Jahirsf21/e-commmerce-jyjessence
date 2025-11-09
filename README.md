# JyJ Essence API

## Descripción

Este repositorio contiene el backend de **JyJ Essence**, una plataforma de e-commerce diseñada para modernizar y expandir la presencia digital de una tienda de perfumes. El proyecto reemplaza un modelo de ventas manual basado en Instagram por una solución robusta, escalable y automatizada.

La API está construida como un sistema de microservicios, siguiendo los principios de alta cohesión y bajo acoplamiento para facilitar su mantenimiento y escalabilidad.

## Funcionalidades Principales

El backend soporta todas las operaciones necesarias para una experiencia de e-commerce completa:

*   **Gestión de Cuentas de Cliente:** Registro, inicio de sesión (autenticación basada en tokens) y eliminación de cuentas.
*   **Catálogo de Productos:** Administración completa de productos, incluyendo detalles, precios y stock.
*   **Ciclo de Compra:** Funcionalidades para añadir productos al carrito, gestionar el carrito y procesar pedidos.
*   **Procesador de Pagos:** Integración segura con pasarelas de pago externas.
*   **Gestión de Pedidos:** Seguimiento del ciclo de vida de un pedido, desde la recepción hasta el envío.
*   **Sistema de Notificaciones:** Envío de correos transaccionales para confirmar pedidos, envíos, etc.

## Tecnologías Utilizadas

*   **Framework:** Express.js
*   **Lenguaje:** Node.js
*   **Base de Datos:** PostgreSQL gestionada en [Neon](https://neon.tech/)
*   **ORM:** [Prisma](https://www.prisma.io/)
*   **Arquitectura:** Microservicios
*   **API:** RESTful, con especificación OpenAPI (Swagger) para la documentación.

## Puesta en Marcha (Getting Started)

Sigue estos pasos para levantar el entorno de desarrollo local.

### Prerrequisitos

*   Node.js (versión 18.x o superior)
*   Una base de datos PostgreSQL. Puedes usar una instancia local o una base de datos de desarrollo en Neon.

### Instalación

1.  **Clona el repositorio:**
    ```sh
    git clone https://URL-DE-TU-REPOSITORIO.git
    cd JyJ-Essence-backend
    ```

2.  **Instala las dependencias:**
    ```sh
    npm install
    ```

3.  **Configura las variables de entorno:**

    Crea un archivo `.env` en la raíz del proyecto, basándote en el archivo `.env.example`. Deberás configurar principalmente la `DATABASE_URL` para que Prisma pueda conectarse a tu base de datos.

    ```env
    # Ejemplo de variable para la base de datos con Prisma y Neon
    DATABASE_URL="postgresql://user:password@ep-divine-shape-a2h1n1n1.eu-central-1.aws.neon.tech/dbname?sslmode=require"
    ```

4.  **Aplica las migraciones de la base de datos:**

    Prisma usará el esquema definido en `prisma/schema.prisma` para crear las tablas en tu base de datos.
    ```sh
    npx prisma migrate dev
    ```

5.  **Inicia el servidor de desarrollo:**
    ```sh
    npm run dev
    ```
    La API estará disponible en `http://localhost:3000` (o el puerto que hayas configurado).

## Esquema de la Base de Datos

El esquema de la base de datos es gestionado por Prisma y se encuentra definido en el archivo `prisma/schema.prisma`. Este archivo es la única fuente de verdad para los modelos de datos del sistema.

## API Endpoints

La API expone sus funcionalidades a través de endpoints RESTful. Para garantizar la claridad y facilitar la integración, cada servicio documenta su API siguiendo la **especificación OpenAPI**.

Puedes encontrar la documentación interactiva de la API (generada por Swagger) en el endpoint `/api-docs` una vez que el servidor esté en funcionamiento.

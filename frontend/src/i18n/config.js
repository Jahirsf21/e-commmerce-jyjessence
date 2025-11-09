import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Traducciones
const resources = {
  es: {
    translation: {
      // Navegación
      "nav.home": "Inicio",
      "nav.catalog": "Catálogo",
      "nav.cart": "Carrito",
      "nav.orders": "Mis Pedidos",
      "nav.myAccount": "Mi Cuenta",
      "nav.login": "Iniciar Sesión",
      "nav.register": "Registrarse",
      "nav.logout": "Cerrar Sesión",
      "nav.admin": "Administración",
      
      // Header
      "header.searchPlaceholder": "Buscar productos...",
      
      // Perfil
      "profile.general": "General",
      "profile.help": "Ayuda",
      
      // Autenticación
      "auth.email": "Correo Electrónico",
      "auth.password": "Contraseña",
      "auth.confirmPassword": "Confirmar Contraseña",
      "auth.name": "Nombre",
      "auth.lastName": "Apellidos",
      "auth.cedula": "Cédula",
      "auth.phone": "Teléfono",
      "auth.gender": "Género",
      "auth.male": "Masculino",
      "auth.female": "Femenino",
      "auth.other": "Otro",
      "auth.login": "Iniciar Sesión",
      "auth.register": "Registrarse",
      "auth.loginTitle": "Bienvenido a JyJ Essence",
      "auth.registerTitle": "Crear Cuenta",
      "auth.noAccount": "¿No tienes cuenta?",
      "auth.hasAccount": "¿Ya tienes cuenta?",
      "auth.cedulaValidated": "Cédula validada exitosamente",
      
      // Dirección
      "address.addAddress": "¿Desea agregar una dirección? (Opcional)",
      "address.province": "Provincia",
      "address.canton": "Cantón",
      "address.district": "Distrito",
      "address.neighborhood": "Barrio",
      "address.directions": "Señas",
      "address.postalCode": "Código Postal",
      "address.reference": "Punto de Referencia",
      "address.provincePlaceholder": "San José",
      "address.cantonPlaceholder": "Central",
      "address.districtPlaceholder": "Carmen",
      "address.neighborhoodPlaceholder": "Ejemplo: Los Yoses",
      "address.directionsPlaceholder": "200 metros norte de la iglesia...",
      "address.postalCodePlaceholder": "10101",
      "address.referencePlaceholder": "Frente al parque central",
      
      // Validaciones
      "auth.emailRequired": "El correo electrónico es requerido",
      "auth.emailInvalid": "El correo electrónico no es válido",
      "auth.passwordRequired": "La contraseña es requerida",
      "auth.passwordMinLength": "La contraseña debe tener al menos 6 caracteres",
      "auth.confirmPasswordRequired": "Debe confirmar la contraseña",
      "auth.passwordMismatch": "Las contraseñas no coinciden",
      "auth.cedulaRequired": "La cédula es requerida",
      "auth.cedulaInvalidFormat": "El formato de cédula no es válido",
      "auth.nameRequired": "El nombre es requerido",
      "auth.lastNameRequired": "Los apellidos son requeridos",
      "auth.genderRequired": "El género es requerido",
      "auth.phoneRequired": "El teléfono es requerido",
      "auth.phoneInvalidFormat": "El formato de teléfono no es válido",
      
      // Productos
      "product.name": "Nombre",
      "product.description": "Descripción",
      "product.price": "Precio",
      "product.stock": "Stock",
      "product.category": "Categoría",
      "product.gender": "Género",
      "product.addToCart": "Agregar al Carrito",
      "product.outOfStock": "Agotado",
      
      // Categorías
      "category.FLORAL": "Floral",
      "category.FRUTAL": "Frutal",
      "category.ORIENTAL": "Oriental",
      "category.AMADERADO": "Amaderado",
      "category.FRESCO": "Fresco",
      
      // Género
      "gender.MASCULINO": "Masculino",
      "gender.FEMENINO": "Femenino",
      "gender.UNISEX": "Unisex",
      
      // Carrito
      "cart.title": "Carrito de Compras",
      "cart.empty": "Tu carrito está vacío",
      "cart.quantity": "Cantidad",
      "cart.subtotal": "Subtotal",
      "cart.total": "Total",
      "cart.checkout": "Finalizar Compra",
      "cart.remove": "Eliminar",
      "cart.undo": "Deshacer",
      "cart.redo": "Rehacer",
      
      // Checkout
      "checkout": "Pagar",
      "orderSummary": "Resumen del Pedido",
      "quantity": "Cantidad",
      "total": "Total",
      "paymentMethod": "Método de Pago",
      "securePayment": "Pago seguro con Onvo Pay",
      "onvoPayInfo": "Serás redirigido a Onvo Pay para completar tu pago de forma segura.",
      "backToCart": "Volver al Carrito",
      "proceedToPayment": "Proceder al Pago",
      "processing": "Procesando...",
      "secureConnection": "🔒 Conexión segura - Tus datos están protegidos",
      "errorLoadingCart": "Error al cargar el carrito",
      "error": "Error",
      "emptyCart": "Carrito Vacío",
      "addProductsFirst": "Agrega productos antes de proceder al pago",
      "paymentError": "Error al Procesar Pago",
      "tryAgainLater": "Por favor, intenta nuevamente más tarde",
      
      // Checkout Success
      "paymentSuccessful": "¡Pago Exitoso!",
      "thankYouForPurchase": "Gracias por tu compra",
      "orderNumber": "Número de Pedido",
      "paymentStatus": "Estado del Pago",
      "paid": "Pagado",
      "date": "Fecha",
      "orderItems": "Artículos del Pedido",
      "confirmationEmailSent": "Te hemos enviado un correo de confirmación con los detalles de tu pedido.",
      "viewOrders": "Ver Mis Pedidos",
      "backToHome": "Volver al Inicio",
      "trackOrderStatus": "Puedes seguir el estado de tu pedido desde tu cuenta.",
      "verifyingPayment": "Verificando pago...",
      
      // Checkout Cancel
      "paymentCancelled": "Pago Cancelado",
      "paymentNotProcessed": "Tu pago no fue procesado",
      "whatHappened": "¿Qué sucedió?",
      "cancelledPaymentExplanation": "Cancelaste el proceso de pago. No se ha realizado ningún cargo a tu cuenta.",
      "status": "Estado",
      "cancelled": "Cancelado",
      "whatCanYouDo": "¿Qué puedes hacer?",
      "tryPaymentAgain": "Intentar realizar el pago nuevamente",
      "reviewCartItems": "Revisar los artículos de tu carrito",
      "contactSupport": "Contactar con soporte si necesitas ayuda",
      "continueShopping": "Continuar Comprando",
      "needHelp": "¿Necesitas ayuda?",
      "contactUs": "Contáctanos",
      
      // Pedidos
      "order.title": "Mis Pedidos",
      "order.number": "Pedido #",
      "order.date": "Fecha",
      "order.status": "Estado",
      "order.total": "Total",
      "order.details": "Ver Detalles",
      
      // Admin
      "admin.products": "Gestión de Productos",
      "admin.addProduct": "Agregar Producto",
      "admin.editProduct": "Editar Producto",
      "admin.deleteProduct": "Eliminar Producto",
      "admin.save": "Guardar",
      "admin.cancel": "Cancelar",
      
      // Mensajes
      "message.success": "Operación exitosa",
      "message.error": "Ocurrió un error",
      "message.loading": "Cargando...",
      "message.addedToCart": "Producto agregado al carrito",
      "message.removedFromCart": "Producto eliminado del carrito",
      "message.orderPlaced": "Pedido realizado con éxito",
      "message.invalidCedula": "Cédula inválida",
      "message.loginError": "Credenciales incorrectas",
      "message.loginSuccess": "Sesión iniciada correctamente",
      "message.registerSuccess": "Cuenta creada exitosamente",
      "message.registerError": "Error al registrarse",
      "message.cedulaValidated": "Datos obtenidos del TSE exitosamente",
      "message.cedulaValidationError": "No se pudo validar la cédula",
      
      // Errores de Login
      "error.login.title": "Error de autenticación",
      "error.login.emailNotFound": "No existe una cuenta con este correo electrónico",
      "error.login.emailNotFoundTitle": "Correo no encontrado",
      "error.login.wrongPassword": "La contraseña ingresada es incorrecta",
      "error.login.wrongPasswordTitle": "Contraseña incorrecta",
      "error.login.tryAgain": "Intentar de nuevo",
      
      // Errores de Registro
      "error.register.title": "Error en el registro",
      "error.register.cedulaDuplicate": "Ya existe un usuario registrado con esta cédula",
      "error.register.cedulaDuplicateTitle": "Cédula ya registrada",
      "error.register.emailDuplicate": "Ya existe una cuenta con este correo electrónico",
      "error.register.emailDuplicateTitle": "Correo ya registrado",
      "error.register.cedulaInvalid": "La cédula proporcionada no es válida",
      "error.register.cedulaInvalidTitle": "Cédula inválida",
      "error.register.cedulaNotFound": "Cédula no encontrada en el sistema del TSE",
      "error.register.cedulaNotFoundTitle": "Cédula no encontrada",
      "error.register.passwordMismatch": "Por favor asegúrate de que ambas contraseñas sean iguales",
      "error.register.passwordMismatchTitle": "Las contraseñas no coinciden",
      "error.register.tryAgain": "Intentar de nuevo",
      
      // Éxitos
      "success.login.title": "¡Bienvenido!",
      "success.login.message": "Has iniciado sesión correctamente",
      "success.register.title": "¡Registro exitoso!",
      "success.register.message": "Tu cuenta ha sido creada correctamente",
      "success.register.button": "Ir a iniciar sesión",
      "success.cedula.title": "¡Cédula validada!",
      "success.cedula.message": "Datos obtenidos del TSE exitosamente",
      
      // Botones
      "button.understood": "Entendido",
      "button.tryAgain": "Intentar de nuevo",
      "button.goToLogin": "Ir a iniciar sesión",
      
      // Común
      "common.search": "Buscar",
      "common.filter": "Filtrar",
      "common.sort": "Ordenar",
      "common.clear": "Limpiar",
      "common.apply": "Aplicar",
      "common.close": "Cerrar",
      "common.confirm": "Confirmar",
      "common.delete": "Eliminar",
      "common.edit": "Editar",
      "common.save": "Guardar",
      "common.cancel": "Cancelar",
    }
  },
  en: {
    translation: {
      // Navigation
      "nav.home": "Home",
      "nav.catalog": "Catalog",
      "nav.cart": "Cart",
      "nav.orders": "My Orders",
      "nav.myAccount": "My Account",
      "nav.login": "Login",
      "nav.register": "Sign Up",
      "nav.logout": "Logout",
      "nav.admin": "Administration",
      
      // Header
      "header.searchPlaceholder": "Search products...",
      
      // Profile
      "profile.general": "General",
      "profile.help": "Help",
      
      // Authentication
      "auth.email": "Email",
      "auth.password": "Password",
      "auth.confirmPassword": "Confirm Password",
      "auth.name": "Name",
      "auth.lastName": "Last Name",
      "auth.cedula": "ID Number",
      "auth.phone": "Phone",
      "auth.gender": "Gender",
      "auth.male": "Male",
      "auth.female": "Female",
      "auth.other": "Other",
      "auth.login": "Login",
      "auth.register": "Sign Up",
      "auth.loginTitle": "Welcome to JyJ Essence",
      "auth.registerTitle": "Create Account",
      "auth.noAccount": "Don't have an account?",
      "auth.hasAccount": "Already have an account?",
      "auth.cedulaValidated": "ID validated successfully",
      
      // Address
      "address.addAddress": "Would you like to add an address? (Optional)",
      "address.province": "Province",
      "address.canton": "Canton",
      "address.district": "District",
      "address.neighborhood": "Neighborhood",
      "address.directions": "Directions",
      "address.postalCode": "Postal Code",
      "address.reference": "Reference Point",
      "address.provincePlaceholder": "San José",
      "address.cantonPlaceholder": "Central",
      "address.districtPlaceholder": "Carmen",
      "address.neighborhoodPlaceholder": "Example: Los Yoses",
      "address.directionsPlaceholder": "200 meters north of the church...",
      "address.postalCodePlaceholder": "10101",
      "address.referencePlaceholder": "In front of the central park",
      
      // Validations
      "auth.emailRequired": "Email is required",
      "auth.emailInvalid": "Email is not valid",
      "auth.passwordRequired": "Password is required",
      "auth.passwordMinLength": "Password must be at least 6 characters",
      "auth.confirmPasswordRequired": "You must confirm the password",
      "auth.passwordMismatch": "Passwords do not match",
      "auth.cedulaRequired": "ID number is required",
      "auth.cedulaInvalidFormat": "ID format is not valid",
      "auth.nameRequired": "Name is required",
      "auth.lastNameRequired": "Last name is required",
      "auth.genderRequired": "Gender is required",
      "auth.phoneRequired": "Phone is required",
      "auth.phoneInvalidFormat": "Phone format is not valid",
      
      // Products
      "product.name": "Name",
      "product.description": "Description",
      "product.price": "Price",
      "product.stock": "Stock",
      "product.category": "Category",
      "product.gender": "Gender",
      "product.addToCart": "Add to Cart",
      "product.outOfStock": "Out of Stock",
      
      // Categories
      "category.FLORAL": "Floral",
      "category.FRUTAL": "Fruity",
      "category.ORIENTAL": "Oriental",
      "category.AMADERADO": "Woody",
      "category.FRESCO": "Fresh",
      
      // Gender
      "gender.MASCULINO": "Male",
      "gender.FEMENINO": "Female",
      "gender.UNISEX": "Unisex",
      
      // Cart
      "cart.title": "Shopping Cart",
      "cart.empty": "Your cart is empty",
      "cart.quantity": "Quantity",
      "cart.subtotal": "Subtotal",
      "cart.total": "Total",
      "cart.checkout": "Checkout",
      "cart.remove": "Remove",
      "cart.undo": "Undo",
      "cart.redo": "Redo",
      
      // Checkout
      "checkout": "Checkout",
      "orderSummary": "Order Summary",
      "quantity": "Quantity",
      "total": "Total",
      "paymentMethod": "Payment Method",
      "securePayment": "Secure payment with Onvo Pay",
      "onvoPayInfo": "You will be redirected to Onvo Pay to complete your payment securely.",
      "backToCart": "Back to Cart",
      "proceedToPayment": "Proceed to Payment",
      "processing": "Processing...",
      "secureConnection": "🔒 Secure connection - Your data is protected",
      "errorLoadingCart": "Error loading cart",
      "error": "Error",
      "emptyCart": "Empty Cart",
      "addProductsFirst": "Add products before proceeding to payment",
      "paymentError": "Payment Error",
      "tryAgainLater": "Please try again later",
      
      // Checkout Success
      "paymentSuccessful": "Payment Successful!",
      "thankYouForPurchase": "Thank you for your purchase",
      "orderNumber": "Order Number",
      "paymentStatus": "Payment Status",
      "paid": "Paid",
      "date": "Date",
      "orderItems": "Order Items",
      "confirmationEmailSent": "We have sent you a confirmation email with your order details.",
      "viewOrders": "View My Orders",
      "backToHome": "Back to Home",
      "trackOrderStatus": "You can track your order status from your account.",
      "verifyingPayment": "Verifying payment...",
      
      // Checkout Cancel
      "paymentCancelled": "Payment Cancelled",
      "paymentNotProcessed": "Your payment was not processed",
      "whatHappened": "What happened?",
      "cancelledPaymentExplanation": "You cancelled the payment process. No charge has been made to your account.",
      "status": "Status",
      "cancelled": "Cancelled",
      "whatCanYouDo": "What can you do?",
      "tryPaymentAgain": "Try to make the payment again",
      "reviewCartItems": "Review your cart items",
      "contactSupport": "Contact support if you need help",
      "continueShopping": "Continue Shopping",
      "needHelp": "Need help?",
      "contactUs": "Contact us",
      
      // Orders
      "order.title": "My Orders",
      "order.number": "Order #",
      "order.date": "Date",
      "order.status": "Status",
      "order.total": "Total",
      "order.details": "View Details",
      
      // Admin
      "admin.products": "Product Management",
      "admin.addProduct": "Add Product",
      "admin.editProduct": "Edit Product",
      "admin.deleteProduct": "Delete Product",
      "admin.save": "Save",
      "admin.cancel": "Cancel",
      
      // Messages
      "message.success": "Operation successful",
      "message.error": "An error occurred",
      "message.loading": "Loading...",
      "message.addedToCart": "Product added to cart",
      "message.removedFromCart": "Product removed from cart",
      "message.orderPlaced": "Order placed successfully",
      "message.invalidCedula": "Invalid ID number",
      "message.loginError": "Invalid credentials",
      "message.loginSuccess": "Login successful",
      "message.registerSuccess": "Account created successfully",
      "message.registerError": "Registration error",
      "message.cedulaValidated": "Data obtained from TSE successfully",
      "message.cedulaValidationError": "Could not validate ID number",
      
      // Login Errors
      "error.login.title": "Authentication error",
      "error.login.emailNotFound": "No account exists with this email",
      "error.login.emailNotFoundTitle": "Email not found",
      "error.login.wrongPassword": "The password entered is incorrect",
      "error.login.wrongPasswordTitle": "Incorrect password",
      "error.login.tryAgain": "Try again",
      
      // Registration Errors
      "error.register.title": "Registration error",
      "error.register.cedulaDuplicate": "A user is already registered with this ID number",
      "error.register.cedulaDuplicateTitle": "ID already registered",
      "error.register.emailDuplicate": "An account already exists with this email",
      "error.register.emailDuplicateTitle": "Email already registered",
      "error.register.cedulaInvalid": "The provided ID number is not valid",
      "error.register.cedulaInvalidTitle": "Invalid ID number",
      "error.register.cedulaNotFound": "ID number not found in TSE system",
      "error.register.cedulaNotFoundTitle": "ID number not found",
      "error.register.passwordMismatch": "Please make sure both passwords match",
      "error.register.passwordMismatchTitle": "Passwords do not match",
      "error.register.tryAgain": "Try again",
      
      // Success
      "success.login.title": "Welcome!",
      "success.login.message": "You have successfully logged in",
      "success.register.title": "Registration successful!",
      "success.register.message": "Your account has been created successfully",
      "success.register.button": "Go to login",
      "success.cedula.title": "ID validated!",
      "success.cedula.message": "Data obtained from TSE successfully",
      
      // Buttons
      "button.understood": "Understood",
      "button.tryAgain": "Try again",
      "button.goToLogin": "Go to login",
      
      // Common
      "common.search": "Search",
      "common.filter": "Filter",
      "common.sort": "Sort",
      "common.clear": "Clear",
      "common.apply": "Apply",
      "common.close": "Close",
      "common.confirm": "Confirm",
      "common.delete": "Delete",
      "common.edit": "Edit",
      "common.save": "Save",
      "common.cancel": "Cancel",
    }
  }
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'es',
    interpolation: {
      escapeValue: false // React ya protege contra XSS
    },
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage']
    }
  });

export default i18n;

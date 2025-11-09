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
      "nav.login": "Iniciar Sesión",
      "nav.register": "Registrarse",
      "nav.logout": "Cerrar Sesión",
      "nav.admin": "Administración",
      
      // Autenticación
      "auth.email": "Correo Electrónico",
      "auth.password": "Contraseña",
      "auth.name": "Nombre",
      "auth.lastName": "Apellidos",
      "auth.cedula": "Cédula",
      "auth.phone": "Teléfono",
      "auth.login": "Iniciar Sesión",
      "auth.register": "Registrarse",
      "auth.loginTitle": "Bienvenido a JyJ Essence",
      "auth.registerTitle": "Crear Cuenta",
      "auth.noAccount": "¿No tienes cuenta?",
      "auth.hasAccount": "¿Ya tienes cuenta?",
      
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
      "nav.login": "Login",
      "nav.register": "Sign Up",
      "nav.logout": "Logout",
      "nav.admin": "Administration",
      
      // Authentication
      "auth.email": "Email",
      "auth.password": "Password",
      "auth.name": "Name",
      "auth.lastName": "Last Name",
      "auth.cedula": "ID Number",
      "auth.phone": "Phone",
      "auth.login": "Login",
      "auth.register": "Sign Up",
      "auth.loginTitle": "Welcome to JyJ Essence",
      "auth.registerTitle": "Create Account",
      "auth.noAccount": "Don't have an account?",
      "auth.hasAccount": "Already have an account?",
      
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

import express from 'express';
import authMiddleware from './middleware/auth.js';
import isAdmin from './middleware/admin.js';
import CatalogoFacade from './facades/catalogoFacade.js';

const app = express();
app.use(express.json());

// ==========================================
// ==      RUTAS PÚBLICAS (SIN TOKEN)      ==
// ==========================================

// CU01: Visualización del catálogo
app.get('/api/productos', async (req, res) => {
  try {
    const filtros = {
      categoria: req.query.categoria,
      genero: req.query.genero,
      precioMin: req.query.precioMin,
      precioMax: req.query.precioMax,
      busqueda: req.query.busqueda
    };

    const productos = await CatalogoFacade.obtenerProductos(filtros);
    res.status(200).json(productos);
  } catch (error) {
    console.error("Error al obtener productos:", error);
    res.status(500).json({ error: 'No se pudieron obtener los productos.' });
  }
});

// CU04: Búsqueda de productos (mismo endpoint con query params)
app.get('/api/productos/buscar', async (req, res) => {
  try {
    const { q } = req.query;
    
    if (!q || q.trim() === '') {
      return res.status(400).json({ error: 'Se requiere un término de búsqueda.' });
    }

    const productos = await CatalogoFacade.obtenerProductos({ busqueda: q });
    res.status(200).json(productos);
  } catch (error) {
    console.error("Error en búsqueda de productos:", error);
    res.status(500).json({ error: 'Error al buscar productos.' });
  }
});

// Obtener detalle de un producto específico
app.get('/api/productos/:id', async (req, res) => {
  try {
    const producto = await CatalogoFacade.obtenerProductoPorId(req.params.id);
    res.status(200).json(producto);
  } catch (error) {
    if (error.code === 'PRODUCTO_NO_ENCONTRADO') {
      return res.status(404).json({ error: error.message });
    }
    console.error("Error al obtener producto:", error);
    res.status(500).json({ error: 'No se pudo obtener el producto.' });
  }
});

// ===================================================================
// == RUTAS PROTEGIDAS SOLO PARA ADMINISTRADORES (TOKEN + ROL ADMIN)==
// ===================================================================

// CU06: Crear nuevo producto
app.post('/api/productos', authMiddleware, isAdmin, async (req, res) => {
  try {
    const { nombre, descripcion, categoria, genero, mililitros, precio, stock } = req.body;

    // Validaciones básicas
    if (!nombre || !descripcion || !categoria || !genero || !mililitros || !precio || stock === undefined) {
      return res.status(400).json({ error: 'Todos los campos son requeridos.' });
    }

    const nuevoProducto = await CatalogoFacade.crearProducto({
      nombre,
      descripcion,
      categoria,
      genero,
      mililitros: parseInt(mililitros),
      precio: parseFloat(precio),
      stock: parseInt(stock)
    });

    res.status(201).json(nuevoProducto);
  } catch (error) {
    console.error("Error al crear producto:", error);
    res.status(500).json({ error: 'No se pudo crear el producto.' });
  }
});

// Clonar un producto existente (Patrón Prototype)
app.post('/api/productos/:id/clonar', authMiddleware, isAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const modificaciones = req.body; // ej: { mililitros: 100, precio: 50000, stock: 20 }

    const productoClon = await CatalogoFacade.clonarProducto(id, modificaciones);
    res.status(201).json(productoClon);
  } catch (error) {
    if (error.code === 'PRODUCTO_NO_ENCONTRADO') {
      return res.status(404).json({ error: error.message });
    }
    console.error("Error al clonar producto:", error);
    res.status(500).json({ error: 'No se pudo clonar el producto.' });
  }
});

// CU06: Actualizar producto existente
app.put('/api/productos/:id', authMiddleware, isAdmin, async (req, res) => {
  try {
    const { nombre, descripcion, categoria, genero, mililitros, precio, stock } = req.body;
    
    const datosActualizados = {};
    if (nombre !== undefined) datosActualizados.nombre = nombre;
    if (descripcion !== undefined) datosActualizados.descripcion = descripcion;
    if (categoria !== undefined) datosActualizados.categoria = categoria;
    if (genero !== undefined) datosActualizados.genero = genero;
    if (mililitros !== undefined) datosActualizados.mililitros = parseInt(mililitros);
    if (precio !== undefined) datosActualizados.precio = parseFloat(precio);
    if (stock !== undefined) datosActualizados.stock = parseInt(stock);

    const productoActualizado = await CatalogoFacade.actualizarProducto(req.params.id, datosActualizados);
    res.status(200).json(productoActualizado);
  } catch (error) {
    console.error("Error al actualizar producto:", error);
    res.status(500).json({ error: 'No se pudo actualizar el producto.' });
  }
});

// CU06: Eliminar producto
app.delete('/api/productos/:id', authMiddleware, isAdmin, async (req, res) => {
  try {
    await CatalogoFacade.eliminarProducto(req.params.id);
    res.status(204).send();
  } catch (error) {
    console.error("Error al eliminar producto:", error);
    res.status(500).json({ error: 'No se pudo eliminar el producto.' });
  }
});

// Actualizar solo el stock de un producto
app.patch('/api/productos/:id/stock', authMiddleware, isAdmin, async (req, res) => {
  try {
    const { stock } = req.body;
    
    if (stock === undefined || stock < 0) {
      return res.status(400).json({ error: 'El stock debe ser un número válido mayor o igual a 0.' });
    }

    const productoActualizado = await CatalogoFacade.actualizarStock(req.params.id, parseInt(stock));
    res.status(200).json(productoActualizado);
  } catch (error) {
    if (error.code === 'PRODUCTO_NO_ENCONTRADO') {
      return res.status(404).json({ error: error.message });
    }
    console.error("Error al actualizar stock:", error);
    res.status(500).json({ error: 'No se pudo actualizar el stock.' });
  }
});

// === INICIAR EL SERVIDOR PARA DESARROLLO LOCAL ===
const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`Servidor de Catálogo escuchando en http://localhost:${PORT}`);
});
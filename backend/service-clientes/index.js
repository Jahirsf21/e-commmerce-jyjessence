import express from 'express';
import authMiddleware from './middleware/auth.js';
import isAdmin from './middleware/admin.js';
import ClientFacade from './facades/clientFacade.js';

const app = express();
app.use(express.json());

// ==========================================
// ==      RUTAS PÚBLICAS (SIN TOKEN)      ==
// ==========================================

app.get('/api/clientes/consulta-cedula/:cedula', async (req, res) => {
  try {
    const datos = await ClientFacade.consultarCedulaTSE(req.params.cedula);
    if (!datos) {
      return res.status(404).json({ error: 'Cédula no encontrada.' });
    }
    res.json(datos);
  } catch (error) {
    res.status(500).json({ error: 'No se pudo consultar la información.' });
  }
});

app.post('/api/clientes/registro', async (req, res) => {
  try {
    const clienteSeguro = await ClientFacade.registrar(req.body);
    res.status(201).json(clienteSeguro);
  } catch (error) {
    if (error.code === 'P2002') {
      return res.status(409).json({ error: 'El correo electrónico o la cédula ya están en uso.' });
    }
    if (error.code === 'CEDULA_INVALIDA') {
      return res.status(400).json({ error: error.message });
    }
    console.error("Error al registrar cliente:", error);
    res.status(500).json({ error: 'No se pudo registrar el cliente.' });
  }
});

app.post('/api/clientes/login', async (req, res) => {
  try {
    const resultado = await ClientFacade.autenticar(req.body.email, req.body.contrasena);
    if (!resultado) return res.status(401).json({ error: 'Credenciales inválidas.' });
    res.status(200).json(resultado);
  } catch (error) {
    console.error("Error al iniciar sesión:", error);
    res.status(500).json({ error: 'No se pudo iniciar sesión.' });
  }
});

// =========================================================
// == RUTAS PROTEGIDAS PARA USUARIOS AUTENTICADOS (TOKEN) ==
// =========================================================

app.get('/api/clientes/perfil', authMiddleware, async (req, res) => {
  try {
    const cliente = await ClientFacade.obtenerPerfil(req.user.idCliente);
    if (!cliente) return res.status(404).json({ error: 'Perfil no encontrado.' });
    res.status(200).json(cliente);
  } catch (error) {
    console.error("Error al obtener perfil:", error);
    res.status(500).json({ error: 'No se pudo obtener el perfil.' });
  }
});

app.put('/api/clientes/perfil', authMiddleware, async (req, res) => {
  try {
    const { nombre, apellido, genero, telefono, direccion } = req.body;
    const datosActualizados = { nombre, apellido, genero, telefono, direccion };
    const clienteActualizado = await ClientFacade.actualizarPerfil(req.user.idCliente, datosActualizados);
    res.status(200).json(clienteActualizado);
  } catch (error) {
    console.error("Error al actualizar perfil:", error);
    res.status(500).json({ error: 'No se pudo actualizar el perfil.' });
  }
});

app.delete('/api/clientes/perfil', authMiddleware, async (req, res) => {
  try {
    await ClientFacade.eliminar(req.user.idCliente);
    res.status(204).send();
  } catch (error) {
    console.error("Error al eliminar cliente:", error);
    res.status(500).json({ error: 'No se pudo eliminar la cuenta.' });
  }
});

// ===================================================================
// == RUTAS PROTEGIDAS SOLO PARA ADMINISTRADORES (TOKEN + ROL ADMIN)==
// ===================================================================

app.get('/api/clientes', authMiddleware, isAdmin, async (req, res) => {
  try {
    const clientes = await ClientFacade.listarTodos();
    res.status(200).json(clientes);
  } catch (error) {
    console.error("Error al listar clientes:", error);
    res.status(500).json({ error: 'No se pudieron obtener los clientes.' });
  }
});

app.get('/api/clientes/:id', authMiddleware, isAdmin, async (req, res) => {
  try {
    const cliente = await ClientFacade.obtenerPerfil(req.params.id);
    if (!cliente) return res.status(404).json({ error: 'Cliente no encontrado.' });
    res.status(200).json(cliente);
  } catch (error) {
    console.error("Error al obtener cliente por ID:", error);
    res.status(500).json({ error: 'No se pudo obtener el cliente.' });
  }
});

// === INICIAR EL SERVIDOR PARA DESARROLLO LOCAL ===
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Servidor de Clientes escuchando en http://localhost:${PORT}`);
});
import prisma from '../../database/config/prisma.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

class ClientFacade {

  async autenticar(email, contrasena) {
    const cliente = await prisma.cliente.findUnique({ where: { email } });
    if (!cliente || !(await bcrypt.compare(contrasena, cliente.contrasena))) {
      return null;
    }
    if (!process.env.JWT_SECRET) {
      throw new Error('JWT_SECRET no está definido en las variables de entorno');
    }
    const secretKey = process.env.JWT_SECRET;
    const payload = { idCliente: cliente.idCliente, role: cliente.role };
    const token = jwt.sign(payload, secretKey, { expiresIn: '8h' });
    const { contrasena: _, ...clienteSeguro } = cliente;
    return { token, usuario: clienteSeguro };
  }

  async registrar(datosCliente) {
    const saltRounds = 10;
    const contrasenaHasheada = await bcrypt.hash(datosCliente.contrasena, saltRounds);
    
    const nuevoCliente = await prisma.cliente.create({
      data: {
        ...datosCliente,
        contrasena: contrasenaHasheada,
      },
    });
    const { contrasena: _, ...clienteSeguro } = nuevoCliente;
    return clienteSeguro;
  }

  async eliminar(idCliente) {
    await prisma.cliente.delete({ where: { idCliente } });
    return true; 
  }

  async obtenerPerfil(idCliente) {
    const cliente = await prisma.cliente.findUnique({
      where: { idCliente },
      select: {
        idCliente: true, nombre: true, apellido: true, email: true, genero: true, telefono: true, direccion: true, role: true
      }
    });
    return cliente;
  }

  async actualizarPerfil(idCliente, datos) {
    const clienteActualizado = await prisma.cliente.update({
      where: { idCliente },
      data: datos,
      select: {
        idCliente: true, nombre: true, apellido: true, email: true, genero: true, telefono: true, direccion: true, role: true
      }
    });
    return clienteActualizado;
  }

  async listarTodos() {
    return await prisma.cliente.findMany({
      select: {
        idCliente: true, nombre: true, apellido: true, email: true, genero: true, role: true, telefono: true, direccion: true
      }
    });
  }
}

export default new ClientFacade();
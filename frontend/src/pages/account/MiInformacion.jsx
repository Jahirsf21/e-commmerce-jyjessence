import React, { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import EcommerceFacade from '../../patterns/EcommerceFacade';

const MiInformacion = () => {
  const [usuario, setUsuario] = useState(null);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [telefono, setTelefono] = useState('');
  const [password, setPassword] = useState('');
  const [direcciones, setDirecciones] = useState([]);
  const [nuevaDireccion, setNuevaDireccion] = useState({ 
    provincia: '', 
    canton: '', 
    distrito: '', 
    barrio: '', 
    senas: '', 
    codigoPostal: '', 
    referencia: '' 
  });
  const [editandoDireccion, setEditandoDireccion] = useState(null);
  const [mostrarFormAgregar, setMostrarFormAgregar] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    EcommerceFacade.auth.getProfile()
      .then((data) => {
        setUsuario(data);
        setEmail(data.email || '');
        setTelefono(data.telefono || '');
        setDirecciones(data.direcciones || []);
      })
      .catch(() => {
        Swal.fire('Error', 'No se pudo cargar el perfil', 'error');
      })
      .finally(() => setLoading(false));
  }, []);

  const handleUpdate = async (field, value) => {
    setLoading(true);
    try {
      const updated = await EcommerceFacade.auth.updateProfile({ [field]: value });
      setUsuario(updated);
      Swal.fire('Éxito', `${field.charAt(0).toUpperCase() + field.slice(1)} actualizado`, 'success');
    } catch {
      Swal.fire('Error', `No se pudo actualizar el ${field}`, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleAddDireccion = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Usa la fachada para agregar dirección correctamente
      await EcommerceFacade.agregarDireccion(nuevaDireccion);
      // Refresca perfil
      const actualizado = await EcommerceFacade.auth.getProfile();
      setUsuario(actualizado);
      setDirecciones(actualizado.direcciones || []);
      setNuevaDireccion({ provincia: '', canton: '', distrito: '', barrio: '', senas: '', codigoPostal: '', referencia: '' });
      setMostrarFormAgregar(false);
      Swal.fire('Éxito', 'Dirección agregada', 'success');
    } catch (error) {
      Swal.fire('Error', error.message || 'No se pudo agregar la dirección', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleEditarDireccion = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await EcommerceFacade.actualizarDireccion(editandoDireccion.idDireccion, editandoDireccion);
      // Refresca perfil
      const actualizado = await EcommerceFacade.auth.getProfile();
      setUsuario(actualizado);
      setDirecciones(actualizado.direcciones || []);
      setEditandoDireccion(null);
      Swal.fire('Éxito', 'Dirección actualizada', 'success');
    } catch (error) {
      Swal.fire('Error', error.message || 'No se pudo actualizar la dirección', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleEliminarDireccion = async (idDireccion) => {
    const confirmacion = await Swal.fire({
      title: '¿Estás seguro?',
      text: 'No podrás revertir esta acción',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    });

    if (confirmacion.isConfirmed) {
      setLoading(true);
      try {
        await EcommerceFacade.eliminarDireccion(idDireccion);
        // Refresca perfil
        const actualizado = await EcommerceFacade.auth.getProfile();
        setUsuario(actualizado);
        setDirecciones(actualizado.direcciones || []);
        Swal.fire('Éxito', 'Dirección eliminada', 'success');
      } catch (error) {
        Swal.fire('Error', error.message || 'No se pudo eliminar la dirección', 'error');
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="w-full min-h-screen bg-gray-50 pt-24 px-4">
      <h1 className="text-3xl font-bold mb-8">Mi Información</h1>
      {loading && <div className="mb-4">Cargando...</div>}
      {usuario && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <label className="block font-semibold mb-1">Correo electrónico</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} className="border rounded px-3 py-2 w-full" disabled={loading} />
            <button onClick={() => handleUpdate('email', email)} className="mt-2 bg-blue-600 text-white px-4 py-2 rounded" disabled={loading}>Guardar</button>
          </div>
          <div>
            <label className="block font-semibold mb-1">Teléfono</label>
            <input type="tel" value={telefono} onChange={e => setTelefono(e.target.value)} className="border rounded px-3 py-2 w-full" disabled={loading} />
            <button onClick={() => handleUpdate('telefono', telefono)} className="mt-2 bg-blue-600 text-white px-4 py-2 rounded" disabled={loading}>Guardar</button>
          </div>
          <div>
            <label className="block font-semibold mb-1">Restaurar contraseña</label>
            <input type="password" placeholder="Nueva contraseña" value={password} onChange={e => setPassword(e.target.value)} className="border rounded px-3 py-2 w-full" disabled={loading} />
            <button onClick={() => handleUpdate('contrasena', password)} className="mt-2 bg-blue-600 text-white px-4 py-2 rounded" disabled={loading || !password}>Restaurar</button>
          </div>
          <div className="col-span-1 md:col-span-2">
            <h2 className="text-xl font-semibold mb-4">Direcciones</h2>
            
            {/* Lista de direcciones */}
            {direcciones.length > 0 && (
              <div className="space-y-4 mb-4">
                {direcciones.map((dir) => (
                  <div key={dir.idDireccion} className="border rounded-lg p-4 bg-white shadow-sm">
                    {editandoDireccion?.idDireccion === dir.idDireccion ? (
                      <form onSubmit={handleEditarDireccion} className="space-y-3">
                        <div>
                          <label className="block font-medium mb-1">Provincia</label>
                          <input 
                            type="text" 
                            value={editandoDireccion.provincia} 
                            onChange={e => setEditandoDireccion({ ...editandoDireccion, provincia: e.target.value })} 
                            className="border rounded px-3 py-2 w-full" 
                            required 
                            disabled={loading}
                          />
                        </div>
                        <div>
                          <label className="block font-medium mb-1">Cantón</label>
                          <input 
                            type="text" 
                            value={editandoDireccion.canton} 
                            onChange={e => setEditandoDireccion({ ...editandoDireccion, canton: e.target.value })} 
                            className="border rounded px-3 py-2 w-full" 
                            required 
                            disabled={loading}
                          />
                        </div>
                        <div>
                          <label className="block font-medium mb-1">Distrito</label>
                          <input 
                            type="text" 
                            value={editandoDireccion.distrito} 
                            onChange={e => setEditandoDireccion({ ...editandoDireccion, distrito: e.target.value })} 
                            className="border rounded px-3 py-2 w-full" 
                            required 
                            disabled={loading}
                          />
                        </div>
                        <div>
                          <label className="block font-medium mb-1">Barrio</label>
                          <input 
                            type="text" 
                            value={editandoDireccion.barrio || ''} 
                            onChange={e => setEditandoDireccion({ ...editandoDireccion, barrio: e.target.value })} 
                            className="border rounded px-3 py-2 w-full" 
                            disabled={loading}
                          />
                        </div>
                        <div>
                          <label className="block font-medium mb-1">Señas</label>
                          <input 
                            type="text" 
                            value={editandoDireccion.senas} 
                            onChange={e => setEditandoDireccion({ ...editandoDireccion, senas: e.target.value })} 
                            className="border rounded px-3 py-2 w-full" 
                            required 
                            disabled={loading}
                          />
                        </div>
                        <div>
                          <label className="block font-medium mb-1">Código Postal</label>
                          <input 
                            type="text" 
                            value={editandoDireccion.codigoPostal || ''} 
                            onChange={e => setEditandoDireccion({ ...editandoDireccion, codigoPostal: e.target.value })} 
                            className="border rounded px-3 py-2 w-full" 
                            disabled={loading}
                          />
                        </div>
                        <div>
                          <label className="block font-medium mb-1">Referencia</label>
                          <input 
                            type="text" 
                            value={editandoDireccion.referencia || ''} 
                            onChange={e => setEditandoDireccion({ ...editandoDireccion, referencia: e.target.value })} 
                            className="border rounded px-3 py-2 w-full" 
                            disabled={loading}
                          />
                        </div>
                        <div className="flex gap-2">
                          <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700" disabled={loading}>Guardar</button>
                          <button type="button" onClick={() => setEditandoDireccion(null)} className="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400" disabled={loading}>Cancelar</button>
                        </div>
                      </form>
                    ) : (
                      <div>
                        <p className="font-semibold text-lg mb-2">{dir.provincia}, {dir.canton}, {dir.distrito}</p>
                        {dir.barrio && <p className="text-gray-600 text-sm">Barrio: {dir.barrio}</p>}
                        <p className="text-gray-600 mb-1">{dir.senas}</p>
                        {dir.codigoPostal && <p className="text-gray-500 text-sm">Código Postal: {dir.codigoPostal}</p>}
                        {dir.referencia && <p className="text-gray-500 text-sm">Referencia: {dir.referencia}</p>}
                        <div className="flex gap-2 mt-3">
                          <button onClick={() => setEditandoDireccion(dir)} className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 text-sm" disabled={loading}>Editar</button>
                          <button onClick={() => handleEliminarDireccion(dir.idDireccion)} className="bg-gray-400 text-white px-3 py-1 rounded hover:bg-gray-500 text-sm" disabled={loading}>Eliminar</button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Formulario para agregar nueva dirección */}
            {mostrarFormAgregar ? (
              <form onSubmit={handleAddDireccion} className="border rounded-lg p-4 bg-white shadow-sm space-y-3">
                <h3 className="font-semibold text-lg mb-2">Agregar nueva dirección</h3>
                <div>
                  <label className="block font-medium mb-1">Provincia</label>
                  <input 
                    type="text" 
                    value={nuevaDireccion.provincia} 
                    onChange={e => setNuevaDireccion({ ...nuevaDireccion, provincia: e.target.value })} 
                    className="border rounded px-3 py-2 w-full" 
                    required 
                    disabled={loading}
                  />
                </div>
                <div>
                  <label className="block font-medium mb-1">Cantón</label>
                  <input 
                    type="text" 
                    value={nuevaDireccion.canton} 
                    onChange={e => setNuevaDireccion({ ...nuevaDireccion, canton: e.target.value })} 
                    className="border rounded px-3 py-2 w-full" 
                    required 
                    disabled={loading}
                  />
                </div>
                <div>
                  <label className="block font-medium mb-1">Distrito</label>
                  <input 
                    type="text" 
                    value={nuevaDireccion.distrito} 
                    onChange={e => setNuevaDireccion({ ...nuevaDireccion, distrito: e.target.value })} 
                    className="border rounded px-3 py-2 w-full" 
                    required 
                    disabled={loading}
                  />
                </div>
                <div>
                  <label className="block font-medium mb-1">Barrio</label>
                  <input 
                    type="text" 
                    value={nuevaDireccion.barrio} 
                    onChange={e => setNuevaDireccion({ ...nuevaDireccion, barrio: e.target.value })} 
                    className="border rounded px-3 py-2 w-full" 
                    disabled={loading}
                  />
                </div>
                <div>
                  <label className="block font-medium mb-1">Señas</label>
                  <input 
                    type="text" 
                    value={nuevaDireccion.senas} 
                    onChange={e => setNuevaDireccion({ ...nuevaDireccion, senas: e.target.value })} 
                    className="border rounded px-3 py-2 w-full" 
                    required 
                    disabled={loading}
                  />
                </div>
                <div>
                  <label className="block font-medium mb-1">Código Postal</label>
                  <input 
                    type="text" 
                    value={nuevaDireccion.codigoPostal} 
                    onChange={e => setNuevaDireccion({ ...nuevaDireccion, codigoPostal: e.target.value })} 
                    className="border rounded px-3 py-2 w-full" 
                    disabled={loading}
                  />
                </div>
                <div>
                  <label className="block font-medium mb-1">Referencia</label>
                  <input 
                    type="text" 
                    value={nuevaDireccion.referencia} 
                    onChange={e => setNuevaDireccion({ ...nuevaDireccion, referencia: e.target.value })} 
                    className="border rounded px-3 py-2 w-full" 
                    disabled={loading}
                  />
                </div>
                <div className="flex gap-2">
                  <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700" disabled={loading}>Agregar dirección</button>
                  <button type="button" onClick={() => { setMostrarFormAgregar(false); setNuevaDireccion({ provincia: '', canton: '', distrito: '', barrio: '', senas: '', codigoPostal: '', referencia: '' }); }} className="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400" disabled={loading}>Cancelar</button>
                </div>
              </form>
            ) : (
              <button onClick={() => setMostrarFormAgregar(true)} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700" disabled={loading}>+ Agregar dirección</button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default MiInformacion;

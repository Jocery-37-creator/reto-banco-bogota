import React, { useState, useEffect } from 'react';

interface Candidato {
  id: number;
  nombreCompleto: string;       // Antes: nombre
  correoElectronico: string;    // Antes: correo
  carreraUniversitaria: string; // Antes: carrera
  semestreActual: number;       // Antes: semestre
  rutaHojaVida: string;         // Antes: hojaVida
  estado: string;
}

const AnalistaView: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [usuario, setUsuario] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [errorLogin, setErrorLogin] = useState(''); // 

  // Lista de candidatos incial
  const [candidatos, setCandidatos] = useState<Candidato[]>([]);

  // Este hook se dispara cuando el analista hace login exitoso
  useEffect(() => {
    if (isLoggedIn) {
      cargarCandidatos();
    }
  }, [isLoggedIn]);

  // Función para pedirle los datos a Java
  const cargarCandidatos = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/practicantes');
      if (response.ok) {
        const data = await response.json();
        setCandidatos(data); // Llenamos la tabla con lo que mande la base de datos
      }
    } catch (error) {
      console.error("Error obteniendo candidatos:", error);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorLogin('');

    if (usuario.trim() && contrasena.trim()) {
      try {
        // Hacemos el POST al endpoint que acabas de crear
        const response = await fetch('http://localhost:8080/api/analistas/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ usuario, contrasena }),
        });

        if (response.ok) {
          // Si Java responde 200 OK, las credenciales son correctas
          setIsLoggedIn(true);
          setUsuario('');
          setContrasena('');
        } else {
          // Si Java responde 401, falló la autenticación
          setErrorLogin('Usuario o contraseña incorrectos. Intenta de nuevo.');
        }
      } catch (error) {
        console.error("Error de conexión:", error);
        setErrorLogin('No se pudo conectar con el servidor.');
      }
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUsuario('');
    setContrasena('');
  };

  const cambiarEstado = async (id: number, nuevoEstado: string) => {
    try {
      const response = await fetch(`http://localhost:8080/api/practicantes/${id}/estado`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ estado: nuevoEstado }),
      });

      if (response.ok) {
        setCandidatos(candidatos.map((c) =>
          c.id === id ? { ...c, estado: nuevoEstado } : c
        ));
      }
    } catch (error) {
      console.error("Error al actualizar el estado:", error);
    }
  };


  const toggleViabilidad = (id: number, estadoActual: string) => {
    const nuevoEstado = estadoActual === 'Viable' ? 'No viable' : 'Viable';
    cambiarEstado(id, nuevoEstado);
  };

  const descargarPDF = (archivoId: number) => {
    // Abrimos el endpoint de Java que devuelve el PDF en una nueva pestaña
    window.open(`http://localhost:8080/api/practicantes/${archivoId}/cv`, '_blank');
  };

  const getEstadoColor = (estado: string) => {
    switch (estado) {
      case 'Viable':
        return 'bg-green-100 text-green-800';
      case 'No viable':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-yellow-100 text-yellow-800';
    }
  };

  const getEstadoTexto = (estado: string) => {
    switch (estado) {
      case 'Viable':
        return 'Viable';
      case 'No viable':
        return 'No Viable';
      default:
        return 'Pendiente';
    }
  };

  // VISTA 1: LOGIN
  if (!isLoggedIn) {
    return (
      <div className="min-h-fit flex items-center justify-center p-4 mt-10">
        <div className="bg-white rounded-lg shadow-2xl p-8 w-full max-w-md">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-blue-900 text-center">
              Acceso Analistas CoE
            </h1>
            <div className="w-16 h-1 bg-yellow-400 mx-auto mt-2"></div>
          </div>
          {errorLogin && (
            <div className="mb-6 p-3 bg-red-100 border border-red-400 text-red-700 rounded-md text-sm font-semibold text-center">
              {errorLogin}
            </div>
          )}
          <form onSubmit={handleLogin} className="space-y-6">
            {/* Campo Usuario */}
            <div>
              <label
                htmlFor="usuario"
                className="block text-sm font-semibold text-blue-900 mb-2"
              >
                Usuario
              </label>
              <input
                id="usuario"
                type="text"
                value={usuario}
                onChange={(e) => setUsuario(e.target.value)}
                placeholder="Ingresa tu usuario"
                required
                className="w-full px-4 py-2 border-2 border-gray-300 rounded-md focus:outline-none focus:border-blue-900 transition-colors"
              />
            </div>

            {/* Campo Contraseña */}
            <div>
              <label
                htmlFor="contrasena"
                className="block text-sm font-semibold text-blue-900 mb-2"
              >
                Contraseña
              </label>
              <input
                id="contrasena"
                type="password"
                required
                value={contrasena}
                onChange={(e) => setContrasena(e.target.value)}
                placeholder="Ingresa tu contraseña"
                className="w-full px-4 py-2 border-2 border-gray-300 rounded-md focus:outline-none focus:border-blue-900 transition-colors"
              />
            </div>

            {/* Botón Ingresar */}
            <button
              type="submit"
              className="w-full bg-blue-900 text-white font-bold py-3 rounded-md hover:bg-blue-800 transition-colors shadow-lg"
            >
              Ingresar
            </button>
          </form>

          <p className="text-center text-gray-500 text-sm mt-6">
            © 2024 Banco de Bogotá - Portal de Selección
          </p>
        </div>
      </div>
    );
  }

  // VISTA 2: DASHBOARD DEL ANALISTA
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-4 flex justify-between items-center border-b border-gray-200 mb-6">
        <h1 className="text-3xl font-bold text-blue-900">Portal de Selección</h1>
        <button
          onClick={handleLogout}
          className="border-2 border-red-600 text-red-600 hover:bg-red-50 font-semibold px-4 py-2 rounded-md transition-colors"
        >
          Cerrar Sesión
        </button>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Título de la sección */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-blue-900 mb-2">
            Candidatos para Revisión
          </h2>
          <p className="text-gray-600">
            Total de candidatos: <span className="font-bold">{candidatos.length}</span>
          </p>
        </div>

        {/* Tabla de Candidatos */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-blue-900 text-white">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-bold">ID</th>
                  <th className="px-6 py-4 text-left text-sm font-bold">Nombre</th>
                  <th className="px-6 py-4 text-left text-sm font-bold">Correo</th>
                  <th className="px-6 py-4 text-left text-sm font-bold">Carrera</th>
                  <th className="px-6 py-4 text-left text-sm font-bold">Semestre</th>
                  <th className="px-6 py-4 text-left text-sm font-bold">Hoja de Vida</th>
                  <th className="px-6 py-4 text-left text-sm font-bold">Estado</th>
                  <th className="px-6 py-4 text-left text-sm font-bold">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {candidatos.map((candidato, index) => (
                  <tr
                    key={candidato.id}
                    className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}
                  >
                    <td className="px-6 py-4 text-sm font-semibold text-blue-900">
                      {candidato.id}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {candidato.nombreCompleto}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {candidato.correoElectronico}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {candidato.carreraUniversitaria}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {candidato.semestreActual}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <button
                        onClick={() => descargarPDF(candidato.id)}
                        className="text-blue-600 hover:text-blue-900 font-semibold underline transition-colors"
                      >
                        📄 Descargar
                      </button>
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <span
                        className={`inline-flex items-center justify-center px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap min-w-[80px] ${getEstadoColor(
                          candidato.estado
                        )}`}
                      >
                        {getEstadoTexto(candidato.estado)}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <button
                        onClick={() => toggleViabilidad(candidato.id, candidato.estado)}
                        className={`w-32 px-2 py-2 rounded-md font-bold text-xs transition-all shadow-sm border-2 ${
                          candidato.estado === 'Viable'
                            ? 'bg-green-500 border-green-500 text-white' 
                            : 'bg-white border-gray-300 text-gray-700 hover:border-green-500 hover:text-green-600'
                        }`}
                      >
                        {candidato.estado === 'Viable' ? '✓ Viable' : 'Marcar Viable'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Footer Info */}
        <div className="mt-8 text-center text-gray-600 text-sm">
          <p>© 2024 Banco de Bogotá - Centro de Excelencia</p>
        </div>
      </main>
    </div>
  );
};

export default AnalistaView;

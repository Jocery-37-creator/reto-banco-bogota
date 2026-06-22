import React, { useState, useEffect, useMemo } from 'react';

interface Candidato {
  id: number;
  nombreCompleto: string;       
  correoElectronico: string;   
  carreraUniversitaria: string; 
  semestreActual: number;       
  rutaHojaVida: string;         
  estado: string;
}

const AnalistaView: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [usuario, setUsuario] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [errorLogin, setErrorLogin] = useState('');

  const [candidatos, setCandidatos] = useState<Candidato[]>([]);
  
  // Estados para Búsqueda y Ordenamiento
  const [busqueda, setBusqueda] = useState('');
  const [ordenConfig, setOrdenConfig] = useState<{ key: keyof Candidato, direccion: 'asc' | 'desc' } | null>(null);

  useEffect(() => {
    if (isLoggedIn) {
      cargarCandidatos();
    }
  }, [isLoggedIn]);

  const cargarCandidatos = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/practicantes');
      if (response.ok) {
        const data = await response.json();
        setCandidatos(data);
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
        const response = await fetch('http://localhost:8080/api/analistas/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ usuario, contrasena }),
        });

        if (response.ok) {
          setIsLoggedIn(true);
          setUsuario('');
          setContrasena('');
        } else {
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
    setBusqueda(''); // Limpiamos filtros al salir
    setOrdenConfig(null);
  };

  const cambiarEstado = async (id: number, nuevoEstado: string) => {
    try {
      const response = await fetch(`http://localhost:8080/api/practicantes/${id}/estado`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
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

  const descargarPDF = (archivoId: number) => {
    window.open(`http://localhost:8080/api/practicantes/${archivoId}/cv`, '_blank');
  };

  const getEstadoColor = (estado: string) => {
    switch (estado) {
      case 'Viable': return 'bg-green-100 text-green-800 border border-green-200';
      case 'No viable': return 'bg-red-100 text-red-800 border border-red-200';
      default: return 'bg-yellow-100 text-yellow-800 border border-yellow-200';
    }
  };

  const getEstadoTexto = (estado: string) => {
    switch (estado) {
      case 'Viable': return 'Viable';
      case 'No viable': return 'No Viable';
      default: return 'Pendiente';
    }
  };

  // --- LÓGICA DE FILTRADO Y ORDENAMIENTO (EL CEREBRO) ---
  const solicitarOrden = (key: keyof Candidato) => {
    let direccion: 'asc' | 'desc' = 'asc';
    if (ordenConfig && ordenConfig.key === key && ordenConfig.direccion === 'asc') {
      direccion = 'desc';
    }
    setOrdenConfig({ key, direccion });
  };

  const candidatosProcesados = useMemo(() => {
    let lista = [...candidatos];

    // 1. Filtrado por barra de búsqueda
    if (busqueda) {
      const termino = busqueda.toLowerCase();
      lista = lista.filter(c => 
        c.nombreCompleto.toLowerCase().includes(termino) ||
        c.correoElectronico.toLowerCase().includes(termino) ||
        (c.carreraUniversitaria && c.carreraUniversitaria.toLowerCase().includes(termino)) ||
        c.estado.toLowerCase().includes(termino) ||
        c.id.toString().includes(termino)
      );
    }

    // 2. Ordenamiento inteligente (ignorando mayúsculas/minúsculas)
    if (ordenConfig) {
      lista.sort((a, b) => {
        let valA = a[ordenConfig.key];
        let valB = b[ordenConfig.key];
        
        if (typeof valA === 'string') valA = valA.toLowerCase();
        if (typeof valB === 'string') valB = valB.toLowerCase();

        if (valA < valB) return ordenConfig.direccion === 'asc' ? -1 : 1;
        if (valA > valB) return ordenConfig.direccion === 'asc' ? 1 : -1;
        return 0;
      });
    }

    return lista;
  }, [candidatos, busqueda, ordenConfig]);

  // Función auxiliar para dibujar los encabezados ordenables limpios
  const renderHeader = (key: keyof Candidato, label: string) => {
    const isSorted = ordenConfig?.key === key;
    return (
      <th 
        className="px-6 py-4 text-left text-sm font-bold cursor-pointer hover:bg-blue-800 transition-colors group select-none"
        onClick={() => solicitarOrden(key)}
      >
        <div className="flex items-center gap-2">
          {label}
          {/* Solo mostramos la flecha si está activo, de lo contrario se oculta */}
          <span className={`text-xs ${isSorted ? 'text-yellow-400' : 'text-transparent group-hover:text-blue-400/50'}`}>
            {isSorted ? (ordenConfig.direccion === 'asc' ? '↑' : '↓') : '↓'}
          </span>
        </div>
      </th>
    );
  };

  // --- VISTA 1: LOGIN ---
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
            <div>
              <label htmlFor="usuario" className="block text-sm font-semibold text-blue-900 mb-2">Usuario</label>
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
            <div>
              <label htmlFor="contrasena" className="block text-sm font-semibold text-blue-900 mb-2">Contraseña</label>
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
            <button type="submit" className="w-full bg-blue-900 text-white font-bold py-3 rounded-md hover:bg-blue-800 transition-colors shadow-lg">
              Ingresar
            </button>
          </form>
          <p className="text-center text-gray-500 text-sm mt-6">© 2024 Banco de Bogotá - Portal de Selección</p>
        </div>
      </div>
    );
  }

  // --- VISTA 2: DASHBOARD DEL ANALISTA ---
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Superior */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-4 flex justify-between items-center border-b border-gray-200 mb-6">
        <h1 className="text-3xl font-bold text-blue-900">Portal de Selección</h1>
        <button
          onClick={handleLogout}
          className="border-2 border-red-600 text-red-600 hover:bg-red-50 font-semibold px-4 py-2 rounded-md transition-colors"
        >
          Cerrar Sesión
        </button>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Título unificado y Barra de Búsqueda Elegante */}
        <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <h2 className="text-2xl font-bold text-blue-900 mb-2">
              Candidatos para Revisión
            </h2>
            <p className="text-gray-600 text-sm">
              Mostrando <span className="font-bold text-blue-900">{candidatosProcesados.length}</span> de {candidatos.length} registros
            </p>
          </div>
          
          <div className="w-full md:w-80 relative">
             <span className="absolute left-3 top-2.5 text-gray-400"></span>
             <input
              type="text"
              placeholder="Buscar candidato, carrera..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-900 transition-colors shadow-sm"
            />
          </div>
        </div>

        {/* Tabla de Candidatos */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-blue-900 text-white border-b-4 border-yellow-400">
                <tr>
                  {renderHeader('id', 'ID')}
                  {renderHeader('nombreCompleto', 'Nombre')}
                  {renderHeader('correoElectronico', 'Correo')}
                  {renderHeader('carreraUniversitaria', 'Carrera')}
                  {renderHeader('semestreActual', 'Semestre')}
                  <th className="px-6 py-4 text-left text-sm font-bold">Hoja de Vida</th>
                  {renderHeader('estado', 'Estado')}
                  <th className="px-6 py-4 text-left text-sm font-bold">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {candidatosProcesados.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="px-6 py-12 text-center text-gray-500 font-medium">
                      No se encontraron candidatos que coincidan con tu búsqueda.
                    </td>
                  </tr>
                ) : (
                  candidatosProcesados.map((candidato, index) => (
                    <tr key={candidato.id} className={`${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'} hover:bg-blue-50 transition-colors`}>
                      <td className="px-6 py-4 text-sm font-semibold text-blue-900">{candidato.id}</td>
                      <td className="px-6 py-4 text-sm text-gray-900 font-medium">{candidato.nombreCompleto}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">{candidato.correoElectronico}</td>
                      <td className="px-6 py-4 text-sm text-gray-900">{candidato.carreraUniversitaria}</td>
                      <td className="px-6 py-4 text-sm text-gray-900">{candidato.semestreActual}</td>
                      <td className="px-6 py-4 text-sm">
                        <button
                          onClick={() => descargarPDF(candidato.id)}
                          className="text-blue-600 hover:text-blue-900 font-semibold underline transition-colors flex items-center gap-1"
                        >
                          📄 Descargar
                        </button>
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <span className={`inline-flex items-center justify-center px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap min-w-[80px] ${getEstadoColor(candidato.estado)}`}>
                          {getEstadoTexto(candidato.estado)}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <div className="flex items-center gap-2">
                          {/* Botón Viable */}
                          <button
                            onClick={() => cambiarEstado(candidato.id, 'Viable')}
                            disabled={candidato.estado === 'Viable'}
                            className={`px-3 py-1.5 rounded-md font-bold text-xs transition-all border-2 ${
                              candidato.estado === 'Viable'
                                ? 'bg-green-500 border-green-500 text-white cursor-default shadow-inner'
                                : 'bg-white border-green-500 text-green-600 hover:bg-green-50'
                            }`}
                          >
                            ✔ Viable
                          </button>

                          {/* Botón No Viable */}
                          <button
                            onClick={() => cambiarEstado(candidato.id, 'No viable')}
                            disabled={candidato.estado === 'No viable'}
                            className={`px-3 py-1.5 rounded-md font-bold text-xs transition-all border-2 ${
                              candidato.estado === 'No viable'
                                ? 'bg-red-500 border-red-500 text-white cursor-default shadow-inner'
                                : 'bg-white border-red-500 text-red-600 hover:bg-red-50'
                            }`}
                          >
                            ✘ No Viable
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Footer Info */}
        <div className="mt-8 text-center text-gray-600 text-sm">
          <p>© 2026 Banco de Bogotá - Centro de Excelencia</p>
        </div>
      </main>
    </div>
  );
};

export default AnalistaView;
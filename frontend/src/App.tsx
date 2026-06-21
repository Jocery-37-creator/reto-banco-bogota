import { useState } from 'react'
import { PracticanteForm } from './components/PracticanteForm'
import AnalistaView from './components/AnalistaView'
import HelpButton from './components/HelpButton'


function App() {
    // Estado que controla qué pantalla se muestra
    const [vistaActual, setVistaActual] = useState<'formulario' | 'dashboard'>('formulario')
    
    return (
        <div className="min-h-screen bg-slate-50">
            {/* Barra de Navegación */}
            <div className="w-full px-4 pt-3">
                <nav className="bg-blue-900 mx-auto max-w-8xl p-4 shadow-3xl shadow-blue-900/50 text-white rounded-2xl transition-all duration-300">
                    <div className="container mx-auto flex justify-between items-center">
                        <span className="font-bold text-xl tracking-wider"></span>
                        <div>
                            {vistaActual === 'formulario' ? (
                                <button
                                    onClick={() => setVistaActual('dashboard')}
                                    className="px-4 py-2 rounded-md font-medium transition-colors bg-black/20 hover:bg-black/10"
                                >
                                    Soy Analista
                                </button>
                            ) : (
                                <button
                                    onClick={() => setVistaActual('formulario')}
                                    className="px-4 py-2 rounded-md font-medium transition-colors bg-black/20 hover:bg-black/10"
                                >
                                    Soy Practicante
                                </button>
                            )}
                        </div>
                    </div>
                </nav>
            </div>

            {/* Renderizado Dinámico de la SPA */}
            <main className="container mx-auto pt-8 pb-16">                  
                {vistaActual === 'formulario' ? (
                    <>
                    <PracticanteForm />
                    <HelpButton /> 
                    </>

                ) : (
                    <AnalistaView />
                )}
            </main>
        </div>
    )
}

export default App
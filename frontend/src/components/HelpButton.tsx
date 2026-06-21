import { useState } from 'react';

export default function HelpButton() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Botón flotante de ayuda */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-8 right-8 flex items-center gap-2 bg-yellow-400 hover:bg-yellow-500 text-blue-900 font-semibold px-6 py-3 rounded-full shadow-lg transition-all duration-300 hover:shadow-xl z-40"
        aria-label="Ayuda"
      >
        <div className="w-6 h-6 border-2 border-blue-900 rounded flex items-center justify-center">
          <span className="text-sm font-bold">?</span>
        </div>
        <span>Ayuda</span>
      </button>

      {/* Panel flotante de ayuda (opcional) */}
      {isOpen && (
        <div className="fixed bottom-24 right-8 w-80 bg-white rounded-lg shadow-2xl p-6 z-40 border-l-4 border-blue-900">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-bold text-blue-900">Centro de Ayuda</h3>
            <button
              onClick={() => setIsOpen(false)}
              className="text-gray-500 hover:text-gray-700 font-bold text-xl"
              aria-label="Cerrar"
            >
              ✕
            </button>
          </div>
          
          <div className="space-y-3 text-sm text-gray-700">
            <p>
              <strong className="text-blue-900">¿Necesitas ayuda?</strong>
            </p>
            <ul className="space-y-2 ml-4 list-disc">
              <li>Completa todos los campos del formulario</li>
              <li>Carga un archivo PDF válido de tu hoja de vida</li>
              <li>Verifica que tus datos sean correctos antes de enviar</li>
            </ul>
          </div>
        </div>
      )}
    </>
  );
}

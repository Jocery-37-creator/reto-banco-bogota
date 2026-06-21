export function Footer() {
  return (
    // Contenedor que le da el espacio para flotar (márgenes laterales y separación del fondo)
    <div className="w-full px-4 pb-6">
      <footer className="bg-blue-900 text-white py-12 px-6 md:px-12 mx-auto max-w-8xl shadow-2xl shadow-blue-900/50 rounded-2xl transition-all duration-300">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8 mb-8">
          {/* Logo Section */}
          <div className="flex flex-col items-center md:items-start">
            <div className="w-48 h-16 rounded flex items-center justify-center">
              <img
                src="/LogoFoot.png"
                alt="Banco de Bogotá"
                className="w-full h-full object-contain"
              />
            </div>
          </div>

          {/* Atención al cliente */}
          <div>
            <h3 className="font-bold text-lg mb-4">Atención al cliente</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#" className="hover:text-yellow-400 transition">
                  ¿Necesitas ayuda?
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-yellow-400 transition">
                  Canales de atención
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-yellow-400 transition">
                  Protección al consumidor
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-yellow-400 transition">
                  Defensor del consumidor
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-yellow-400 transition">
                  Seguridad bancaria
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-yellow-400 transition">
                  Disponibilidad en canales
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-yellow-400 transition">
                  Autogestión
                </a>
              </li>
            </ul>
          </div>

          {/* Beneficios */}
          <div>
            <h3 className="font-bold text-lg mb-4">Beneficios</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#" className="hover:text-yellow-400 transition">
                  Alianzas Banco de Bogotá
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-yellow-400 transition">
                  Programa de lealtad Tuplús
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-yellow-400 transition">
                  Opciones para ponerte al día
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-yellow-400 transition">
                  Asistencias
                </a>
              </li>
            </ul>
          </div>

          {/* Información */}
          <div>
            <h3 className="font-bold text-lg mb-4">Información</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#" className="hover:text-yellow-400 transition">
                  Tasas y tarifas
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-yellow-400 transition">
                  Nuestras bancas
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-yellow-400 transition">
                  Sostenibilidad
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-yellow-400 transition">
                  Nuestra organización
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-yellow-400 transition">
                  Educación financiera
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-yellow-400 transition">
                  Pago de impuestos
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-yellow-400 transition">
                  Investigaciones económicas
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-yellow-400 transition">
                  Términos y condiciones
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-yellow-400 transition">
                  Inversionistas
                </a>
              </li>
            </ul>
          </div>

          {/* Contacto */}
          <div>
            <h3 className="font-bold text-lg mb-4">Contacto</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#" className="hover:text-yellow-400 transition">
                  Servilíneas
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-yellow-400 transition">
                  Oficinas
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-yellow-400 transition">
                  WhatsApp
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <hr className="border-blue-800 my-8" />

        {/* Bottom Footer */}
        <div className="flex flex-col md:flex-row justify-between items-center text-xs text-gray-300">
          <p>&copy; 2026 Banco de Bogotá. Todos los derechos reservados.</p>
          <div className="flex gap-6 mt-4 md:mt-0">
            <a href="#" className="hover:text-white transition">
              Privacidad
            </a>
            <a href="#" className="hover:text-white transition">
              Cookies
            </a>
            <a href="#" className="hover:text-white transition">
              Legal
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
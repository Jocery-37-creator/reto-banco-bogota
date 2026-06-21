/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["IBM Plex Sans", "system-ui", "sans-serif"],
      },
      colors: {
        border: "#e5e7eb", // gris claro para bordes
        input: "#d1d5db",
        background: "#f8fafc", // fondo general de la app
        foreground: "#0f172a", // texto principal
        card: {
          DEFAULT: "#ffffff", // fondo blanco de la tarjeta
          foreground: "#0f172a", // texto dentro de la tarjeta
        },
        muted: {
          DEFAULT: "#f1f5f9",
          foreground: "#64748b", // texto secundario (gris)
        },
        secondary: {
          DEFAULT: "#f1f5f9",
          foreground: "#0f172a",
        },
        brand: {
          DEFAULT: "#1e3a8a", // Azul Marino del Banco de Bogotá
          foreground: "#ffffff", // Texto blanco sobre botones azules
          red: "#dc2626", // Rojo para errores
        },
        destructive: {
          DEFAULT: "#ef4444", // Rojo peligro
          foreground: "#ffffff",
        },
      }
    },
  },
  plugins: [],
}
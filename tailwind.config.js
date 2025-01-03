/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,jsx,ts,tsx}",  // Archivos en la carpeta 'pages'
    "./components/**/*.{js,jsx,ts,tsx}",  // Archivos en la carpeta 'components'
    "./app/**/*.{js,jsx,ts,tsx}",  // Si usas la carpeta 'app' en Next.js 13+
    "./src/**/*.{js,jsx,ts,tsx}",
    "./src/**/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}

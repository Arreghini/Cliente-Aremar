/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './src/**/*.{js,jsx,ts,tsx}', // ajusta el contenido según tu estructura de proyecto
  ],
  theme: {
    extend: {
      fontFamily: {
        'pacifico': ['Pacifico', 'cursive'],
        'playwrite': ['"Playwrite TZ"', 'sans-serif'],
      },
      colors: {
        'yellow-300': '#FFD700',
        'yellow-600': '#FFB300',
        a: '#2174A0' ,
      }
    }
  },
  plugins: [],
}
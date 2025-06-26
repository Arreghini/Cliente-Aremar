import forms from '@tailwindcss/forms';
import typography from '@tailwindcss/typography';

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './src/**/*.{js,jsx,ts,tsx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        heading: ['Poppins', 'sans-serif'],
        body: ['Open Sans', 'sans-serif'],
        accent: ['Lora', 'serif'],
      },
      colors: {
        mar: {
          profundo: '#0077B6',
          claro: '#00B4D8',
          espuma: '#90E0EF',
        },
        playa: {
          sol: '#FFD60A',
          arena: '#FFEDD5',
        },
        neutral: {
          oscuro: '#333333',
          claro: '#F8F9FA',
        },
      },
    },
  },
  plugins: [forms, typography],
  corePlugins: {
    preflight: true,
  },
};

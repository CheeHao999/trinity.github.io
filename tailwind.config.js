/** @type {import('tailwindcss').Config} */

export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    container: {
      center: true,
      padding: '2rem',
    },
    extend: {
      colors: {
        primary: '#ffffff', // White primary for dark theme
        secondary: '#1a1a1a', // Dark secondary
        background: '#0a0a0a', // Very dark background
        surface: '#121212', // Slightly lighter for cards
        success: '#ffffff', 
        error: '#ef4444',
        'mappa-black': '#000000',
        'mappa-white': '#ffffff',
        'mappa-grey': '#333333',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        display: ['Oswald', 'sans-serif'],
      },
      borderRadius: {
        DEFAULT: '0px',
        'sm': '0px',
        'md': '0px',
        'lg': '0px',
        'xl': '0px',
        '2xl': '0px',
        '3xl': '0px',
        'full': '9999px',
      }
    },
  },
  plugins: [],
};

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#FF6B00',
          light: '#FF8A3D',
          dark: '#CC5500',
        },
        text: {
          primary: '#FFFFFF',
          secondary: '#CCCCCC',
          muted: '#999999',
        },
        background: {
          main: '#121212',
          paper: '#1E1E1E',
          elevated: '#2D2D2D',
        },
        error: {
          DEFAULT: '#FF5252',
          light: '#FF7B7B',
        },
        surface: {
          light: '#2D2D2D',
          dark: '#1E1E1E',
        }
      },
      fontFamily: {
        sans: ['Inter', 'Roboto', 'Helvetica', 'Arial', 'sans-serif'],
      },
      boxShadow: {
        glass: '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
      },
      backdropBlur: {
        glass: '10px',
      },
    },
  },
  plugins: [],
} 
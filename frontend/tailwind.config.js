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
          50: '#FFF2E5',
          100: '#FFE5CC',
          200: '#FFCB99',
          300: '#FFB266',
          400: '#FF9833',
          500: '#FF6B00',
          600: '#CC5500',
          700: '#994000',
          800: '#662A00',
          900: '#331500',
        },
        text: {
          primary: '#FFFFFF',
          secondary: '#CCCCCC',
          muted: '#999999',
          dark: '#1A1A1A',
        },
        background: {
          main: '#121212',
          paper: '#1E1E1E',
          elevated: '#2D2D2D',
          gradient: 'linear-gradient(180deg, #121212 0%, #1E1E1E 100%)',
        },
        error: {
          DEFAULT: '#FF5252',
          light: '#FF7B7B',
          dark: '#CC4141',
        },
        success: {
          DEFAULT: '#4CAF50',
          light: '#7BC67E',
          dark: '#3D8C40',
        },
        warning: {
          DEFAULT: '#FFC107',
          light: '#FFDD3D',
          dark: '#CC9A06',
        },
        info: {
          DEFAULT: '#2196F3',
          light: '#64B5F6',
          dark: '#1976D2',
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
        'glass-sm': '0 4px 16px 0 rgba(0, 0, 0, 0.37)',
        'glass-lg': '0 16px 48px 0 rgba(0, 0, 0, 0.37)',
        'inner-glow': 'inset 0 0 20px 0 rgba(255, 107, 0, 0.15)',
        'neon': '0 0 10px rgba(255, 107, 0, 0.5), 0 0 20px rgba(255, 107, 0, 0.3), 0 0 30px rgba(255, 107, 0, 0.1)',
        'neon-text': '0 0 5px rgba(255, 107, 0, 0.5)',
      },
      backdropBlur: {
        glass: '10px',
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'spin-slow': 'spin 8s linear infinite',
        'shimmer': 'shimmer 2s linear infinite',
        'gradient': 'gradient 8s ease infinite',
        'fade-in': 'fadeIn 0.5s ease-out',
        'slide-up': 'slideUp 0.5s ease-out',
        'slide-down': 'slideDown 0.5s ease-out',
        'slide-in-right': 'slideInRight 0.5s ease-out',
        'slide-in-left': 'slideInLeft 0.5s ease-out',
        'bounce-in': 'bounceIn 0.5s ease-out',
        'scale-in': 'scaleIn 0.3s ease-out',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-1000px 0' },
          '100%': { backgroundPosition: '1000px 0' },
        },
        gradient: {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideDown: {
          '0%': { transform: 'translateY(-20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideInRight: {
          '0%': { transform: 'translateX(20px)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        slideInLeft: {
          '0%': { transform: 'translateX(-20px)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        bounceIn: {
          '0%': { transform: 'scale(0.8)', opacity: '0' },
          '70%': { transform: 'scale(1.05)', opacity: '1' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.9)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
      },
      backgroundImage: {
        'glass-gradient': 'linear-gradient(135deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.05))',
        'glow-gradient': 'radial-gradient(circle, rgba(255, 107, 0, 0.15) 0%, rgba(255, 107, 0, 0) 70%)',
        'primary-gradient': 'linear-gradient(90deg, #FF6B00 0%, #FF8A3D 100%)',
        'dark-gradient': 'linear-gradient(180deg, #121212 0%, #1E1E1E 100%)',
      },
      borderRadius: {
        'xl': '1rem',
        '2xl': '1.5rem',
        '3xl': '2rem',
      },
    },
  },
  plugins: [],
} 
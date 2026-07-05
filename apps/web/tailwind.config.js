/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#4f46e5', // indigo-600
          hover: '#6366f1', // indigo-500
          glow: 'rgba(79, 70, 229, 0.25)', // For shadows
        },
        dark: {
          bg: '#08080a',
          card: '#0d0c12',
          border: 'rgba(255, 255, 255, 0.08)'
        }
      },
      fontFamily: {
        sans: ['Outfit', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['Geist Mono', 'monospace'],
      },
      animation: {
        'nav-glow': 'navGlow 2s ease-in-out infinite',
        'float': 'plFloat 4s ease-in-out infinite',
      },
      keyframes: {
        navGlow: {
          '0%, 100%': { opacity: '0.5' },
          '50%': { opacity: '1' },
        },
        plFloat: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-7px)' },
        }
      }
    },
  },
  plugins: [],
}

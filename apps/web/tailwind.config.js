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
          DEFAULT: '#3b82f6', // Electric Blue (blue-500)
          hover: '#f97316', // Cyber Orange (orange-500)
          glow: 'rgba(59, 130, 246, 0.25)', // Blue glow
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

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        police: {
          950: '#070a0f',
          900: '#0b1118',
          850: '#101823',
          800: '#162232',
          700: '#1f3046',
          600: '#2d4564',
          500: '#3e608b',
        },
        terminal: {
          amber: '#f59e0b',
          'amber-glow': '#fbbf24',
          cyan: '#06b6d4',
          green: '#10b981',
          red: '#ef4444',
          dim: '#475569',
        },
        dossier: {
          paper: '#f8f6f0',
          dark: '#1e2022',
          card: '#15181c',
          border: '#2a2f38',
          highlight: '#eab308',
        }
      },
      fontFamily: {
        mono: ['JetBrains Mono', 'Courier New', 'Consolas', 'monospace'],
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        typewriter: ['Special Elite', 'Courier Prime', 'monospace'],
      },
      animation: {
        'pulse-fast': 'pulse 1s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'flicker': 'flicker 0.15s infinite',
        'shake': 'shake 0.4s cubic-bezier(.36,.07,.19,.97) both',
        'glitch': 'glitch 0.3s ease-in-out',
      },
      keyframes: {
        shake: {
          '10%, 90%': { transform: 'translate3d(-2px, 0, 0)' },
          '20%, 80%': { transform: 'translate3d(4px, 0, 0)' },
          '30%, 50%, 70%': { transform: 'translate3d(-4px, 0, 0)' },
          '40%, 60%': { transform: 'translate3d(4px, 0, 0)' },
        }
      }
    },
  },
  plugins: [],
}

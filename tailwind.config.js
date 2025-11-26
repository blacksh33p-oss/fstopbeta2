/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
        lcd: ['Share Tech Mono', 'monospace'],
      },
      animation: {
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'flicker': 'flicker 3s infinite',
        'tally': 'tally 2s infinite',
      },
      keyframes: {
        flicker: {
          '0%, 100%': { opacity: '0.2' },
          '50%': { opacity: '0.25' },
          '25%, 75%': { opacity: '0.18' },
        },
        tally: {
          '0%, 100%': { opacity: '1', transform: 'scale(1)' },
          '50%': { opacity: '0.5', transform: 'scale(0.9)' },
        }
      }
    },
  },
  plugins: [],
}
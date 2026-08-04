/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        ink: {
          950: '#080B12',
          900: '#0B1220',
          800: '#111A2C',
          700: '#182238',
          600: '#243252'
        },
        amber: {
          400: '#F2B705',
          500: '#E0A800'
        },
        teal: {
          400: '#2DD4BF'
        },
        violet: {
          400: '#8B7FD1'
        },
        coral: {
          400: '#F0654F'
        }
      },
      fontFamily: {
        mono: ['"JetBrains Mono"', 'ui-monospace', 'SFMono-Regular', 'monospace'],
        sans: ['"Inter"', 'system-ui', 'sans-serif']
      },
      boxShadow: {
        glow: '0 0 0 1px rgba(242,183,5,0.15), 0 8px 30px rgba(0,0,0,0.35)'
      }
    }
  },
  plugins: []
};

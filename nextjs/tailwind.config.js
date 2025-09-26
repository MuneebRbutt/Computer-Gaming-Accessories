/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: '#0ea5e9',
          dark: '#0b84b6'
        },
        surface: '#0f172a',
        card: '#111827'
      },
      boxShadow: {
        soft: '0 10px 25px -10px rgba(14,165,233,0.35)'
      },
      fontFamily: {
        sans: ['Poppins', 'ui-sans-serif', 'system-ui', 'Segoe UI', 'Roboto']
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-6px)' }
        },
        glow: {
          '0%, 100%': { boxShadow: '0 0 0px rgba(14,165,233,0.0)' },
          '50%': { boxShadow: '0 0 24px rgba(14,165,233,0.35)' }
        },
        shimmer: {
          '0%': { backgroundPosition: '200% 0' },
          '100%': { backgroundPosition: '-200% 0' }
        }
      },
      animation: {
        float: 'float 6s ease-in-out infinite',
        glow: 'glow 2.6s ease-in-out infinite',
        shimmer: 'shimmer 3s linear infinite'
      }
    },
  },
  plugins: [],
}

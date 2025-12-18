/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        gaming: {
          // Deep Void & Dark Accents
          background: '#070b14',  // Deepest dark blue/black
          card: '#0f1623',        // Slightly lighter card bg
          surface: '#182132',     // Surface elements
          muted: '#64748B',       // Muted functional color

          // Primary Accents (Electric Violet -> Hot Pink)
          primary: '#8B5CF6',     // Electric Violet
          secondary: '#D946EF',   // Hot Pink
          accent: '#06b6d4',      // Cyan/Electric Blue

          // Functional
          success: '#10B981',
          warning: '#F59E0B',
          error: '#EF4444',

          // Text
          text: {
            primary: '#F8F8FA',
            secondary: '#94A3B8',
            muted: '#64748B',
            accent: '#D946EF'
          }
        },
        // Maintain compatibility but override with improved functional scales if needed
        primary: {
          DEFAULT: '#8B5CF6',
          50: '#f5f3ff',
          100: '#ede9fe',
          200: '#ddd6fe',
          300: '#c4b5fd',
          400: '#a78bfa',
          500: '#8b5cf6',
          600: '#7c3aed',
          700: '#6d28d9',
          800: '#5b21b6',
          900: '#4c1d95',
          950: '#2e1065',
        }
      },
      fontFamily: {
        display: ['Orbitron', 'system-ui', 'sans-serif'],
        heading: ['Orbitron', 'system-ui', 'sans-serif'],
        body: ['Poppins', 'system-ui', 'sans-serif'],
        sans: ['Poppins', 'system-ui', 'sans-serif'],
        mono: ['ui-monospace', 'SF Mono', 'Monaco', 'Inconsolata', 'Fira Code', 'monospace']
      },
      fontSize: {
        'hero-lg': 'clamp(3rem, 6vw, 7rem)',
        'hero': 'clamp(2.5rem, 5vw, 6rem)',
        'display': 'clamp(2rem, 4vw, 3.5rem)',
        'h1': 'clamp(1.75rem, 3vw, 2.625rem)',
        'h2': 'clamp(1.5rem, 2.5vw, 2rem)',
        'h3': '1.5rem',
        'h4': '1.25rem',
        'h5': '1.125rem',
        'body-lg': '1.125rem',
        'body': '1rem',
        'small': '0.875rem'
      },
      boxShadow: {
        'neon': '0 0 10px rgba(139, 92, 246, 0.5), 0 0 20px rgba(139, 92, 246, 0.3)',
        'neon-hover': '0 0 15px rgba(139, 92, 246, 0.6), 0 0 30px rgba(139, 92, 246, 0.4)',
        'glass': '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
        'card': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'hero-glow': 'conic-gradient(from 180deg at 50% 50%, #0f1623 0deg, #182132 180deg, #0f1623 360deg)',
        'card-gradient': 'linear-gradient(135deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.01) 100%)',
      },
      backdropBlur: {
        xs: '2px',
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'pulse-glow': 'pulse-glow 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'shimmer': 'shimmer 2.5s linear infinite',
        'slide-up': 'slide-up 0.5s ease-out forwards',
        'fade-in': 'fade-in 0.5s ease-out forwards',
        'spin-slow': 'spin 12s linear infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        'pulse-glow': {
          '0%, 100%': { opacity: '1', boxShadow: '0 0 20px rgba(139, 92, 246, 0.4)' },
          '50%': { opacity: '0.5', boxShadow: '0 0 10px rgba(139, 92, 246, 0.2)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        'slide-up': {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        }
      }
    },
  },
  plugins: [],
}

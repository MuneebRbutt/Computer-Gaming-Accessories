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
        // Gaming theme tokens used throughout the app (admin + storefront)
        // These enable utility classes like bg-gaming-dark, text-gaming-muted,
        // bg-gaming-primary/20, border-gaming-accent/20, etc.
        gaming: {
          primary: '#8B0000',      // text-gaming-primary / bg-gaming-primary
          accent: '#DC143C',       // text-gaming-accent / border-gaming-accent
          dark: '#0b0b0d',         // bg-gaming-dark
          darker: '#18181b',       // bg-gaming-darker
          muted: '#b6b6c2',        // text-gaming-muted
        },
        // Dark Red Gaming Palette
        primary: {
          DEFAULT: '#8B0000', // Dark Red
          50: '#ffe5e5',
          100: '#ffcccc',
          200: '#ff9999',
          300: '#ff6666',
          400: '#ff3333',
          500: '#CC0000',
          600: '#B30000',
          700: '#990000',
          800: '#800000',
          900: '#660000'
        },
        secondary: {
          DEFAULT: '#A52A2A', // Brown Red
          50: '#fff5f0',
          100: '#ffe0d5',
          200: '#ffbaa0',
          300: '#ff9370',
          400: '#ff6b45',
          500: '#A52A2A',
          600: '#8B2323',
          700: '#721c1c',
          800: '#5a1616',
          900: '#431111'
        },
        accent: {
          DEFAULT: '#DC143C', // Crimson
        },
        success: '#10B981',
        warning: '#F59E0B',
        error: '#EF4444',

        // Background Colors
        'bg-dark': '#0b0b0d',
        'bg-mid': '#18181b',
        'bg-light': '#0b0b0d',

        // Text Colors
        'text-light': '#F8F8FA',
        'text-muted': '#b6b6c2',
        'text-dark': '#0b0b0d',

        // Legacy support
        brand: {
          DEFAULT: '#8B0000',
          dark: '#660000'
        },
        surface: '#0f1112',
        card: '#17171a'
      },
      fontFamily: {
        // Optimized typography: Orbitron for headings, Poppins for body
        display: ['Orbitron', 'system-ui', 'sans-serif'],
        heading: ['Orbitron', 'system-ui', 'sans-serif'],
        body: ['Poppins', 'system-ui', 'sans-serif'],
        sans: ['Poppins', 'system-ui', 'sans-serif'],
        mono: ['ui-monospace', 'SF Mono', 'Monaco', 'Inconsolata', 'Fira Code', 'monospace']
      },
      fontSize: {
        'hero': 'clamp(2.25rem, 5vw, 6rem)',
        'display': 'clamp(2rem, 4vw, 3.5rem)',
        'h1': 'clamp(1.75rem, 3vw, 2.625rem)',
        'h2': 'clamp(1.5rem, 2.5vw, 2rem)',
        'h3': '1.5rem',
        'h4': '1.25rem',
        'h5': '1.125rem'
      },
      boxShadow: {
        'sm': '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
        'DEFAULT': '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
        'md': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        'lg': '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
        'xl': '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
        'card': '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)'
      },
      backdropBlur: {
        'xs': '2px',
      },
      keyframes: {
        // Simple, clean animations
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' }
        },
        'slide-up': {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' }
        },
        'slide-down': {
          '0%': { transform: 'translateY(-10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' }
        },
        'scale-in': {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' }
        }
      },
      animation: {
        'fade-in': 'fade-in 0.3s ease-out',
        'slide-up': 'slide-up 0.4s ease-out',
        'slide-down': 'slide-down 0.4s ease-out',
        'scale-in': 'scale-in 0.3s ease-out'
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))'
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '128': '32rem'
      }
    },
  },
  plugins: [],
}

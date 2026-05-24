/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        black: '#000000',
        white: '#ffffff',
        background: 'var(--bg)',
        foreground: 'var(--fg)',
        muted: 'var(--muted)',
        subtle: 'var(--subtle)',
        surface: 'var(--surface)',
        elevated: 'var(--elevated)',
        border: 'var(--border-color)',
        'border-strong': 'var(--border-strong)',
        overlay: 'var(--overlay)',
        gray: {
          50: '#fafafa',
          100: '#f5f5f5',
          200: '#e5e5e5',
          300: '#d4d4d4',
          400: '#a3a3a3',
          500: '#737373',
          600: '#525252',
          700: '#404040',
          800: '#262626',
          900: '#171717',
          950: '#0a0a0a',
        },
      },
      fontFamily: {
        sans: ['Outfit', 'Inter', 'sans-serif'],
        mono: ['Space Mono', 'monospace'],
      },
      boxShadow: {
        'glass-glow': 'var(--shadow-glass)',
        'glass-inner': 'var(--shadow-inner)',
        'elevated': 'var(--shadow-elevated)',
      },
      backdropBlur: {
        xs: '2px',
      },
      animation: {
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        float: 'float 8s ease-in-out infinite',
        'float-delayed': 'float-delayed 10s ease-in-out infinite',
        'spin-slow': 'spin 12s linear infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px) scale(1)' },
          '50%': { transform: 'translateY(-20px) scale(1.05)' },
        },
        'float-delayed': {
          '0%, 100%': { transform: 'translateY(0px) scale(1.05) rotate(0deg)' },
          '50%': { transform: 'translateY(25px) scale(0.95) rotate(5deg)' },
        },
      },
    },
  },
  plugins: [],
};

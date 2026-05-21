/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // STRICT PALETTE: Black, White, Dark Blue shades
        black: "#000000",
        white: "#ffffff",
        navy: {
          950: "#020617", // Extreme dark slate blue
          900: "#0b1329", // Deep space navy
          800: "#1c2541", // Rich charcoal navy
          700: "#001f54", // Glowing navy
          600: "#003566", // High-contrast dark blue
          500: "#00509d", // Bright dark blue accent
          400: "#2563eb", // Electric blue highlight
          300: "#3b82f6", // Vibrant glow blue
        }
      },
      fontFamily: {
        sans: ["Outfit", "Inter", "sans-serif"],
        mono: ["Space Mono", "monospace"],
      },
      boxShadow: {
        'glass-glow': '0 0 25px -5px rgba(37, 99, 235, 0.15), 0 0 15px -5px rgba(59, 130, 246, 0.1)',
        'glass-inner': 'inset 0 1px 1px 0 rgba(255, 255, 255, 0.05)',
        'blue-glow': '0 0 30px 2px rgba(37, 99, 235, 0.25)',
        'sandglass-glow': '0 0 40px 10px rgba(59, 130, 246, 0.15)',
      },
      backdropBlur: {
        xs: '2px',
      },
      animation: {
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 8s ease-in-out infinite',
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
        }
      }
    },
  },
  plugins: [],
}

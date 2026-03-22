/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          50: "#f0f4ff",
          100: "#dbe4fe",
          200: "#bfcffc",
          300: "#93aff9",
          400: "#6085f4",
          500: "#1a56db",
          600: "#1646b8",
          700: "#153a8a",
          800: "#142e6b",
          900: "#0f2150",
        },
        accent: {
          400: "#dbbf6a",
          500: "#c8a951",
          600: "#b8963e",
          700: "#9a7b2f",
        },
        sand: {
          50: "#fdfaf3",
          100: "#faf3e0",
          200: "#f5e6c0",
          300: "#ebd4a0",
        },
        terracotta: {
          500: "#c4603c",
          600: "#a84e30",
        },
      },
      fontFamily: {
        sans: ["Inter", "Arial", "sans-serif"],
      },
      backgroundImage: {
        'kk-pattern': "url(\"data:image/svg+xml,%3Csvg width='80' height='80' viewBox='0 0 80 80' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' stroke='%23c8a951' stroke-width='0.5' opacity='0.15'%3E%3Cpath d='M40 10 L50 20 L40 30 L30 20Z'/%3E%3Cpath d='M40 50 L50 60 L40 70 L30 60Z'/%3E%3Cpath d='M10 30 L20 40 L10 50 L0 40Z'/%3E%3Cpath d='M70 30 L80 40 L70 50 L60 40Z'/%3E%3Ccircle cx='40' cy='40' r='4'/%3E%3Cpath d='M36 36 L44 36 L44 44 L36 44Z' transform='rotate(45 40 40)'/%3E%3C/g%3E%3C/svg%3E\")",
        'kk-border': "url(\"data:image/svg+xml,%3Csvg width='40' height='12' viewBox='0 0 40 12' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 6 L5 1 L10 6 L15 1 L20 6 L25 1 L30 6 L35 1 L40 6' fill='none' stroke='%23c8a951' stroke-width='1.5'/%3E%3Cpath d='M0 6 L5 11 L10 6 L15 11 L20 6 L25 11 L30 6 L35 11 L40 6' fill='none' stroke='%23c8a951' stroke-width='1.5'/%3E%3C/svg%3E\")",
      },
      animation: {
        'fade-in-up': 'fadeInUp 0.6s ease-out forwards',
        'slide-in': 'slideIn 0.5s ease-out forwards',
        'float': 'float 3s ease-in-out infinite',
        'spin-slow': 'spin 20s linear infinite',
        'pulse-soft': 'pulseSoft 3s ease-in-out infinite',
        'shimmer': 'shimmer 2s linear infinite',
      },
      keyframes: {
        fadeInUp: {
          from: { opacity: '0', transform: 'translateY(30px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        slideIn: {
          from: { opacity: '0', transform: 'translateX(-30px)' },
          to: { opacity: '1', transform: 'translateX(0)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        pulseSoft: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.7' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
    },
  },
  plugins: [],
};

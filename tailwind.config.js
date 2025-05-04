/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html"
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          200: '#bae6fd',
          300: '#7dd3fc',
          400: '#38bdf8',
          500: '#0ea5e9',
          600: '#0284c7',
          700: '#0369a1',
          800: '#075985',
          900: '#0c4a6e',
        },
        danger: {
          light: '#fecaca',
          DEFAULT: '#dc2626',
          dark: '#991b1b',
        },
        warning: {
          light: '#fef08a',
          DEFAULT: '#ca8a04',
          dark: '#854d0e',
        },
        success: {
          light: '#bbf7d0',
          DEFAULT: '#16a34a',
          dark: '#166534',
        },
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
} 
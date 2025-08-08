import type { Config } from 'tailwindcss'

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#f3f7ff',
          100: '#e5eeff',
          200: '#c8dcff',
          300: '#9dbfff',
          400: '#6a97ff',
          500: '#3b6dff',
          600: '#2048f2',
          700: '#1837c0',
          800: '#142f9b',
          900: '#122a80',
        },
      },
    },
  },
  plugins: [],
} satisfies Config



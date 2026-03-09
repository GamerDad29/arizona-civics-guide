/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        sand:   { DEFAULT: '#faf7f2', 100: '#fdf9f5', 200: '#f0ebe0' },
        navy:   { DEFAULT: '#1e3a5f', light: '#2d5282', dark: '#152a44' },
        copper: { DEFAULT: '#b5651d', light: '#d4793a', dark: '#8b4a10' },
        turq:   { DEFAULT: '#2a7d8c', light: '#3c9aab', dark: '#1e5f6b' },
        dem:    '#2563eb',
        rep:    '#dc2626',
        ind:    '#7c3aed',
      },
      fontFamily: {
        display: ['Fraunces', 'Georgia', 'serif'],
        sans: ['"Plus Jakarta Sans"', 'system-ui', 'sans-serif'],
      },
      fontSize: { '2xs': '0.65rem' },
      boxShadow: {
        card: '0 1px 3px rgba(0,0,0,0.07), 0 4px 16px rgba(0,0,0,0.05)',
        'card-hover': '0 4px 12px rgba(0,0,0,0.1), 0 12px 32px rgba(0,0,0,0.08)',
      },
    },
  },
  plugins: [],
}

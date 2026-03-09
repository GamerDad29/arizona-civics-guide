/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        base:    '#080c14',
        surface: '#0d1220',
        card:    '#131928',
        raised:  '#1a2236',
        border:  '#1f2d45',
        border2: '#2a3d5a',
        text1:   '#e4eaf6',
        text2:   '#8896b0',
        text3:   '#4a5a72',
        copper:  { DEFAULT: '#c97b30', light: '#e8a055', dark: '#9a5a1a' },
        turq:    { DEFAULT: '#1cb0be', light: '#3eccd8', dark: '#0f8a96' },
        dem:     '#4f7ef5',
        rep:     '#f05353',
        ind:     '#9b6fe8',
        success: '#2fd770',
        danger:  '#f05353',
        warn:    '#f0a030',
      },
      fontFamily: {
        display: ['Fraunces', 'Georgia', 'serif'],
        sans:    ['"Plus Jakarta Sans"', 'system-ui', 'sans-serif'],
      },
      fontSize:  { '2xs': '0.6rem' },
      boxShadow: {
        card:     '0 2px 8px rgba(0,0,0,0.4)',
        'card-lg':'0 4px 24px rgba(0,0,0,0.6)',
        copper:   '0 0 16px rgba(201,123,48,0.25)',
        glow:     '0 0 30px rgba(28,176,190,0.2)',
      },
      animation: {
        'fade-up':  'fadeUp 0.3s ease-out both',
        'pulse-dot':'pulseDot 2s ease-in-out infinite',
      },
      keyframes: {
        fadeUp:   { from: { opacity: '0', transform: 'translateY(10px)' }, to: { opacity: '1', transform: 'translateY(0)' } },
        pulseDot: { '0%,100%': { opacity: '1' }, '50%': { opacity: '0.4' } },
      },
    },
  },
  plugins: [],
};

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        copper:     { DEFAULT: '#B87333', dark: '#8B5A2B', glow: '#D4956B', muted: '#B8733320' },
        sunset:     { DEFAULT: '#E25822', muted: '#E2582220' },
        'desert-sand': { DEFAULT: '#F4E4C1' },
        saguaro:    { DEFAULT: '#2D5A3D', light: '#3D7A53', dark: '#1D3A27', muted: '#2D5A3D20' },
        'sky-az':   { DEFAULT: '#87CEEB', dark: '#4A90B0', muted: '#87CEEB20' },
        midnight:   { DEFAULT: '#0F1923' },
        slate:      { DEFAULT: '#1A2332', light: '#243040', border: '#2A3545' },
        'snow-peak':{ DEFAULT: '#F0F4F8', muted: '#F0F4F880' },
        dem:        '#2E5EA8',
        rep:        '#B83A3A',
        ind:        '#7B6B9E',
      },
      fontFamily: {
        display: ['"Playfair Display"', 'Georgia', 'serif'],
        body:    ['"Source Sans 3"', 'system-ui', 'sans-serif'],
        ui:      ['"Barlow Condensed"', 'system-ui', 'sans-serif'],
        mono:    ['"JetBrains Mono"', 'monospace'],
      },
      fontSize: {
        '2xs': ['0.65rem', '0.9rem'],
        'hero': ['clamp(2.5rem, 5vw + 1rem, 4.5rem)', '1.1'],
      },
      boxShadow: {
        'glass':      '0 4px 30px rgba(0,0,0,0.1)',
        'glass-lg':   '0 8px 32px rgba(0,0,0,0.2)',
        'glow-copper':'0 0 20px rgba(184,115,51,0.3)',
        'tile':       '0 2px 8px rgba(0,0,0,0.15)',
        'tile-lg':    '0 8px 32px rgba(0,0,0,0.25)',
      },
      borderRadius: {
        'tile': '0.75rem',
      },
      gridAutoRows: {
        'fr': '1fr',
      },
      animation: {
        'fade-up':      'fadeUp 0.4s ease-out both',
        'slide-up':     'slideUp 0.3s ease-out both',
        'count':        'countPulse 2s ease-in-out infinite',
        'sunset-shift': 'sunsetShift 20s ease infinite',
      },
      keyframes: {
        fadeUp:      { from: { opacity: '0', transform: 'translateY(16px)' }, to: { opacity: '1', transform: 'translateY(0)' } },
        slideUp:     { from: { opacity: '0', transform: 'translateY(24px)' }, to: { opacity: '1', transform: 'translateY(0)' } },
        countPulse:  { '0%,100%': { opacity: '1' }, '50%': { opacity: '0.7' } },
        sunsetShift: {
          '0%':   { backgroundPosition: '0% 50%' },
          '50%':  { backgroundPosition: '100% 50%' },
          '100%': { backgroundPosition: '0% 50%' },
        },
      },
      gridTemplateColumns: {
        'bento': 'repeat(4, 1fr)',
        'bento-md': 'repeat(2, 1fr)',
      },
    },
  },
  plugins: [],
};

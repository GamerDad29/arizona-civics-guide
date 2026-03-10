/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        burgundy: { DEFAULT: '#7B1D3A', light: '#9B3355', dark: '#5C1129', muted: '#7B1D3A20' },
        sage:     { DEFAULT: '#5C7A5E', light: '#7A9A7C', dark: '#3E5A40', muted: '#5C7A5E20' },
        sand:     { DEFAULT: '#EDE8D8', dark: '#D5D0C2', darker: '#C4BFAE', light: '#F5F2E8' },
        terracotta:{ DEFAULT: '#C4623A', light: '#D8845E', dark: '#A04E2E', muted: '#C4623A20' },
        sky:      { DEFAULT: '#A8C4C8', light: '#C4DDE0', dark: '#7FA6AB', muted: '#A8C4C820' },
        ink:      { DEFAULT: '#1C1A18', light: '#3A3835', muted: '#1C1A1880' },
        cream:    '#FAF8F2',
        dem:      '#2E5EA8',
        rep:      '#B83A3A',
        ind:      '#7B6B9E',
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
        'tile':    '0 2px 8px rgba(28,26,24,0.08)',
        'tile-lg': '0 8px 32px rgba(28,26,24,0.12)',
        'paper':   '0 1px 3px rgba(28,26,24,0.06), 0 4px 16px rgba(28,26,24,0.04)',
      },
      borderRadius: {
        'tile': '0.625rem',
      },
      animation: {
        'fade-up':   'fadeUp 0.4s ease-out both',
        'slide-up':  'slideUp 0.3s ease-out both',
        'count':     'countPulse 2s ease-in-out infinite',
      },
      keyframes: {
        fadeUp:     { from: { opacity: '0', transform: 'translateY(16px)' }, to: { opacity: '1', transform: 'translateY(0)' } },
        slideUp:    { from: { opacity: '0', transform: 'translateY(24px)' }, to: { opacity: '1', transform: 'translateY(0)' } },
        countPulse: { '0%,100%': { opacity: '1' }, '50%': { opacity: '0.7' } },
      },
      gridTemplateColumns: {
        'bento': 'repeat(4, 1fr)',
        'bento-md': 'repeat(2, 1fr)',
      },
    },
  },
  plugins: [],
};

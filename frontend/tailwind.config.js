/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        bg: {
          primary: '#070B11',
          secondary: '#0D1219',
          card: '#131920',
          elevated: '#1A2030',
        },
        border: {
          DEFAULT: '#1E2A3A',
          subtle: '#141D29',
        },
        accent: {
          DEFAULT: '#38BDF8',
          hover: '#7DD3FC',
          dim: '#0EA5E9',
        },
        muted: '#64748B',
        brand: {
          todo: '#3B82F6',
          progress: '#F59E0B',
          done: '#34D399',
          low: '#64748B',
          medium: '#F59E0B',
          high: '#F87171',
        },
      },
      fontFamily: {
        syne: ['Syne', 'sans-serif'],
        dm: ['DM Sans', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease forwards',
        'slide-up': 'slideUp 0.3s ease forwards',
      },
      keyframes: {
        fadeIn: { from: { opacity: '0' }, to: { opacity: '1' } },
        slideUp: { from: { opacity: '0', transform: 'translateY(10px)' }, to: { opacity: '1', transform: 'translateY(0)' } },
      },
    },
  },
  plugins: [],
}

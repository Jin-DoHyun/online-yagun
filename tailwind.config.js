/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Noto Sans KR', 'sans-serif'],
        mono: ['Share Tech Mono', 'monospace'],
        dot: ['DotGothic16', 'monospace'],
      },
      colors: {
        bg: '#0a0a0f',
        surface: '#111118',
        surface2: '#1a1a24',
        border: '#2a2a3a',
        accent: '#4fc3f7',
        accent2: '#ffd54f',
        'text-muted': '#7070a0',
        'text-dim': '#404060',
        green: '#69f0ae',
        red: '#ff5252',
      },
      animation: {
        'pulse-slow': 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float-up': 'floatUp 1.5s ease-out forwards',
        'blink': 'blink 1s step-end infinite',
        'scanline': 'scanline 8s linear infinite',
        'flicker': 'flicker 6s ease-in-out infinite',
      },
      keyframes: {
        floatUp: {
          '0%': { opacity: '1', transform: 'translateY(0) scale(1)' },
          '100%': { opacity: '0', transform: 'translateY(-80px) scale(1.5)' },
        },
        blink: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0' },
        },
        scanline: {
          '0%': { top: '-2px' },
          '100%': { top: '100vh' },
        },
        flicker: {
          '0%, 100%': { opacity: '1' },
          '92%': { opacity: '1' },
          '93%': { opacity: '0.3' },
          '94%': { opacity: '1' },
          '96%': { opacity: '0.5' },
          '97%': { opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}

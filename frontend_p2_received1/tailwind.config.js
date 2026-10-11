/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        paper: '#F4F2ED',
        surface: '#FFFFFF',
        sunken: '#ECE9E2',
        line: '#E4E0D7',
        'line-strong': '#CFCABD',
        ink: '#14130F',
        'ink-2': '#4A473F',
        'ink-3': '#6B675E',
        cobalt: '#14130F',
        'cobalt-press': '#26241E',
        'cobalt-tint': '#ECE9E2',
        marker: '#FFE27A',
        verified: {
          DEFAULT: '#14794A',
          wash: '#E2F3E9',
        },
        unverified: {
          DEFAULT: '#94590A',
          wash: '#FBEFD6',
        },
        blocked: {
          DEFAULT: '#B03020',
          wash: '#FBE5E0',
        },
        stage: {
          DEFAULT: '#0D0D0B',
          raised: '#171714',
          line: '#2A2A25',
          ink: '#F1EFE9',
          'ink-2': '#A19D92',
        },
      },
      fontFamily: {
        display: ['"Instrument Serif"', 'Georgia', 'serif'],
        ui: ['"Geist"', '"Inter"', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
        mono: ['"Geist Mono"', '"JetBrains Mono"', 'monospace'],
      },
      borderRadius: {
        ctl: '8px',
        card: '16px',
        sheet: '28px',
      },
      boxShadow: {
        float: '0 1px 2px rgba(20,19,15,.06), 0 16px 40px -12px rgba(20,19,15,.22)',
      },
    },
  },
  plugins: [],
}

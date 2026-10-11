/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50:  "#f0f4ff",
          100: "#e0eaff",
          200: "#c7d7fe",
          300: "#a5b8fc",
          400: "#8191f8",
          500: "#6366f1",   // primary indigo
          600: "#4f46e5",
          700: "#4338ca",
          800: "#3730a3",
          900: "#312e81",
          950: "#1e1b4b",
        },
        accent: {
          400: "#a78bfa",
          500: "#8b5cf6",
        },
        surface: {
          DEFAULT: "#FFFFFF",
          900: "#0f0f23",
          800: "#1a1a3e",
          700: "#252550",
          600: "#2e2e66",
        },
        // P2 Colophon Editorial Palette
        paper: '#F4F2ED',
        sunken: '#ECE9E2',
        line: '#E4E0D7',
        'line-strong': '#CFCABD',
        ink: '#14130F',
        'ink-2': '#4A473F',
        'ink-3': '#6B675E',
        cobalt: '#1447FF',
        'cobalt-press': '#0F36CC',
        'cobalt-tint': '#E6ECFF',
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
        sans: ["Inter", "system-ui", "sans-serif"],
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
        '2xs': '0 1px 2px rgba(20,19,15,.04)',
        xs: '0 1px 2px rgba(20,19,15,.06)',
      },
    },
  },
  plugins: [],
}

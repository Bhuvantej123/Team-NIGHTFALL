/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{ts,tsx}",
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
          400: "#a78bfa",   // violet highlight
          500: "#8b5cf6",
        },
        surface: {
          900: "#0f0f23",   // page background
          800: "#1a1a3e",   // card background
          700: "#252550",   // elevated card
          600: "#2e2e66",   // border / divider
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      },
      backgroundImage: {
        "gradient-hero": "linear-gradient(135deg, #0f0f23 0%, #1a1a3e 50%, #252550 100%)",
        "gradient-brand": "linear-gradient(135deg, #4338ca 0%, #7c3aed 100%)",
        "gradient-card":  "linear-gradient(135deg, #1a1a3e 0%, #252550 100%)",
      },
      animation: {
        "fade-in":    "fadeIn 0.4s ease-out",
        "slide-up":   "slideUp 0.4s ease-out",
        "pulse-slow": "pulse 3s cubic-bezier(0.4,0,0.6,1) infinite",
      },
      keyframes: {
        fadeIn:  { "0%": { opacity: "0" }, "100%": { opacity: "1" } },
        slideUp: { "0%": { opacity: "0", transform: "translateY(16px)" }, "100%": { opacity: "1", transform: "translateY(0)" } },
      },
    },
  },
  plugins: [],
}


/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        bg: "#0f0f0f",
        text: "#f5f5f5",
        muted: "#b9b9b9",
      },
      boxShadow: { glow: "0 0 0 1px rgba(255,255,255,0.08), 0 10px 30px rgba(0,0,0,0.45)" },
      backdropBlur: { xs: "2px" },
      borderRadius: { "2xl": "1rem" },
    },
  },
  plugins: [],
};

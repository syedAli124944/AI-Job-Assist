/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        sand: "#EDE6DA",
        cream: "#FAF6F0",
        charcoal: "#2B241E",
        "warm-gray": "#8A7F72",
        terracotta: "#B5654A",
        "terracotta-dark": "#954F39",
        "deep-green": "#3C5B42",
        border: "#E0D5C5",
      },
      fontFamily: {
        fraunces: ["Fraunces", "serif"],
        inter: ["Inter", "sans-serif"],
      },
      borderRadius: {
        card: "20px",
        btn: "12px",
      },
      boxShadow: {
        card: "0 4px 24px 0 rgba(43,36,30,0.07)",
        "card-hover": "0 8px 32px 0 rgba(43,36,30,0.12)",
      },
    },
  },
  plugins: [],
};

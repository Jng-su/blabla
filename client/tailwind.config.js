/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        background: "#111827",
        sub_background: "#1F2937",
        primary: "#7F63FF",
        primaryHover: "#B0A2FF",
        secondary: "#D1C6FF",
      },
    },
  },
  plugins: [],
};

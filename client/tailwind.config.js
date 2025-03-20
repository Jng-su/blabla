/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        base: "#FFFFFF",
        sub: "#F7FAFC",
        primary: "#7F63FF",
        primaryHover: "#937DFF",
      },
    },
  },
  plugins: [],
};

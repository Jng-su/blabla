/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#7551FF",
        primaryHover: "#8A6BFF",
      },
    },
  },
  plugins: [],
};

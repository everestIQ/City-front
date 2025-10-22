/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#0A2540", // Dark navy
        accent: "#1D72B8",  // Classic blue
      },
    },
  },
  plugins: [],
}

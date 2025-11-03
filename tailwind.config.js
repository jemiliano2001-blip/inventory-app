/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./**/*.html",
  ],
  corePlugins: {
    preflight: false, // Disable Tailwind's base reset to preserve custom styles
  },
  theme: {
    extend: {},
  },
  plugins: [],
}


/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'someblack': '#000000',
        'primary': '#0B0B0B',
        'sidebar': '#121212',
        'header': '#1A1A1A',
        'card': '#1C1C1C',
        'gold': '#C5A23E',
        'goldHover': '#FFEA70',
        'textPrimary': '#FFFFFF',
        'textSecondary': '#B8B8B8',
        'border': '#333333',
        'success': '#00FF99',
        'error': '#FF4D4D',
        'info': '#40C4FF',
      },
    },
  },
  plugins: [],
}

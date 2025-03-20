/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      backgroundImage:{
        'dot': "url('https://www.toptal.com/designers/subtlepatterns/uploads/dot-grid.png')"
      }
    },
  },
  plugins: [],
}


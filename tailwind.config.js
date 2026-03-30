/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'dark': '#0D0D0D',
        'light': '#C8BAA0',
        'red': '#FF5631',
        'gray': '#1E1E1E',
        'green': '#35BC74',
      },
      fontFamily:{
        'Poppins':'Poppins',
        'PoppinsBold':'Poppins-Bold',
      }
    },
  },
  plugins: [],
}


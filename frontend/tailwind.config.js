/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'primary-bg': '#E2E4E8', // Darker than #EDEFF2
        'secondary-bg': '#AAB6C1', // Darker than #B8C4CF
        'primary-text': '#1E1E1E',
        'secondary-text': '#4B5563', // Darker than #6B7280
        'primary-accent': '#9FBFCF',
        'secondary-accent': '#CFE8EF',
        'dark-contrast': '#2B2F33',
      },
    },
  },
  plugins: [],
}


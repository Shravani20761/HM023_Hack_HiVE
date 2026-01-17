/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'brand-primary': '#4F46E5', // Indigo-600
        'brand-secondary': '#A855F7', // Purple-500
        'brand-dark': '#312E81', // Indigo-900
        'brand-light': '#E0E7FF', // Indigo-100

        'status-active': '#10B981', // Emerald-500
        'status-active-bg': '#D1FAE5', // Emerald-100
        'status-paused': '#F59E0B', // Amber-500
        'status-paused-bg': '#FEF3C7', // Amber-100
        'status-completed': '#6B7280', // Gray-500
        'status-completed-bg': '#F3F4F6', // Gray-100

        'primary-bg': '#F3F4F6', // Light Grey (Cooler)
        'secondary-bg': '#FFFFFF', // White
        'primary-text': '#111827', // Gray-900
        'secondary-text': '#6B7280', // Gray-500
        'dark-contrast': '#1E1B4B', // Very Dark Indigo
      },
    },
  },
  plugins: [],
}


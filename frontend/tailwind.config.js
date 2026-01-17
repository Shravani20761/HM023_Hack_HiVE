/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'primary-bg': '#F8FDFA', // Very light teal tint for main background
        'secondary-bg': '#FFFFFF', // White for cards/sections
        'primary-text': '#13272A', // Dark teal for main text
        'secondary-text': '#2E7D78', // Medium teal for secondary text
        'primary-accent': '#3FB3A9', // Bright teal for buttons/links
        'secondary-accent': '#2E7D78', // Darker teal for hovers
        'dark-contrast': '#13272A', // Deep background
        // Keep existing specific login tokens for backward compatibility if needed, 
        // though now mapped to the main theme.
        'login-bg-start': '#13272A',
        'login-bg-middle': '#2E7D78',
        'login-bg-end': '#3FB3A9',
        'login-card': '#FFFFFF',
        'login-input-bg': '#E6F6F4',
        'login-btn-primary': '#3FB3A9',
        'login-btn-hover': '#2E7D78',
        'login-text-primary': '#13272A',
        'login-text-secondary': '#5D7C7A',
        'login-focus': '#3FB3A9',
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      animation: {
        blob: "blob 7s infinite",
      },
      keyframes: {
        blob: {
          "0%": {
            transform: "translate(0px, 0px) scale(1)",
          },
          "33%": {
            transform: "translate(30px, -50px) scale(1.1)",
          },
          "66%": {
            transform: "translate(-20px, 20px) scale(0.9)",
          },
          "100%": {
            transform: "translate(0px, 0px) scale(1)",
          },
        },
      },
    },
  },
  plugins: [],
}

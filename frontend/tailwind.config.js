/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Original Colors
        'primary-bg': '#F8FDFA',
        'secondary-bg': '#FFFFFF',
        'primary-text': '#13272A',
        'secondary-text': '#2E7D78',
        'primary-accent': '#3FB3A9',
        'secondary-accent': '#2E7D78',
        'dark-contrast': '#13272A',

        // Login Colors
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

        // New Vibrant Colors
        'neon-pink': '#FF0080',
        'neon-purple': '#7928CA',
        'neon-blue': '#0070F3',
        'status-draft': '#94A3B8',
        'status-review': '#F59E0B',
        'status-approved': '#10B981',
        'status-published': '#3B82F6',
        'ai-purple': '#A855F7',
      },
      backgroundImage: {
        'gradient-vibrant': 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        'gradient-sunset': 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
        'gradient-ai': 'linear-gradient(135deg, #a855f7 0%, #ec4899 100%)',
        'gradient-status-draft': 'linear-gradient(135deg, #cbd5e1 0%, #94a3b8 100%)',
        'gradient-status-review': 'linear-gradient(135deg, #fcd34d 0%, #f59e0b 100%)',
        'gradient-status-approved': 'linear-gradient(135deg, #86efac 0%, #10b981 100%)',
        'gradient-status-published': 'linear-gradient(135deg, #93c5fd 0%, #3b82f6 100%)',
      },
      boxShadow: {
        'neon': '0 0 20px rgba(139, 92, 246, 0.5)',
        'glow': '0 4px 20px rgba(0, 0, 0, 0.1), 0 0 40px rgba(139, 92, 246, 0.2)',
        'glow-pink': '0 0 20px rgba(255, 0, 128, 0.3)',
        'glow-blue': '0 0 20px rgba(0, 112, 243, 0.3)',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'shimmer': 'shimmer 2s linear infinite',
        'float': 'float 3s ease-in-out infinite',
      },
      keyframes: {
        shimmer: {
          '0%': { backgroundPosition: '-1000px 0' },
          '100%': { backgroundPosition: '1000px 0' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
      },
    },
  },
  plugins: [],
}

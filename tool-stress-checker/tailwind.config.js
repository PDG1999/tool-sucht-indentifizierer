/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        samebi: {
          primary: '#2563eb',
          secondary: '#64748b',
          success: '#16a34a',
          warning: '#d97706',
          error: '#dc2626',
          light: '#f8fafc',
          dark: '#0f172a'
        },
        stress: {
          low: '#16a34a',      // Grün - Niedriger Stress
          moderate: '#eab308',  // Gelb - Moderater Stress  
          high: '#f97316',      // Orange - Hoher Stress
          critical: '#dc2626'   // Rot - Kritischer Stress
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace']
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'bounce-gentle': 'bounceGentle 2s infinite'
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' }
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' }
        },
        bounceGentle: {
          '0%, 100%': { transform: 'translateY(-5%)' },
          '50%': { transform: 'translateY(0)' }
        }
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem'
      },
      maxWidth: {
        '8xl': '88rem'
      }
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
    require('@tailwindcss/aspect-ratio')
  ],
}

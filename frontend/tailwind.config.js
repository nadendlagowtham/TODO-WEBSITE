/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          primary: '#3525cd',
          indigo: '#4f46e5',
          bg: '#fcf8ff',
          canvas: '#f9fafb',
          card: '#ffffff',
          border: '#e5e7eb',
          text: '#1b1b24',
          muted: '#464555',
          success: '#10b981',
          warning: '#f59e0b',
          error: '#ef4444',
          'success-text': '#047857',
          'warning-text': '#b45309',
          'error-text': '#b91c1c',
          'success-bg': '#ecfdf5',
          'warning-bg': '#fffbeb',
          'error-bg': '#fef2f2',
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        geist: ['Geist', 'sans-serif'],
      },
      borderRadius: {
        sm: '0.25rem',
        DEFAULT: '0.5rem',
        md: '0.75rem',
        lg: '1.0rem',
        xl: '1.5rem',
      },
      boxShadow: {
        'soft-sm': '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
        'soft-md': '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -2px rgba(0, 0, 0, 0.05)',
        'soft-lg': '0 10px 15px -3px rgba(0, 0, 0, 0.05), 0 4px 6px -4px rgba(0, 0, 0, 0.05)',
        'soft-xl': '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
      }
    },
  },
  plugins: [],
}

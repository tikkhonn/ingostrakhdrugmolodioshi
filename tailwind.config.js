/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        ingos: {
          page: 'var(--page-bg)',
          'text-primary': 'var(--text-primary)',
          'text-secondary': 'var(--text-secondary)',
          card: 'var(--card-bg)',
          border: 'var(--card-border)',
          accent: 'var(--accent-muted)',
          header: 'var(--header-bg)',
          secondary: '#E0E0E0',
          blue: '#0066CC',
          'blue-bright': '#00A3FF',
          'blue-dark': '#003366',
        },
      },
      borderRadius: {
        card: '12px',
        btn: '8px',
      },
      transitionDuration: {
        theme: '300ms',
      },
      transitionTimingFunction: {
        theme: 'cubic-bezier(0.4, 0, 0.2, 1)',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};

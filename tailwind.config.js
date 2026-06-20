/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"],
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        canvas: '#000000',
        ink: '#ffffff',
        body: '#cccccc',
        'body-strong': '#e6e6e6',
        muted: '#999999',
        'muted-soft': '#666666',
        hairline: '#262626',
        'hairline-strong': '#3a3a3a',
        'surface-soft': '#0d0d0d',
        'surface-card': '#141414',
        'surface-elevated': '#1f1f1f',
        link: '#c3d9f3',
        brand: '#7c3aed',
      },
      fontFamily: {
        display: ['Saira Condensed', 'sans-serif'],
        body: ['Cormorant Garamond', 'Georgia', 'serif'],
        mono: ['JetBrains Mono', 'ui-monospace', 'monospace'],
        sans: ['ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      letterSpacing: {
        'display-xl': '4px',
        'display-lg': '3px',
        'display-md': '2px',
        'wordmark': '6px',
        'mono': '2px',
        'button': '2.5px',
      },
      spacing: {
        'xxs': '4px',
        'xs': '8px',
        'sm': '12px',
        'md': '16px',
        'lg': '24px',
        'xl': '40px',
        'xxl': '64px',
        'section': '120px',
      },
      borderRadius: {
        none: "0px",
        pill: '9999px',
      },
    },
  },
  plugins: [],
}

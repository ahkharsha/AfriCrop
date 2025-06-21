/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: 'var(--primary-green)',
          light: 'var(--primary-green-light)',
          dark: 'var(--primary-green-dark)',
        },
        secondary: {
          DEFAULT: 'var(--secondary-brown)',
          light: 'var(--secondary-brown-light)',
          dark: 'var(--secondary-brown-dark)',
        },
        sustainability: 'var(--sustainability-accent)',
        warning: 'var(--warning-accent)',
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
  ],
}
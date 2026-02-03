/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'zunft': {
          red: {
            light: '#C41E3A',
            DEFAULT: '#8B1538',
            dark: '#6B0F2A',
          },
          gold: {
            light: '#F4D03F',
            DEFAULT: '#D4AF37',
            dark: '#B8941F',
          },
          orange: {
            light: '#FFA64D',
            DEFAULT: '#FF8C00',
            dark: '#FF7700',
          },
          cream: '#F5E6D3',
          brown: '#8B6F47',
          burgundy: '#722F37',
          teal: {
            light: '#5BA3A3',
            DEFAULT: '#0D5C63',
            dark: '#074248',
          },
        },
      },
      fontFamily: {
        serif: ['Georgia', 'Times New Roman', 'serif'],
        display: ['Georgia', 'Times New Roman', 'serif'],
        futura: ['Helvetica', 'Arial', 'sans-serif'],
        sans: ['Helvetica', 'Arial', 'sans-serif'],
      },
    },
  },
  plugins: [],
}

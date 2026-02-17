/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{js,jsx,ts,tsx}',
    './public/index.html',
  ],
  safelist: [
    {
      pattern: /.*/,
    },
  ],
  theme: {
    extend: {
      colors: {
        'atomic-tangerine': '#ff6b35',
        'peach-glow': '#f7c59f',
        'beige': '#efefd0',
        'dusk-blue': '#004e89',
        'baltic-blue': '#1a659e',
      },
    },
  },
  plugins: [],
}


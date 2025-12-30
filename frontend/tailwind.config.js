/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        'pt-serif': ['var(--font-pt-serif)', 'PT Serif', 'serif'],
        'noto-sans-jp': ['var(--font-noto-sans-jp)', 'Noto Sans JP', 'sans-serif'],
        'inter': ['var(--font-inter)', 'Inter', 'sans-serif'],
        'jetbrains-mono': ['var(--font-jetbrains-mono)', 'JetBrains Mono', 'monospace'],
      },
      colors: {
        brand: {
          gold: '#FCD34D',
          orange: '#F97316',
        }
      }
    },
  },
  plugins: [],
  darkMode: 'class',
};


import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        accent: '#D85A30',
        'accent-dark': '#B84620',
        'accent-light': '#E87A50',
        ptp: {
          orange: '#E84F2E',
          'orange-dark': '#C73E1F',
          cream: '#FBF3DA',
          'cream-soft': '#FAF1D5',
          yellow: '#FFD93D',
          'yellow-dark': '#F5C518',
          ink: '#111111',
        },
      },
      fontFamily: {
        serif: ['Playfair Display', 'serif'],
        sans: ['DM Sans', 'sans-serif'],
        display: ['var(--font-display)', 'Bricolage Grotesque', 'system-ui', 'sans-serif'],
        body: ['var(--font-body)', 'Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
export default config

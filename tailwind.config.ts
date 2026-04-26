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
        // Pass The Plate brand palette (from the design handoff)
        cream: 'rgb(248, 243, 222)',
        orange: {
          DEFAULT: 'rgb(230, 78, 33)',
          deep: 'rgb(230, 80, 37)',
          dark: 'rgb(210, 65, 25)',
        },
        yellow: {
          DEFAULT: 'rgb(255, 239, 124)',
        },
        ink: '#000',
        'ink-muted': 'rgba(0, 0, 0, 0.55)',
        // Legacy tokens kept so existing pages don't break.
        accent: 'rgb(230, 78, 33)',
        'accent-dark': 'rgb(210, 65, 25)',
        'accent-light': '#E87A50',
        'playbook-yellow': 'rgb(255, 239, 124)',
      },
      fontFamily: {
        // Adobe Typekit kit cub1hgl is loaded in <head>.
        display: ['"please-display-vf"', '"Please Display VF"', 'Georgia', 'serif'],
        body: ['"proxima-nova"', '"Proxima Nova"', '"Helvetica Neue"', 'Helvetica', 'Arial', 'sans-serif'],
        serif: ['"please-display-vf"', '"Please Display VF"', 'Georgia', 'serif'],
        sans: ['"proxima-nova"', '"Proxima Nova"', '"Helvetica Neue"', 'Helvetica', 'Arial', 'sans-serif'],
      },
      borderRadius: {
        pill: '50px',
        card: '1.5rem',
        plate: '35px',
        bigband: '80px',
      },
      maxWidth: {
        stage: '1440px',
      },
    },
  },
  plugins: [],
}
export default config

import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          orange: '#E8542C',
          cream: '#F5EDDC',
          yellow: '#FCE16E',
          ink: '#0A0A0A',
          body: '#1F1F1F',
          muted: '#6B6B6B',
          border: '#E5DCC5',
        },
      },
      fontFamily: {
        // TODO(typekit): replace placeholder family names with the actual
        // family names exposed by kit `cub1hgl` once it loads in a browser
        // (Adobe blocks server-side fetches; the kit is host-locked).
        // Inspect `https://use.typekit.net/cub1hgl.css` in the deployed app's
        // Network tab and copy the @font-face `font-family` values here.
        display: ['ptp-display', 'serif'],
        sans: ['ptp-sans', 'system-ui', '-apple-system', 'sans-serif'],
      },
    },
  },
  plugins: [],
}

export default config

// client/tailwind.config.ts  [COPY EXACTLY]
import type { Config } from 'tailwindcss'
import { fontFamily } from 'tailwindcss/defaultTheme'

const config: Config = {
  darkMode: false,
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        emerald:      '#2F6F4F',
        sage:         '#8FAF97',
        mint:         '#C7D9CC',
        lavender:     '#B7A8CC',
        'calm-blue':  '#7FA7C6',
        cream:        '#F7F5F2',
        'grey-soft':  '#6D6D6D',
        'grey-deep':  '#3F4448',
      },
      fontFamily: {
        display: ['Playfair Display', ...fontFamily.serif],
        body:    ['DM Sans', ...fontFamily.sans],
        quote:   ['Cormorant Garamond', ...fontFamily.serif],
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
    require('@tailwindcss/forms'),
  ],
}
export default config
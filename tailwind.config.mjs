/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Aurora Protocol palette
        bg: {
          DEFAULT: '#0A0A12',
          card: '#14121F',
          elevated: '#1A1830',
        },
        border: {
          DEFAULT: 'rgba(139,92,246,0.15)',
          strong: 'rgba(139,92,246,0.35)',
        },
        text: {
          DEFAULT: '#FAFAFF',
          soft: '#AAA0C8',
          mute: '#7A7395',
        },
        aurora: {
          violet: '#8B5CF6',
          violet2: '#B285FF',
          cyan: '#4FC5FF',
          cyan2: '#7BE1FF',
          gold: '#FFB05C',
          green: '#34D399',
        },
      },
      fontFamily: {
        display: ['"Space Grotesk"', 'system-ui', 'sans-serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
      },
      borderRadius: {
        xl: '1rem',
        '2xl': '1.25rem',
      },
      backgroundImage: {
        'aurora-radial': 'radial-gradient(ellipse at 20% 15%, rgba(139,92,246,0.25), transparent 60%), radial-gradient(ellipse at 80% 25%, rgba(79,197,255,0.18), transparent 55%), radial-gradient(ellipse at 90% 60%, rgba(255,176,92,0.12), transparent 55%)',
        'grad-vc': 'linear-gradient(90deg, #8B5CF6 0%, #4FC5FF 100%)',
        'grad-vc-glow': 'linear-gradient(90deg, #B285FF 0%, #7BE1FF 100%)',
      },
      boxShadow: {
        glow: '0 0 40px rgba(139,92,246,0.35)',
        'glow-cyan': '0 0 40px rgba(79,197,255,0.35)',
      },
      typography: (theme) => ({
        invert: {
          css: {
            '--tw-prose-body': theme('colors.text.soft'),
            '--tw-prose-headings': theme('colors.text.DEFAULT'),
            '--tw-prose-links': theme('colors.aurora.cyan2'),
            '--tw-prose-bold': theme('colors.text.DEFAULT'),
            '--tw-prose-quotes': theme('colors.text.DEFAULT'),
            '--tw-prose-code': theme('colors.aurora.cyan2'),
          },
        },
      }),
    },
  },
  plugins: [require('@tailwindcss/typography')],
};

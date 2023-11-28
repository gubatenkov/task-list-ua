import defaultTheme from 'tailwindcss/defaultTheme'

/** @type {import('tailwindcss').Config} */
module.exports = {
  theme: {
    extend: {
      colors: {
        destructive: {
          foreground: 'hsl(var(--destructive-foreground))',
          DEFAULT: 'hsl(var(--destructive))',
        },
        secondary: {
          foreground: 'hsl(var(--secondary-foreground))',
          DEFAULT: 'hsl(var(--secondary))',
        },
        primary: {
          foreground: 'hsl(var(--primary-foreground))',
          DEFAULT: 'hsl(var(--primary))',
        },
        popover: {
          foreground: 'hsl(var(--popover-foreground))',
          DEFAULT: 'hsl(var(--popover))',
        },
        accent: {
          foreground: 'hsl(var(--accent-foreground))',
          DEFAULT: 'hsl(var(--accent))',
        },
        muted: {
          foreground: 'hsl(var(--muted-foreground))',
          DEFAULT: 'hsl(var(--muted))',
        },
        card: {
          foreground: 'hsl(var(--card-foreground))',
          DEFAULT: 'hsl(var(--card))',
        },
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
      },
      keyframes: {
        'accordion-down': {
          to: { height: 'var(--radix-accordion-content-height)' },
          from: { height: 0 },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: 0 },
        },
      },
      borderRadius: {
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
        lg: 'var(--radius)',
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
      },
    },
    container: {
      screens: {
        '2xl': '1400px',
      },
      padding: '2rem',
      center: true,
    },
    screens: {
      xs: '475px',
      ...defaultTheme.screens,
    },
  },
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  plugins: [require('tailwindcss-animate')],
  darkMode: ['class'],
}

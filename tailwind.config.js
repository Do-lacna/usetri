const { hairlineWidth } = require('nativewind/theme');

/** @type {import('tailwindcss').Config} */
module.exports = {
  // darkMode: "class",
  content: ['./app/**/*.{ts,tsx}', './src/**/*.{ts,tsx}'],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        // ── CSS-variable-driven semantic tokens ────────────────────────────
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
          hover: 'hsl(var(--primary-hover))',
          active: 'hsl(var(--primary-active))',
        },
        // Yellow — secondary highlights, tags, badges
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        // Orange — CTAs, price highlights, conversion actions
        tertiary: {
          DEFAULT: 'hsl(var(--tertiary))',
          foreground: 'hsl(var(--tertiary-foreground))',
        },
        // Kept for backward compat — mirrors tertiary
        terciary: {
          DEFAULT: 'hsl(var(--terciary))',
          foreground: 'hsl(var(--tertiary-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        divider: {
          DEFAULT: 'hsl(var(--divider))',
          foreground: 'hsl(var(--divider))',
        },
        dividerDark: {
          DEFAULT: 'hsl(var(--divider-dark))',
          foreground: 'hsl(var(--divider-dark))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        success: {
          DEFAULT: 'hsl(var(--success))',
          foreground: 'hsl(var(--success-foreground))',
        },
        warning: {
          DEFAULT: 'hsl(var(--warning))',
          foreground: 'hsl(var(--warning-foreground))',
        },

        // ── Static brand palette ────────────────────────────────────────────
        // Violet — light mode primary
        v1: '#5645CC',
        v2: '#CACAFC',
        v3: '#9595F3',
        v4: '#5E51E3',
        v5: '#5132D6',
        v6: '#3F21B7',

        // Indigo — dark mode surfaces ONLY
        i1: '#1E1E48',
        i2: '#404293',
        i3: '#3C3786',
        i4: '#332B71',
        i5: '#2B235F',
        i6: '#1E1A4C',

        // Orange — tertiary / CTA / price highlights
        o1: '#FB8200',
        o2: '#FFDEBD',
        o3: '#D45608',

        // Yellow — secondary / highlights / badges
        g1: '#FFC900',
        g2: '#FFF7D9',
        g3: '#FF9D00',

        // Neutral warm
        n1: '#FFF6ED',
        n2: '#FFFEF4',
        n3: '#F3E6E5',
        n4: '#E5D1DC',
        n5: '#D5C0D6',
        n6: '#B39FCA',

        // Base
        surface: '#FFFFFF',
        'text-primary': '#001122',
        'text-inverse': '#FFFFFF',
        'bg-default': '#FFFFFF',
        'bg-subtle': '#FFFEF4',

        // Discount badge — uses error red (comparison signal)
        discount: {
          DEFAULT: '#EE525B',
          foreground: '#FFFFFF',
          light: '#FFDEBD',
          dark: '#D45608',
        },
      },
      borderWidth: {
        hairline: hairlineWidth(),
      },
      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
      },
      fontSize: {
        '2xl': '1.5rem', // equivalent to 24px
        '3xl': '1.875rem', // equivalent to 30px
        '4xl': '2.25rem', // equivalent to 36px
        '5xl': '3rem', // equivalent to 48px
        '6xl': '4rem', // equivalent to 64px
      },
      fontFamily: {
        sans: ['Expose-Regular', 'system-ui', 'sans-serif'],
        'expose-regular': ['Expose-Regular', 'system-ui', 'sans-serif'],
        'expose-medium': ['Expose-Medium', 'system-ui', 'sans-serif'],
        'expose-bold': ['Expose-Bold', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
};

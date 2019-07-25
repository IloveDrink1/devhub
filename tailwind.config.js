const _ = require('lodash')

const { staticColorFields } = require('@devhub/core')

module.exports = {
  theme: {
    colors: {
      primary: {
        default: 'var(--theme-primary-background-color)',
        foreground: 'var(--theme-primary-foreground-color)',
      },
      transparent: 'transparent',
      ...Object.assign(
        {},
        ...staticColorFields.map(color => ({
          [_.kebabCase(color)]: `var(--theme-${_.kebabCase(color)})`,
        })),
      ),
      bg: {
        default: 'var(--theme-background-color)',
        'darker-1': 'var(--theme-background-color-darker-1)',
        'darker-2': 'var(--theme-background-color-darker-2)',
        'darker-3': 'var(--theme-background-color-darker-3)',
        'darker-4': 'var(--theme-background-color-darker-4)',
        'darker-5': 'var(--theme-background-color-darker-5)',
        'lighther-1': 'var(--theme-background-color-lighther-1)',
        'lighther-2': 'var(--theme-background-color-lighther-2)',
        'lighther-3': 'var(--theme-background-color-lighther-3)',
        'lighther-4': 'var(--theme-background-color-lighther-4)',
        'lighther-5': 'var(--theme-background-color-lighther-5)',
        'more-1': 'var(--theme-background-color-more-1)',
        'more-2': 'var(--theme-background-color-more-2)',
        'more-3': 'var(--theme-background-color-more-3)',
        'more-4': 'var(--theme-background-color-more-4)',
        'more-5': 'var(--theme-background-color-more-5)',
        'less-1': 'var(--theme-background-color-less-1)',
        'less-2': 'var(--theme-background-color-less-2)',
        'less-3': 'var(--theme-background-color-less-3)',
        'less-4': 'var(--theme-background-color-less-4)',
        'less-5': 'var(--theme-background-color-less-5)',
        'transparent-10': 'var(--theme-background-color-transparent-10)',
      },
      text: {
        default: 'var(--theme-foreground-color)',
        muted: {
          default: 'var(--theme-foreground-color-muted-60)',
          25: 'var(--theme-foreground-color-muted-25)',
          40: 'var(--theme-foreground-color-muted-40)',
          60: 'var(--theme-foreground-color-muted-60)',
        },
      },
    },
    extend: {
      backgroundColor: theme => theme('colors.bg'),
      textColor: theme => theme('colors.text'),
      borderColor: theme => theme('colors'),
      container: {
        center: true,
        padding: '2rem',
      },
      lineHeight: {
        tight: 1.1,
      },
    },
  },
  variants: {},
  plugins: [
    function({ addBase, config }) {
      addBase({
        h1: {
          marginBottom: config('theme.margin.6'),
          lineHeight: config('theme.lineHeight.tight'),
          fontSize: config('theme.fontSize.4xl'),
          fontWeight: config('theme.fontWeight.bold'),
          color: config('theme.textColor.default'),
        },
        h2: {
          marginBottom: config('theme.margin.6'),
          lineHeight: config('theme.lineHeight.normal'),
          fontSize: config('theme.fontSize.xl'),
          fontWeight: config('theme.fontWeight.normal'),
          color: config('theme.textColor.muted.60'),
        },
        h3: {
          lineHeight: config('theme.lineHeight.normal'),
          fontSize: config('theme.fontSize.lg'),
          fontWeight: config('theme.fontWeight.medium'),
          color: config('theme.textColor.default'),
        },
        h4: {
          lineHeight: config('theme.lineHeight.normal'),
          fontSize: config('theme.fontSize.base'),
          fontWeight: config('theme.fontWeight.light'),
          color: config('theme.textColor.muted.60'),
        },
      })
    },
  ],
}

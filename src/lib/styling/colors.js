import entries from 'lodash/entries'
import merge from 'lodash/fp/merge'

export const light = {
  black100: '#000000',
  blue: '#0891cc',
  blue100: '#008fc5',
  blue120: '#00729d',
  blue20: '#cce8f3',
  blue40: '#99d2e7',
  blue60: '#66bbdc',
  blue80: '#33a5d0',
  error: '#de071c',
  grey05: '#f3f3f3',
  grey100: '#4c4c4c',
  grey20: '#d2d2d2',
  grey40: '#a5a5a5',
  grey60: '#787878',
  grey80: '#4c4c4c',
  informative: '#134fff',
  metallic100: '#92b6c7',
  orange: '#cc4e00',
  pink: '#cc28b0',
  sand100: '#a09e8d',
  success: '#028200',
  turqoise: '#28cc9b',
  warning: '#f79502',
  white100: '#ffffff'
}

export const dark = {
  black100: '#000000',
  blue: '#0ab6ff',
  blue100: '#008fc5',
  blue120: '#00729d',
  blue20: '#cce8f3',
  blue40: '#99d2e7',
  blue60: '#66bbdc',
  blue80: '#33a5d0',
  error: '#de071c',
  grey05: '#f3f3f3',
  grey100: '#202020',
  grey20: '#d2d2d2',
  grey40: '#a5a5a5',
  grey60: '#787878',
  grey80: '#4c4c4c',
  informative: '#134fff',
  metallic100: '#92b6c7',
  orange: '#ff6200',
  pink: '#bf40aa',
  sand100: '#a09e8d',
  success: '#028200',
  turqoise: '#33ffc2',
  warning: '#f79502',
  white100: '#ffffff',
  blueDeltares: '#0a28a3'
}

const context = {
  primary: {
    light: light.blue,
    dark: dark.white100
  },
  primaryHover: {
    light: light.blue60,
    dark: dark.blue20
  },
  primaryFocus: {
    light: light.blue60,
    dark: dark.blue20
  },
  primaryPressed: {
    light: light.blue120,
    dark: dark.blue120
  },
  secondary: {
    light: light.blue40,
    dark: dark.blue20
  },
  secondaryHover: {
    light: light.blue20,
    dark: dark.white100
  },
  secondaryFocus: {
    light: light.blue20,
    dark: dark.white100
  },
  secondaryPressed: {
    light: light.blue60,
    dark: dark.blue40
  },
  quiet: {
    light: 'transparent',
    dark: 'transparent'
  },
  quietHover: {
    light: light.blue20,
    dark: dark.grey80
  },
  quietFocus: {
    light: light.blue20,
    dark: dark.grey80
  },
  quietPressed: {
    light: light.blue40,
    dark: dark.grey100
  },
  background: {
    light: light.white100,
    dark: dark.grey100
  },
  buttonColor: {
    light: light.blue120,
    dark: dark.blue120
  },
  buttonColorContrast: {
    light: light.white100,
    dark: dark.blue120
  },
  textColor: {
    light: light.black100,
    dark: dark.white100
  },
  textInverted: {
    light: light.white100,
    dark: dark.black100
  },
  formBase: {
    light: light.grey20,
    dark: dark.grey60
  },
  formActive: {
    light: light.blue100,
    dark: dark.blue80
  }
}

export default function getColors (theme) {
  const baseColors = theme === 'dark' ? dark : light
  const contextColors = entries(context)
    .map(([key, value]) => ({ [key]: value[theme] }))
    .reduce(merge)

  return merge(baseColors, contextColors)
}

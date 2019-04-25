import getColors, { dark, light } from '../../../../lib/styling/colors'

test('get colors for dark theme', () => {
  const colors = getColors('dark')
  expect(colors).toMatchObject(dark)
})

test('get colors for light theme', () => {
  const colors = getColors('light')
  expect(colors).toMatchObject(light)
})

test('context colors match dark theme', () => {
  const colors = getColors('dark')
  expect(colors.background).toBe(dark.grey100)
  expect(colors.textColor).toBe(dark.white100)
  expect(colors.textInverted).toBe(dark.black100)
  expect(colors.formBase).toBe(dark.grey60)
  expect(colors.formActive).toBe(dark.blue80)
})

test('context colors match light theme', () => {
  const colors = getColors('light')
  expect(colors.background).toBe(light.white100)
  expect(colors.textColor).toBe(light.black100)
  expect(colors.textInverted).toBe(light.white100)
  expect(colors.formBase).toBe(light.grey20)
  expect(colors.formActive).toBe(light.blue100)
})

import customProperties from '@/plugins/custom-properties'
import getColors from '@/lib/styling/colors'
jest.mock('@/lib/styling/colors')
getColors.mockReturnValue({
  black100: '#000000',
  blue: '#0891cc',
  blue100: '#008fc5'
})

test('set custom properties on the DOM root', () => {
  const store = { state: { preferences: { theme: { active: 'dark' } } } }
  const inject = jest.fn()
  const setProperty = jest.fn()

  window.document.documentElement.style.setProperty = setProperty
  customProperties({ store }, inject)

  expect(getColors.mock.calls[0][0]).toBe(store.state.preferences.theme.active)
  expect(setProperty.mock.calls.length).toBe(3)
  expect(setProperty.mock.calls[0]).toEqual(['--color-black-100', '#000000'])
  expect(setProperty.mock.calls[1]).toEqual(['--color-blue', '#0891cc'])
  expect(setProperty.mock.calls[2]).toEqual(['--color-blue-100', '#008fc5'])
})

test('inject with function with name', () => {
  const store = { state: { preferences: { theme: { active: 'dark' } } } }
  const inject = jest.fn()

  const fn = customProperties({ store }, inject)

  expect(inject.mock.calls[0][0]).toBe('setCustomProperties')
  expect(inject.mock.calls[0][1]).toBe(fn)
})

import loadModule from '../../../lib/load-module'

test('returns default property from loaded module', async () => {
  const defaultProp = { foo: 'bar' }
  const loader = Promise.resolve({ default: defaultProp })
  const result = await loadModule(loader)
  expect(result).toBe(defaultProp)
})

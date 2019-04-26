import loadLocations from '../../../lib/load-locations'
import getFromApi from '../../../lib/request/get' // eslint-disable-line
jest.mock('../../../lib/request/get', () => (_, { page, times }) => {
  const barNr = page || 1
  return new Promise(resolve => {
    setTimeout(() => {
      resolve({
        results: [{ foo: `bar-${barNr}` }],
        paging: {
          totalObjectCount: times,
        },
      })
    }, 100)
  })
})

test('Calls a callback with the results object from the locations endpoint', async () => {
  const callback = jest.fn()
  const params = { foo: 'bar', times: 1 }

  await loadLocations(params, callback)
  expect(callback).toHaveBeenCalledWith([{ foo: 'bar-1' }])
})

test('Calls the callback multiple times when the response of the api is paginated', async () => {
  const callback = jest.fn(value => value)
  const params = { foo: 'bar', times: 3 }

  await loadLocations(params, callback)

  expect(callback.mock.calls[0][0]).toEqual([{ foo: 'bar-1' }])
  expect(callback.mock.calls[1][0]).toEqual([{ foo: 'bar-2' }])
  expect(callback.mock.calls[2][0]).toEqual([{ foo: 'bar-3' }])
})

test('Returns the value of the callback(s) as an array', async () => {
  const callback = jest.fn(value => value)
  const params = { foo: 'bar', times: 3 }

  const result = await loadLocations(params, callback)

  expect(result).toEqual([
    [{ foo: 'bar-1' }],
    [{ foo: 'bar-2' }],
    [{ foo: 'bar-3' }],
  ])
})

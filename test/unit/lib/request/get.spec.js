import error from '../../../../lib/request/error'
jest.mock('../../../../lib/request/error')

test('call fetch with full url', async () => {
  const fetch = jest.fn(() => Promise.resolve({ json: jest.fn() }))
  window.fetch = fetch
  process.env.SERVER_URL = 'test'
  const get = (await import('../../../../lib/request/get')).default
  await get('foo')
  expect(fetch).toHaveBeenCalledWith('test/foo')
})

test('call fetch with parameters', async () => {
  const fetch = jest.fn(() => Promise.resolve({ json: jest.fn() }))
  window.fetch = fetch
  process.env.SERVER_URL = 'test'
  const get = (await import('../../../../lib/request/get')).default
  await get('foo', { foo: 'bar', baz: 'blub' })
  expect(fetch).toHaveBeenCalledWith('test/foo?foo=bar&baz=blub')
})

test('get json from response before returning', async () => {
  const json = jest.fn(() => Promise.resolve('foo'))
  const fetch = jest.fn(() => Promise.resolve({ json }))
  window.fetch = fetch
  process.env.SERVER_URL = 'test'
  const get = (await import('../../../../lib/request/get')).default
  const result = await get('foo')
  expect(json).toHaveBeenCalled()
  expect(result).toBe('foo')
})

test('reject when status code is 400 or higher', async () => {
  const fetch = jest.fn(() =>
    Promise.resolve({
      json: jest.fn(),
      status: 400,
      statusText: 'Bad request',
    }),
  )
  error.mockReturnValueOnce('an error')
  window.fetch = fetch
  let err = ''
  try {
    const get = (await import('../../../../lib/request/get')).default
    await get('foo')
  } catch (_err) {
    err = _err
  }
  expect(err).toBe('an error')
})

test('reject when ok is false', async () => {
  const fetch = jest.fn(() =>
    Promise.resolve({
      json: jest.fn(),
      ok: false,
    }),
  )
  error.mockReturnValueOnce('an error')
  window.fetch = fetch
  let err = ''
  try {
    const get = (await import('../../../../lib/request/get')).default
    await get('foo')
  } catch (_err) {
    err = _err
  }
  expect(err).toBe('an error')
})

test('reject when fetch fails', async () => {
  const fetch = jest.fn()
  fetch.mockRejectedValue('because of reasons')
  window.fetch = fetch
  let err = ''
  const get = (await import('../../../../lib/request/get')).default
  await get('foo').catch(_err => (err = _err))
  expect(err.message).toBe('Fetch failed: because of reasons')
})

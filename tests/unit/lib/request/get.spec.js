test('call fetch with full url', async () => {
  const fetch = jest.fn(() => Promise.resolve({ json: jest.fn() }))
  window.fetch = fetch
  process.env.VUE_APP_SERVER_URL = 'test'
  const get = (await import('@/lib/request/get')).default
  await get('foo')
  expect(fetch).toHaveBeenCalledWith('test/foo')
})

test('call fetch with parameters', async () => {
  const fetch = jest.fn(() => Promise.resolve({ json: jest.fn() }))
  window.fetch = fetch
  process.env.VUE_APP_SERVER_URL = 'test'
  const get = (await import('@/lib/request/get')).default
  await get('foo', { foo: 'bar', baz: 'blub' })
  expect(fetch).toHaveBeenCalledWith('test/foo?foo=bar&baz=blub')
})

test('get json from response before returning', async () => {
  const json = jest.fn(() => Promise.resolve('foo'))
  const fetch = jest.fn(() => Promise.resolve({ json }))
  window.fetch = fetch
  process.env.VUE_APP_SERVER_URL = 'test'
  const get = (await import('@/lib/request/get')).default
  const result = await get('foo')
  expect(json).toHaveBeenCalled()
  expect(result).toBe('foo')
})

test('reject when status code is 400 or higher', async () => {
  const fetch = jest.fn(() =>
    Promise.resolve({
      json: jest.fn(),
      status: 400,
      statusText: 'Bad request'
    })
  )
  window.fetch = fetch
  const get = (await import('@/lib/request/get')).default
  const err = await get('foo').catch(err => err)
  expect(err.message).toBe('Failed to fetch: Bad request')
  expect(err.status).toBe(400)
  expect(err.statusText).toBe('Bad request')
})

test('reject when ok is false', async () => {
  const fetch = jest.fn(() =>
    Promise.resolve({
      json: jest.fn(),
      ok: false
    })
  )
  window.fetch = fetch
  const get = (await import('@/lib/request/get')).default
  const err = await get('foo').catch(err => err)
  expect(err.message).toBe('Failed to fetch')
  expect(err.ok).toBe(false)
})

test('reject when fetch fails', async () => {
  const fetch = jest.fn()
  fetch.mockRejectedValue('because of reasons')
  window.fetch = fetch
  const get = (await import('@/lib/request/get')).default
  const err = await get('foo').catch(err => err)
  expect(err.message).toBe('Fetch failed: because of reasons')
})

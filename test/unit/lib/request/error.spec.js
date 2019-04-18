import error from '../../../../lib/request/error'

test('returns error with the provided message', () => {
  const result = error('Failed to fetch', {})
  expect(result.message).toBe('Failed to fetch')
})

test('Error contains statusText', () => {
  const result = error('Failed to fetch', { statusText: 'Bad Request' })
  expect(result.message).toBe('Failed to fetch: Bad Request')
  expect(result.statusText).toBe('Bad Request')
})

test('Error contains statusCode', () => {
  const result = error('Failed to fetch', { statusCode: 400 })
  expect(result.statusCode).toBe(400)
})

test('Error contains ok', () => {
  const result = error('Failed to fetch', { ok: false })
  expect(result.ok).toBe(false)
})

test('can be called curried', () => {
  const result = error('Failed to fetch')({ ok: false })
  expect(result.ok).toBe(false)
})

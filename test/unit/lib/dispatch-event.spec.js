import dispatchEvent from '../../../lib/dispatch-event'

test('dispatches an event from the provided element', () => {
  const dispatchEventFn = jest.fn()
  const element = {
    dispatchEvent: dispatchEventFn,
  }

  dispatchEvent(element, 'some-event', { foo: 'bar' })
  expect(dispatchEventFn).toHaveBeenCalled()
})

test('dispatches with a specified event name', () => {
  const dispatchEventFn = jest.fn()
  const element = {
    dispatchEvent: dispatchEventFn,
  }
  window.CustomEvent = jest.fn()
  dispatchEvent(element, 'some-event')
  expect(CustomEvent.mock.calls[0][0]).toBe('some-event')
})

test('dispatches with a specified detail data', () => {
  const dispatchEventFn = jest.fn()
  const element = {
    dispatchEvent: dispatchEventFn,
  }
  window.CustomEvent = jest.fn()
  dispatchEvent(element, 'some-event', { foo: 'bar' })
  expect(CustomEvent.mock.calls[0][1]).toMatchObject({
    detail: { foo: 'bar' },
  })
})

test('dispatches with a bubbles set to true', () => {
  const dispatchEventFn = jest.fn()
  const element = {
    dispatchEvent: dispatchEventFn,
  }
  window.CustomEvent = jest.fn()
  dispatchEvent(element, 'some-event', { foo: 'bar' })
  expect(CustomEvent.mock.calls[0][1]).toMatchObject({ bubbles: true })
})

test('can be called curried', () => {
  const dispatchEventFn = jest.fn()
  const element = {
    dispatchEvent: dispatchEventFn,
  }
  window.CustomEvent = jest.fn()
  dispatchEvent(element)('some-event', { foo: 'bar' })
  expect(CustomEvent.mock.calls[0][1]).toMatchObject({ bubbles: true })
})

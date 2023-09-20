/**
 * Dispatches an event from the provided element
 *
 * @param {HTMLElement} element The element to dispatch from
 * @param {String} event Event name
 * @param {Object} detail Optional details object
 *
 * @example
 * dispatchEvent(element, 'some-event', { foo: 'bar' })
 */
export default function dispatchEvent(element, event, detail) {
  function dispatch(event, detail) {
    element.dispatchEvent(new CustomEvent(event, { detail, bubbles: true }))
  }

  return event ? dispatch(event, detail) : dispatch
}

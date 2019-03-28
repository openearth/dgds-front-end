export default function dispatchEvent(element) {
  return function dispatch(event, detail) {
    element.dispatchEvent(new CustomEvent(event, { detail, bubbles: true }))
  }
}

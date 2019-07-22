import 'whatwg-fetch'

// https://gist.github.com/tonysamperi/0e73f8489000e8261600a92af92748c1
if (typeof window.CustomEvent !== typeof isNaN) {
  const customEvent = function(event, params) {
    params = params || { bubbles: false, cancelable: false, detail: undefined }
    const evt = document.createEvent('CustomEvent')
    evt.initCustomEvent(event, params.bubbles, params.cancelable, params.detail)
    return evt
  }

  customEvent.prototype = window.Event.prototype

  window.CustomEvent = customEvent
}

import curry from 'lodash/fp/curry'

export default curry(function error (message, response) {
  const msg = response.statusText ? `${message}: ${response.statusText}` : message
  const errorObject = new Error(msg)
  errorObject.status = response.status
  errorObject.statusText = response.statusText
  errorObject.ok = response.ok
  return errorObject
})

import entries from 'lodash/entries'
import identity from 'lodash/identity'

import error from './error'

const base = process.env.SERVER_URL

/**
 * Gets JSON response from the provided enpoint from the API
 *
 * @param {String} endpoint Path to the endpoint without api version
 * @param {Object} parameters Optional object to be converted to query params
 */
export default async function get(endpoint, parameters) {
  const fullPath = `${base}/${endpoint}`

  const paramString = entries(parameters)
    .map(([key, value]) => `${key}=${value}`)
    .join('&')

  // prettier-ignore
  const url = [fullPath, paramString]
    .filter(identity)
    .join('?')

  const result = fetch(url)

  try {
    await result
  } catch (error) {
    throw new Error(`Fetch failed: ${error}`)
  }

  return result
    .then(response => {
      if (response.status >= 400) throw error(response)
      if (response.ok === false) throw error(response)
      return response
    })
    .then(response => response.json())
}

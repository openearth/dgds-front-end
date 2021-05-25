import error from './error'

export default async function get (catalogUrl) {
  const result = fetch(catalogUrl)

  try {
    await result
  } catch (err) {
    throw new Error(`Fetch failed: ${err}`)
  }

  return result
    .then(response => {
      const responseError = error('Failed to fetch')
      if (response.status >= 400) throw responseError(response)
      if (response.ok === false) throw responseError(response)
      return response
    })
    .then(response => response.json())
}

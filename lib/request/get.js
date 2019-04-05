import entries from 'lodash/entries'

const base = process.env.SERVER_URL

export default function get(path, parameters) {
  const fullPath = `${base}/${path}`

  const paramString = entries(parameters)
    .map(([key, value]) => `${key}=${value}`)
    .join('&')

  const url = [fullPath, paramString].join('?')

  return fetch(url).then(response => response.json())
}

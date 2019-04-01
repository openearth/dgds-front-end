const base = 'http://localhost:3001'
const api = 'api/v1'

export default function get(path) {
  return fetch(`${base}/${api}/${path}`).then(response => response.json())
}

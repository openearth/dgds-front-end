const base = 'http://localhost:3001'

export default function get(path) {
  return fetch(`${base}/${path}`).then(response => response.json())
}

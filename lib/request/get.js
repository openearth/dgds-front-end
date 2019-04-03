const base = process.env.SERVER_URL

export default function get(path, parameters) {
  let paramString = ''
  Object.keys(parameters).forEach(
    key => (paramString += `${key}=${parameters[key]}&`),
  )
  return fetch(`${base}/${path}?${paramString}`).then(response =>
    response.json(),
  )
}

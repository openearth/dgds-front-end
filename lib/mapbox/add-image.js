import { getCurrentStyle } from './get-style'

export default function addImage(map) {
  return function loadImageInMap(imageObject, options = {}) {
    const styleId = getCurrentStyle(map).id
    const [url, name] = imageObject[styleId]
    return new Promise((resolve, reject) => {
      map.loadImage(url, (error, image) => {
        if (error) return reject(error)

        map.addImage(name, image, options)
        resolve()
      })
    })
  }
}

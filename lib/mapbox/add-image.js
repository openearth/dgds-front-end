import { getCurrentStyle } from './get-style'

export default function addImage(mapbox) {
  return function loadImageInMap(imageObject, options = {}) {
    const styleId = getCurrentStyle(mapbox).id
    const [url, name] = imageObject[styleId]
    return new Promise((resolve, reject) => {
      mapbox.loadImage(url, (error, image) => {
        if (error) return reject(error)

        mapbox.addImage(name, image, options)
        resolve()
      })
    })
  }
}

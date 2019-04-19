import { getCurrentStyle } from './get-style'

function message(property, id) {
  return `Could not add image. ${property} not present in imageObject.${id}`
}

export default function addImage(mapbox) {
  return function loadImageInMap(imageObject, options = {}) {
    const styleId = getCurrentStyle(mapbox).id
    const [url, name] = imageObject[styleId]

    return new Promise((resolve, reject) => {
      if (!url) return reject(new Error(message('Url', styleId)))
      if (!name) return reject(new Error(message('Name', styleId)))

      mapbox.loadImage(url, (error, image) => {
        if (error) return reject(error)
        resolve(mapbox.addImage(name, image, options))
      })
    })
  }
}

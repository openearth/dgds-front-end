import addImage from '../../../../lib/mapbox/add-image'
import { getCurrentStyle } from '../../../../lib/mapbox/get-style'
jest.mock('../../../../lib/mapbox/get-style')
getCurrentStyle.mockReturnValue({ id: 'dark' })

test('add image to mapbox instance', () => {
  const mapboxImage = { mapbox: 'image' }
  const mapbox = {
    addImage: jest.fn(),
    loadImage: jest.fn((url, cb) => {
      cb(null, mapboxImage)
    }),
  }
  const image = {
    dark: ['image/url', 'image-name'],
  }
  addImage(mapbox, image)

  expect(mapbox.loadImage.mock.calls[0][0]).toBe(image.dark[0])
  expect(mapbox.addImage.mock.calls[0][0]).toBe(image.dark[1])
  expect(mapbox.addImage.mock.calls[0][1]).toEqual(mapboxImage)
  expect(mapbox.addImage.mock.calls[0][2]).toEqual({})
})

test('add image to mapbox instance with aditional options', () => {
  const mapboxImage = { mapbox: 'image' }
  const mapbox = {
    addImage: jest.fn(),
    loadImage: jest.fn((url, cb) => {
      cb(null, mapboxImage)
    }),
  }
  const image = {
    dark: ['image/url', 'image-name'],
  }
  const options = { foo: 'bar' }
  addImage(mapbox, image, options)

  expect(mapbox.loadImage.mock.calls[0][0]).toBe(image.dark[0])
  expect(mapbox.addImage.mock.calls[0][0]).toBe(image.dark[1])
  expect(mapbox.addImage.mock.calls[0][1]).toBe(mapboxImage)
  expect(mapbox.addImage.mock.calls[0][2]).toBe(options)
})

test('rejects when loadImage returns an error', async () => {
  const error = new Error('some error')
  const mapbox = {
    addImage: jest.fn(),
    loadImage: jest.fn((url, cb) => {
      cb(error)
    }),
  }
  const image = {
    dark: ['image/url', 'image-name'],
  }
  const result = await addImage(mapbox, image).catch(err => err)

  expect(result).toBe(error)
  expect(mapbox.addImage).not.toHaveBeenCalled()
})

test('rejects when url is not provided in image object', async () => {
  const mapboxImage = { mapbox: 'image' }
  const mapbox = {
    addImage: jest.fn(),
    loadImage: jest.fn((url, cb) => {
      cb(undefined, mapboxImage)
    }),
  }
  const image = {
    dark: [null, 'image-name'],
  }
  const result = await addImage(mapbox, image).catch(err => err)

  expect(result.message).toBe(
    'Could not add image. Url not present in imageObject.dark',
  )
  expect(mapbox.addImage).not.toHaveBeenCalled()
})

test('rejects when name is not provided in image object', async () => {
  const mapboxImage = { mapbox: 'image' }
  const mapbox = {
    addImage: jest.fn(),
    loadImage: jest.fn((url, cb) => {
      cb(undefined, mapboxImage)
    }),
  }
  const image = {
    dark: ['image/url'],
  }
  const result = await addImage(mapbox, image).catch(err => err)

  expect(result.message).toBe(
    'Could not add image. Name not present in imageObject.dark',
  )
  expect(mapbox.addImage).not.toHaveBeenCalled()
})

test('can be called curried', () => {
  const mapboxImage = { mapbox: 'image' }
  const mapbox = {
    addImage: jest.fn(),
    loadImage: jest.fn((url, cb) => {
      cb(null, mapboxImage)
    }),
  }
  const image = {
    dark: ['image/url', 'image-name'],
  }
  const options = { foo: 'bar' }
  addImage(mapbox)(image, options)

  expect(mapbox.loadImage.mock.calls[0][0]).toBe(image.dark[0])
  expect(mapbox.addImage.mock.calls[0][0]).toBe(image.dark[1])
  expect(mapbox.addImage.mock.calls[0][1]).toBe(mapboxImage)
  expect(mapbox.addImage.mock.calls[0][2]).toBe(options)
})

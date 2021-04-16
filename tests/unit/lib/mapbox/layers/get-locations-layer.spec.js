import getVectorLayer from '@/lib/mapbox/layers/get-vector-layer'

test('returns location layer with paint property', () => {
  const locationsLayer = getVectorLayer()
  expect(locationsLayer).toHaveProperty('paint')
})

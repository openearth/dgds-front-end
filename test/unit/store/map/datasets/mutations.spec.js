import { mutations } from '../../../../../store/map/datasets'

describe('addDatasetVector', () => {
  test('updates state with payload', () => {
    const state = { wl: { metadata: 'foo' } }
    const data = { id: 'wl', vectorLayer: { mapboxLayers: [{ foo: 'bar' }] } }

    mutations.addDatasetVector(state, data)
    expect(state).toMatchObject({
      wl: {
        metadata: 'foo',
        vector: { mapboxLayer: [{ foo: 'bar' }] },
      },
    })
    expect(Object.isFrozen(state.wl.vector[0])).toBe(true)
  })

  test('updates state with existing id with new (frozen) features', () => {
    const state = {
      wl: {
        vector: {
          mapboxLayer: [{ foo: 'bar' }],
        },
      },
    }
    const id = 'wl'
    const data = {}

    mutations.addDatasetVector(state, { id, data })
    expect(state).toMatchObject({
      wl: {
        vector: {
          mapboxLayer: [{ foo: 'bar' }],
        },
      },
    })
    expect(Object.isFrozen(state.wl.vector.mapboxLayer[1])).toBe(true)
  })

  test('ignores new mapboxLayers when locationIds are already present', () => {
    const state = {
      wl: {
        vector: {
          mapboxLayer: [{ foo: 'bar' }],
        },
      },
    }
    const id = 'wl'
    const data = {
      vectorLayer: {
        mapboxLayers: [
          {
            bar: 'foo',
          },
        ],
      },
    }

    mutations.addDatasetVector(state, { id, data })
    expect(state).toMatchObject({
      wl: {
        vector: {
          mapboxLayer: [{ foo: 'bar' }],
        },
      },
    })
  })

  test('updates state with different id', () => {
    const state = {
      wl: {
        vector: { mapboxLayer: [{ foo: 'bar' }] },
      },
    }

    const data = { id: 'wd', vectorLayer: { mapboxLayers: [{ bar: 'foo' }] } }

    mutations.addDatasetVector(state, data)
    expect(state).toMatchObject({
      wl: {
        vector: { mapboxLayer: [{ foo: 'bar' }] },
      },
      wd: {
        vector: {
          mapboxLayer: [
            {
              bar: 'foo',
              metadata: { datasetId: undefined, locationIdField: undefined },
            },
          ],
        },
      },
    })
  })
})

describe('addDatasetRaster', () => {
  test('updates state with payload', () => {
    const state = {}
    const data = { id: 'wl', rasterLayer: { url: 'some/url' } }

    mutations.addDatasetRaster(state, data)
    expect(state).toMatchObject({
      wl: {
        raster: { tiles: 'some/url' },
      },
    })
  })

  test('updates state with existing id', () => {
    const state = {
      wl: {
        raster: { tiles: 'some/url' },
      },
    }
    const data = { id: 'wl', rasterLayer: { url: 'some/other/url' } }

    mutations.addDatasetRaster(state, data)
    expect(state).toMatchObject({
      wl: {
        raster: { tiles: 'some/other/url' },
      },
    })
  })

  test('updates state with different id', () => {
    const state = {
      wl: {
        raster: { tiles: 'some/url' },
      },
    }
    const data = { id: 'wd', rasterLayer: { url: 'some/url' } }

    mutations.addDatasetRaster(state, data)
    expect(state).toMatchObject({
      wl: {
        raster: { tiles: 'some/url' },
      },
      wd: {
        raster: { tiles: 'some/url' },
      },
    })
  })
})

describe('addDatasetPointData', () => {
  test('updates state with payload', () => {
    const state = {}
    const id = 'wl'
    const data = { foo: 'bar' }

    mutations.addDatasetPointData(state, { id, data })
    expect(state).toMatchObject({
      wl: {
        pointData: { foo: 'bar' },
      },
    })
  })

  test('updates state with existing id', () => {
    const state = {
      wl: {
        pointData: { foo: 'bar' },
      },
    }
    const id = 'wl'
    const data = { baz: 'blub' }

    mutations.addDatasetPointData(state, { id, data })
    expect(state).toMatchObject({
      wl: {
        pointData: { foo: 'bar', baz: 'blub' },
      },
    })
  })

  test('updates state with different id', () => {
    const state = {
      wl: {
        pointData: { foo: 'bar' },
      },
    }
    const id = 'wd'
    const data = { baz: 'blub' }

    mutations.addDatasetPointData(state, { id, data })
    expect(state).toMatchObject({
      wl: {
        pointData: { foo: 'bar' },
      },
      wd: {
        pointData: { baz: 'blub' },
      },
    })
  })
})

describe('addMetadata', () => {
  test('updates state with payload', () => {
    const state = {}
    const data = { id: 'wl', foo: 'bar' }

    mutations.addMetadata(state, data)
    expect(state).toMatchObject({
      wl: {
        metadata: { id: 'wl', foo: 'bar' },
      },
    })
  })

  test('updates state with existing id', () => {
    const state = {
      wl: {
        metadata: { id: 'wl', foo: 'bar' },
      },
    }
    const data = { id: 'wl', baz: 'blub' }

    mutations.addMetadata(state, data)
    expect(state).toMatchObject({
      wl: {
        metadata: { id: 'wl', foo: 'bar', baz: 'blub' },
      },
    })
  })

  test('does not updates state without id', () => {
    const state = {
      wl: {
        metadata: { id: 'wl', foo: 'bar' },
      },
    }
    const data = { baz: 'blub' }

    mutations.addMetadata(state, data)
    expect(state).toMatchObject({
      wl: {
        metadata: { id: 'wl', foo: 'bar' },
      },
    })
  })

  test('updates state with different id', () => {
    const state = {
      wl: {
        metadata: { id: 'wl', foo: 'bar' },
      },
    }
    const data = { id: 'wd', baz: 'blub' }

    mutations.addMetadata(state, data)
    expect(state).toMatchObject({
      wl: {
        metadata: { id: 'wl', foo: 'bar' },
      },
      wd: {
        metadata: { id: 'wd', baz: 'blub' },
      },
    })
  })
})

import Vue from 'vue'
import { mutations } from '../../../../../store/map/datasets'

describe('addDatasetLocations', () => {
  test('updates state with payload', () => {
    const state = { wl: { metadata: 'foo' } }
    const data = { id: 'wl', mapboxLayer: 'bar' }

    mutations.addDatasetVector(state, data)
    expect(state).toMatchObject({
      wl: {
        metadata: 'foo',
        vector: { mapboxLayer: 'bar' },
      },
    })
    expect(Object.isFrozen(state.wl.vector[0])).toBe(true)
  })


  test('updates state with existing id with new (frozen) features', () => {
    const state = {
      wl: {
        vector: {
          mapboxLayer: { foo: 'bar' },
        },
      },
    }
    const id = 'wl'
    const data = {  }

    mutations.addDatasetVector(state, { id, data })
    expect(state).toMatchObject({
      wl: {
        vector: {
          mapboxLayer:
            {foo: 'bar'},
        },
      },
    })
    expect(Object.isFrozen(state.wl.vector.mapboxLayer[1])).toBe(true)
  })

  // test('ignores new features when locationIds are already present', () => {
  //   const state = {
  //     wl: {
  //       vector: {
  //         mapboxLayer: {foo: 'bar'}
  //       },
  //     },
  //   }
  //   const id = 'wl'
  //   const data = {
  //     features: [
  //       { properties: { locationId: 'foo' } },
  //       { properties: { locationId: 'bar' } },
  //     ],
  //   }
  //
  //   mutations.addDatasetLocations(state, { id, data })
  //   expect(state).toMatchObject({
  //     wl: {
  //       locations: {
  //         features: [
  //           { properties: { locationId: 'foo' } },
  //           { properties: { locationId: 'bar' } },
  //         ],
  //       },
  //     },
  //   })
  // })

  // test('does not call Vue.set when there are no new features to add', () => {
  //   const state = {
  //     wl: {
  //       locations: { features: [{ properties: { locationId: 'foo' } }] },
  //     },
  //   }
  //   const id = 'wl'
  //   const data = {
  //     features: [{ properties: { locationId: 'foo' } }],
  //   }
  //   const spy = jest.spyOn(Vue, 'set')
  //   mutations.addDatasetLocations(state, { id, data })
  //   expect(spy).not.toHaveBeenCalled()
  // })

  // test('updates state with different id', () => {
  //   const state = {
  //     wl: {
  //       locations: { features: [{ properties: { locationId: 'foo' } }] },
  //     },
  //   }
  //   const id = 'wd'
  //   const data = { features: [{ properties: { locationId: 'bar' } }] }
  //
  //   mutations.addDatasetLocations(state, { id, data })
  //   expect(state).toMatchObject({
  //     wl: {
  //       locations: { features: [{ properties: { locationId: 'foo' } }] },
  //     },
  //     wd: {
  //       locations: { features: [{ properties: { locationId: 'bar' } }] },
  //     },
  //   })
  // })
})

describe('addDatasetSpatial', () => {
  test('updates state with payload', () => {
    const state = {}
    const data = { id: 'wl', rasterUrl: 'some/url' }

    mutations.addDatasetSpatial(state, data)
    expect(state).toMatchObject({
      wl: {
        spatial: { tiles: 'some/url' },
      },
    })
  })

  test('updates state with existing id', () => {
    const state = {
      wl: {
        spatial: { tiles: 'some/url' },
      },
    }
    const data = { id: 'wl', rasterUrl: 'some/other/url' }

    mutations.addDatasetSpatial(state, data)
    expect(state).toMatchObject({
      wl: {
        spatial: { tiles: 'some/other/url' },
      },
    })
  })

  test('updates state with different id', () => {
    const state = {
      wl: {
        spatial: { tiles: 'some/url' },
      },
    }
    const data = { id: 'wd', rasterUrl: 'some/url' }

    mutations.addDatasetSpatial(state, data)
    expect(state).toMatchObject({
      wl: {
        spatial: { tiles: 'some/url' },
      },
      wd: {
        spatial: { tiles: 'some/url' },
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

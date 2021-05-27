import { mutations } from '@/store/map/datasets'

describe('addDatasetPointData', () => {
  test('updates state with payload', () => {
    const state = {}
    const id = 'wl'
    const data = { foo: 'bar' }

    mutations.addDatasetPointData(state, { id, data })
    expect(state).toMatchObject({
      wl: {
        pointData: { foo: 'bar' }
      }
    })
  })

  test('updates state with existing id', () => {
    const state = {
      wl: {
        pointData: { foo: 'bar' }
      }
    }
    const id = 'wl'
    const data = { baz: 'blub' }

    mutations.addDatasetPointData(state, { id, data })
    expect(state).toMatchObject({
      wl: {
        pointData: { foo: 'bar', baz: 'blub' }
      }
    })
  })

  test('updates state with different id', () => {
    const state = {
      wl: {
        pointData: { foo: 'bar' }
      }
    }
    const id = 'wd'
    const data = { baz: 'blub' }

    mutations.addDatasetPointData(state, { id, data })
    expect(state).toMatchObject({
      wl: {
        pointData: { foo: 'bar' }
      },
      wd: {
        pointData: { baz: 'blub' }
      }
    })
  })
})

describe('addDataset', () => {
  test('updates state with payload', () => {
    const state = {}
    const dataset = { id: 'wl', foo: 'bar' }

    mutations.addDataset(state, dataset)
    expect(state).toMatchObject({
      wl: { foo: 'bar' }
    })
  })
})

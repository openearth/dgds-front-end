import { mutations } from '../../../../store/map/datasets'

describe('mutations', () => {
  describe('addDatasetLocations', () => {
    test('updates state with payload', () => {
      const state = {}
      const id = 'wl'
      const data = { foo: 'bar' }

      mutations.addDatasetLocations(state, { id, data })
      expect(state).toMatchObject({
        wl: {
          locations: { foo: 'bar' },
        },
      })
    })

    test('updates state with existing id', () => {
      const state = {
        wl: {
          locations: { foo: 'bar' },
        },
      }
      const id = 'wl'
      const data = { baz: 'blub' }

      mutations.addDatasetLocations(state, { id, data })
      expect(state).toMatchObject({
        wl: {
          locations: { foo: 'bar', baz: 'blub' },
        },
      })
    })

    test('updates state with different id', () => {
      const state = {
        wl: {
          locations: { foo: 'bar' },
        },
      }
      const id = 'wd'
      const data = { baz: 'blub' }

      mutations.addDatasetLocations(state, { id, data })
      expect(state).toMatchObject({
        wl: {
          locations: { foo: 'bar' },
        },
        wd: {
          locations: { baz: 'blub' },
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
})

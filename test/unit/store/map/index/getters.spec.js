import { getters } from '../../../../../store/map/index.js'

test('knownDatasetIds returns object of known ids of datasets', () => {
  const state = {
    datasets: {
      wl: {},
      wd: {},
    },
  }
  const ids = ['wl', 'wd']
  const result = getters.knownDatasetIds(state)
  expect(result).toHaveLength(2)
  expect(typeof result).toBe('object')
  expect(result).toEqual(ids)
})

test('knownLocationIds returns object of known location ids', () => {
  const state = {
    datasets: {
      wl: {
        locations: {
          features: [],
        },
      },
      wd: {
        locations: {
          features: [],
        },
      },
    },
  }
  let result = getters.knownLocationIds(state)
  expect(result).toHaveLength(0)
  expect(typeof result).toBe('object')
  state.datasets.wl.locations.features.push({
    properties: {
      locationId: 'WL-Loc1',
    },
  })
  result = getters.knownLocationIds(state)
  expect(result).toHaveLength(1)
  expect(result).toEqual(['WL-Loc1'])

  state.datasets.wd.locations.features.push({
    properties: {
      locationId: 'WD-Loc2',
    },
  })
  result = getters.knownLocationIds(state)
  expect(result).toHaveLength(2)
  expect(result).toEqual(['WL-Loc1', 'WD-Loc2'])
})

test('activeDatasets returns object with the active dataset', () => {
  const state = {
    activeDatasetIds: ['wl'],
    datasets: {
      wl: {
        data: 'test-wl',
      },
      wd: {},
    },
  }
  let result = getters.activeDatasets(state)
  expect(typeof result).toBe('object')
  expect(result).toEqual([state.datasets.wl])

  state.activeDatasetIds.push('wd')
  result = getters.activeDatasets(state)
  expect(result).toEqual([state.datasets.wl, state.datasets.wd])

  // state.activeDatasetIds.push('test')
  // result = getters.activeDatasets(state)
  // expect(result).toEqual([state.datasets.wl, state.datasets.wd])
})

test('activeDatasetsLocations returns object of datasets for the active locations', () => {
  const state = {
    activeLocationIds: ['WL-Loc1'],
    activeDatasets: [
      {
        locations: {
          features: [
            {
              properties: {
                locationId: 'WL-Loc1',
              },
            },
          ],
        },
        pointData: {
          'WL-Loc1': {
            data: 'test-wl-loc1',
          },
          'WL-Loc2': {
            data: 'test-wl-loc2',
          },
        },
      },
    ],
  }
  const result = getters.activeDatasetsLocations(state, state)
  expect(typeof result).toBe('object')
  expect(result).toEqual([
    { features: [{ properties: { active: true, locationId: 'WL-Loc1' } }] },
  ])
})

test('activeDatasetsLocations ignores unknown datasets ids', () => {
  const state = {
    activeLocationIds: ['WL-Loc1'],
    activeDatasetIds: ['wl'],
    datasets: { wl: { pointData: { foo: 'bar' } } },
  }
  const result = getters.activePointDataPerDataset(state, state)
  expect(result).toEqual({ 'WL-Loc1': [{}] })
})

test('activePointDataPerDataset returns object of pointdata for the active locations', () => {
  const state = {
    activeLocationIds: ['WL-Loc1'],
    activeDatasetIds: ['wl'],
    datasets: {
      wl: {
        locations: {
          features: [
            {
              properties: {
                locationId: 'WL-Loc1',
              },
            },
          ],
        },
        pointData: {
          'WL-Loc1': {
            data: 'test-wl-loc1',
          },
          'WL-Loc2': {
            data: 'test-wl-loc2',
          },
        },
      },
      wd: {
        locations: {
          features: [],
        },
      },
    },
  }
  const result = getters.activePointDataPerDataset(state)
  expect(typeof result).toBe('object')
  expect(result['WL-Loc1']).toEqual([
    {
      data: 'test-wl-loc1',
    },
  ])
})

test('datasetsInActiveTheme returns array of datasets for the current theme', () => {
  const state = {
    activeDatasetIds: ['bar'],
    datasets: {
      foo: { metadata: { id: 'foo' } },
      bar: { metadata: { id: 'bar' } },
    },
  }
  const result = getters.datasetsInActiveTheme(state)
  expect(result).toEqual([
    { id: 'foo', visible: false },
    { id: 'bar', visible: true },
  ])
})

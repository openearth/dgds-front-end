import { shallowMount, createLocalVue } from '@vue/test-utils'
import Vuex from 'vuex'
import Default from '../../../layouts/default.vue'

const localVue = createLocalVue()
localVue.use(Vuex)

// Mock nuxt
localVue.component('nuxt-link', { template: '<a href="#">foo</a>' })
localVue.component('nuxt', { template: '<div />' })
localVue.component('client-only', { template: '<div />' })

// Mock Mapbox (can't properly render in node anyway)
localVue.component('v-mapbox', { template: '<div />' })
localVue.component('v-mapbox-navigation-control', { template: '<div />' })
localVue.directive('mapbox', {})

describe('Default', () => {
  let store
  let map
  let preferences

  beforeEach(() => {
    map = {
      namespaced: true,
      getters: {
        activeRasterData: jest.fn(() => 'dummy'),
        activeSpatialData: jest.fn(() => 'foo'),
        activeTimestamp: jest.fn(() => 'dummy'),
        datasetsInActiveTheme: jest.fn(() => ['bar']),
        getActiveRasterLayer: jest.fn(() => 'dummy'),
        getGeographicalScope: jest.fn(() => 'global'),
        getDatasets: jest.fn(() => {
          return {
            ab: {
              metadata: {
                scope: 'global',
              },
            },
            cd: { metadata: { scope: 'global' } },
          }
        }),
        getActiveTheme: jest.fn(() => {
          return {
            datasets: ['cd', 'ef', 'gh'],
            id: 'themeId',
            name: 'themeName',
          }
        }),
        activeVectorData: jest.fn(() => {
          return [
            {
              filterIds: ['H.surge.simulated'],
              id: 'GLOSSIS',
              source: {
                type: 'vector',
                url: 'mapbox://global-data-viewer.6w19mbaw',
              },
              'source-layer': 'pltc012flat',
              type: 'circle',
            },
          ]
        }),
      },
      actions: {
        loadPointDataForLocation: jest.fn(),
      },
      mutations: {
        setGeographicalScope: jest.fn(),
      },
    }
    preferences = {
      namespaced: true,
      modules: {
        theme: {
          namespaced: true,
          state: { active: 'dark' },
          mutations: {
            setActive: jest.fn(),
          },
        },
      },
    }
    store = new Vuex.Store({
      modules: {
        map,
        preferences,
      },
    })
  })

  // TODO: test of rounting with zoom to bbox is incomplete.
  test('updates url when datasetId is switched on', () => {
    const routerPush = jest.fn()
    const wrapper = shallowMount(Default, {
      store,
      localVue,
      mocks: {
        $route: { params: { datasetIds: 'cd' }, name: 'datasetIds-locationId' },
        $router: { push: routerPush },
        $tours: { introduction: { start: jest.fn() } },
      },
    })

    wrapper.find('.default-layout__data-set-controls').vm.$emit('toggle-location-dataset', 'ab')

    expect(routerPush).toHaveBeenCalledWith({
      params: { datasetIds: 'cd,ab' },
      name: 'datasetIds-locationId',
    })
  })

  test('updates url when datasetId is switched off', () => {
    const routerPush = jest.fn()
    const wrapper = shallowMount(Default, {
      store,
      localVue,
      mocks: {
        $route: {
          params: { datasetIds: 'cd,ab' },
          name: 'datasetIds-locationId',
        },
        $router: { push: routerPush },
        $tours: { introduction: { start: jest.fn() } },
      },
    })

    wrapper.find('.default-layout__data-set-controls').vm.$emit('toggle-location-dataset', 'ab')

    expect(routerPush).toHaveBeenCalledWith({
      params: { datasetIds: 'cd' },
      name: 'datasetIds-locationId',
    })
  })

  test('remove locationId from route object when datasetIds is missing during url update', () => {
    const routerPush = jest.fn()
    const wrapper = shallowMount(Default, {
      store,
      localVue,
      mocks: {
        $route: {
          params: { datasetIds: 'ab', locationId: 'ef' },
          name: 'datasetIds-locationId',
        },
        $router: { push: routerPush },
        $tours: { introduction: { start: jest.fn() } },
      },
    })

    wrapper.find('.default-layout__data-set-controls').vm.$emit('toggle-location-dataset', 'ab')

    expect(routerPush).toHaveBeenCalledWith({
      params: { datasetIds: undefined },
      name: 'datasetIds-locationId',
    })
  })
})

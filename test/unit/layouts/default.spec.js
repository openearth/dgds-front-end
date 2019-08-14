import { shallowMount, createLocalVue } from '@vue/test-utils'
import Vuex from 'vuex'
import Default from '../../../layouts/default.vue'

const localVue = createLocalVue()
localVue.use(Vuex)

localVue.component('nuxt-link', { template: '<a href="#">foo</a>' })
localVue.component('nuxt', { template: '<div />' })
localVue.directive('mapbox', {})

describe('Default', () => {
  let store
  let map
  let preferences

  beforeEach(() => {
    map = {
      namespaced: true,
      getters: {
        activeSpatialData: jest.fn(() => 'foo'),
        datasetsInActiveTheme: jest.fn(() => ['bar']),
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

  test('updates url when datasetId is switched on', () => {
    const routerPush = jest.fn()
    const wrapper = shallowMount(Default, {
      store,
      localVue,
      mocks: {
        $route: { params: { datasetIds: 'cd' }, name: 'datasetIds-locationId' },
        $router: { push: routerPush },
      },
    })

    wrapper
      .find('.default-layout__data-set-control-menu')
      .vm.$emit('toggle-location-dataset', 'ab')

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
      },
    })

    wrapper
      .find('.default-layout__data-set-control-menu')
      .vm.$emit('toggle-location-dataset', 'ab')

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
      },
    })

    wrapper
      .find('.default-layout__data-set-control-menu')
      .vm.$emit('toggle-location-dataset', 'ab')

    expect(routerPush).toHaveBeenCalledWith({
      params: { datasetIds: undefined },
      name: 'datasetIds-locationId',
    })
  })

  test('update url when theme changes', () => {
    const routerPush = jest.fn()
    const wrapper = shallowMount(Default, {
      store,
      localVue,
      mocks: {
        $route: {
          params: { datasetIds: 'ef' },
          name: 'datasetIds-locationId',
        },
        $router: { push: routerPush },
      },
    })

    wrapper.find('.default-layout__site-navigation').vm.$emit('change-theme')

    expect(routerPush).toHaveBeenCalledWith({
      params: { datasetIds: 'ef' },
      name: 'datasetIds-locationId',
    })
  })
})

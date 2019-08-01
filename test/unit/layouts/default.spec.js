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
        allVectorData: jest.fn(() => [{ foo: 'bar' }]),
        activeSpatialData: jest.fn(() => 'foo'),
        datasetsInActiveTheme: jest.fn(() => ['bar']),
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

  // test('mounts without issues', () => {
  //   const wrapper = shallowMount(Default, { store, localVue })
  //   expect(wrapper.vm.activeTheme).toBe(preferences.modules.theme.state.active)
  //   expect(wrapper.vm.activeDatasetsLocations).toBe(
  //     map.getters.activeDatasetsLocations(),
  //   )
  //   expect(wrapper.vm.datasetsInActiveTheme).toEqual(
  //     map.getters.datasetsInActiveTheme(),
  //   )
  //   expect(wrapper.vm.mapboxOptions).toEqual({
  //     sources: map.getters.activeDatasetsLocations(),
  //     style: preferences.modules.theme.state.active,
  //     tiles: map.getters.activeSpatialData(),
  //   })
  // })
  //
  // test('dispatches loadPointDataForLocation on load-locations mapbox event', () => {
  //   const wrapper = shallowMount(Default, {
  //     store,
  //     localVue,
  //     mocks: { $route: { params: { datasetIds: 'cd' } } },
  //   })
  //
  //   wrapper.find('#map').trigger('load-locations', {
  //     detail: [{ properties: { locationId: 'ab' } }],
  //   })

  // expect(map.actions.loadPointDataForLocation.mock.calls[0][1]).toEqual({
  //   datasetIds: 'cd',
  //   locationId: 'ab',
  // })
  // })

  // test('update url with new datasetIds on select-locations mapbox event', () => {
  //   const routerPush = jest.fn()
  //   const wrapper = shallowMount(Default, {
  //     store,
  //     localVue,
  //     mocks: {
  //       $route: { params: { datasetIds: 'cd' } },
  //       $router: { push: routerPush },
  //     },
  //   })
  //
  //   wrapper.find('#map').trigger('select-locations', {
  //     detail: [
  //       { properties: { locationId: 'ab' } },
  //       { properties: { locationId: 'ef' } },
  //     ],
  //   })
  //
  //   expect(routerPush).toHaveBeenCalledWith({
  //     name: 'datasetIds-locationId',
  //     params: { datasetIds: 'cd', locationId: 'ab' },
  //   })
  // })

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
})

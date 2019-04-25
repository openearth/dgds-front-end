import Vue from 'vue'
import { mount } from '@vue/test-utils'
import echarts from 'echarts'
import { resizeHandlers } from '../../../../plugins/echarts'

jest.mock('echarts', () => ({
  init: jest.fn(() => ({
    setOption: jest.fn(),
    resize: jest.fn(),
    id: 'ab',
  })),
  getInstanceByDom: jest.fn(() => ({
    setOption: jest.fn(),
    id: 'ab',
  })),
  dispose: jest.fn(),
}))

jest.mock('lodash/throttle', () => value => value)

const data = { foo: 'bar' }

beforeAll(() => {
  window.removeEventListener = jest.fn()
  return new Promise(resolve => {
    const wrapper = mount(
      Vue.component('test', {
        data: () => ({ data }),
        template: '<div v-echarts="{data}"></div>',
      }),
    )

    setTimeout(() => {
      const div = wrapper.find('div')
      div.destroy()
      resolve()
    }, 100)
  })
})

describe('unbind', () => {
  test('removes event listener', () => {
    expect(window.removeEventListener).toHaveBeenCalledWith(
      'resize',
      resizeHandlers.ab,
    )
  })
  test('disposes echarts instance', () => {
    expect(echarts.dispose).toHaveBeenCalled()
  })
})

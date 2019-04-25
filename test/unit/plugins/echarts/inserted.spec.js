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
  geInstanceByDom: jest.fn(() => ({
    setOption: jest.fn(),
  })),
}))

jest.mock('lodash/throttle', () => value => value)

describe('inserted', () => {
  const data = { foo: 'bar' }
  window.addEventListener = jest.fn()

  mount(
    Vue.component('test', {
      data: () => ({ data }),
      template: '<div v-echarts="{data}"></div>',
    }),
  )

  const chart = echarts.init.mock.results[0].value

  test('set echarts to svg by default', () => {
    expect(echarts.init.mock.calls[0][2]).toEqual({ renderer: 'svg' })
  })
  test('pass data to setOption', () => {
    expect(chart.setOption.mock.calls[0][0]).toBe(data)
  })
  test('resize chart on window resize', () => {
    expect(window.addEventListener).toHaveBeenCalledWith('resize', chart.resize)
  })
  test('the resize handler is stored in resizeHandlers', () => {
    expect(resizeHandlers).toEqual({ ab: chart.resize })
  })
})

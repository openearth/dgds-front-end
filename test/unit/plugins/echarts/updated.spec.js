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
  })),
}))

jest.mock('lodash/throttle', () => value => value)

const data = { foo: 'bar' }
const newData = { baz: 'blub' }

beforeAll(() => {
  return new Promise(resolve => {
    mount(
      Vue.component('test', {
        data: () => ({ data }),
        mounted() {
          setTimeout(() => {
            this.data = newData
            resolve()
          }, 100)
        },
        template: '<div v-echarts="{data}"></div>',
      }),
    )
  })
})

describe('update', () => {
  test('calls chart.setOption with new data', () => {
    const chart = echarts.getInstanceByDom.mock.results[0].value
    expect(chart.setOption).toHaveBeenCalledWith(newData)
  })
})

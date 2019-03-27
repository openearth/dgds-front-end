import Vue from 'vue'
import echarts from 'echarts'

let chart

Vue.directive('echarts', {
  bind(el, { value }) {
    const { options, renderer = 'svg' } = value
    chart = echarts.init(el, null, { renderer })
    chart.setOption(options)
  },

  update(el, { value }) {
    const { options } = value
    chart.setOption(options)
  },
})

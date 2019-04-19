import Vue from 'vue'
import echarts from 'echarts'
import throttle from 'lodash/throttle'

export const resizeHandlers = {}

Vue.directive('echarts', {
  inserted(el, { value }) {
    // on bind initiate echart and set the standard tools for the echart
    const { data, renderer = 'svg' } = value
    const chart = echarts.init(el, null, { renderer })
    chart.setOption(data)

    const resizeHandler = throttle(chart.resize, 100)
    window.addEventListener('resize', resizeHandler)
    resizeHandlers[chart.id] = resizeHandler
  },
  update(el, { value: newValue, oldValue }) {
    const chart = echarts.getInstanceByDom(el)
    chart.setOption(newValue.data)
  },
  unbind(el) {
    const chart = echarts.getInstanceByDom(el)
    window.removeEventListener('resize', resizeHandlers[chart.id])
    echarts.dispose(el)
  },
})

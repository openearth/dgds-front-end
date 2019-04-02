import Vue from 'vue'
import echarts from 'echarts'

Vue.directive('echarts', {
  inserted(el, { value }) {
    // on bind initiate echart and set the standard tools for the echart
    const { data, renderer = 'svg' } = value
    const chart = echarts.init(el, null, { renderer })
    chart.setOption(data)
  },
  update(el, { value: newValue, oldValue }) {
    const chart = echarts.getInstanceByDom(el)
    chart.setOption(newValue.data)
  },
  unbind(el) {
    echarts.dispose(el)
  },
})

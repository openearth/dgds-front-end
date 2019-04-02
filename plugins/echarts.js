import Vue from 'vue'
import echarts from 'echarts'
import diff from '../lib/diff-object'

const charts = []

// All the colorsettings for the echart graphs
const styles = {
  dark: {
    title: {
      textStyle: {
        color: '#FFFFFF',
      },
    },
    backgroundColor: '#202020',
    color: '#FF33DD',
    textStyle: {
      fontFamily: 'sans-serif',
      color: '#FFF',
    },
    yAxis: {
      axisLine: {
        lineStyle: {
          color: '#FFFFFF',
        },
      },
    },
    xAxis: {
      axisLine: {
        lineStyle: {
          color: '#FFFFFF',
        },
      },
    },
  },
  light: {
    title: {
      textStyle: {
        color: '#000000',
      },
    },
    backgroundColor: '#FFFFFF',
    color: '#CC28B0',
    textStyle: {
      fontFamily: 'sans-serif',
      color: '#000000',
    },
    yAxis: {
      axisLine: {
        lineStyle: {
          color: '#4C4C4C',
        },
      },
    },
    xAxis: {
      axisLine: {
        lineStyle: {
          color: '#4C4C4C',
        },
      },
    },
  },
}

Vue.directive('echarts', {
  bind(el, { value }) {
    // on bind initiate echart and set the standard tools for the echart
    const { options, style, renderer = 'svg' } = value
    const chart = echarts.init(el, null, { renderer })
    options.series.forEach(serie => {
      serie.itemStyle = {
        normal: {
          borderWidth: 6,
          borderColor: styles[style].color,
          color: styles[style].color,
        },
      }
    serie.symbolSize = 5
    chart.setOption(options)
    chart.setOption({
      toolbox: {
        left: 'center',
        itemSize: 20,
        top: 13,
        feature: {
          dataZoom: {
            title: 'Zoom',
            color: '#787878',
            yAxisIndex: 'none',
          },
          restore: {
            title: 'Reset',
            color: '#787878',
          },
        },
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow',
        },
      },
      dataZoom: [
        {
          type: 'inside',
          realtime: true,
        },
      ],
    })
    chart.setOption(styles[style])
    charts.push(chart)
  },

  update(el, { value: newValue, oldValue }) {
    // Check which values have been changed
    const diffed = diff(oldValue, newValue)

    if (diffed && diffed.style) {
      // If style, change the theme of the graph
      charts.forEach(chart => chart.setOption(styles[diffed.style]))
    }
  },
})

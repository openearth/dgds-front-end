import Vue from 'vue'
import echarts from 'echarts'
import diff from '../lib/diff-object'

let chart

const styles = {
  dark: {
    backgroundColor: '#202020',
    color: '#FF33DD',
    textStyle: {
      fontFamily: 'sans-serif',
      color: '#FFF',
    },
  },
  light: {
    backgroundColor: '#FFFFFF',
    color: '#CC28B0',
    textStyle: {
      fontFamily: 'sans-serif',
      color: '#000000',
    },
  },
}

function changeTheme(style) {
  const option = chart.getOption()
  option.series.forEach(serie => {
    serie.itemStyle = {
      normal: {
        borderWidth: 6,
        borderColor: styles[style].color,
        color: styles[style].color,
      },
    }
    serie.symbolSize = 6
    return serie
  })
  chart.setOption(option)
  chart.setOption(styles[style])
}

Vue.directive('echarts', {
  bind(el, { value }) {
    const { options, style, renderer = 'svg' } = value
    chart = echarts.init(el, null, { renderer })
    chart.setOption(options)
    changeTheme(style)
    chart.setOption({
      toolbox: {
        left: 'center',

        feature: {
          dataZoom: {
            title: 'hoi',
            yAxisIndex: 'none',
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
        },
        {
          type: 'slider',
        },
      ],
    })
  },

  update(el, { value: newValue, oldValue }) {
    // Check which values have been changed
    const diffed = diff(oldValue, newValue)

    if (diffed && diffed.style) {
      // If style, change the theme of the graph
      changeTheme(diffed.style)
    } else if (diffed && diffed.options) {
      // If options, change the data of the graph
      chart.setOption(diffed.options)
    }
  },
})

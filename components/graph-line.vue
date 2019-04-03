<template>
  <figure class="graph-line">
    <figcaption class="graph-line__caption">{{ title }}</figcaption>
    <div v-echarts="{ data }" class="graph-line"></div>
  </figure>
</template>

<script>
import merge from 'lodash/merge'

const styleLight = {
  toolbox: {
    feature: {
      dataZoom: {
        color: '#787878',
      },
      restore: {
        color: '#787878',
      },
    },
  },
  backgroundColor: '#ffffff',
  color: '#cc28b0',
  textStyle: {
    color: '#000000',
  },
  xAxis: {
    axisLine: {
      lineStyle: {
        color: '#000000',
      },
    },
  },
  yAxis: {
    axisLine: {
      lineStyle: {
        color: '#000000',
      },
    },
  },
}

const styleDark = {
  toolbox: {
    feature: {
      dataZoom: {
        color: '#787878',
      },
      restore: {
        color: '#787878',
      },
    },
  },
  backgroundColor: '#202020',
  color: '#FF33DD',
  textStyle: {
    color: '#FFF',
  },
  xAxis: {
    axisLine: {
      lineStyle: {
        color: '#FFFFFF',
      },
    },
  },
  yAxis: {
    axisLine: {
      lineStyle: {
        color: '#FFFFFF',
      },
    },
  },
}

const baseOptions = {
  toolbox: {
    left: 'center',
    itemSize: 20,
    top: 13,
    feature: {
      dataZoom: {
        title: 'Zoom',
        yAxisIndex: 'none',
      },
      restore: {
        title: 'Reset',
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
  title: {
    x: 'center',
  },
  textStyle: {
    fontFamily: 'sans-serif',
  },
  xAxis: {
    type: 'category',
    axisLine: {
      onZero: false,
    },
  },
  yAxis: {
    type: 'value',
  },
}

export default {
  props: {
    category: {
      type: Array,
      default: () => [],
    },
    series: {
      type: Array,
      default: () => [],
    },
    title: {
      type: String,
      default: '',
    },
    theme: {
      type: String,
      default: '',
    },
  },
  computed: {
    data() {
      const data = {
        xAxis: {
          data: this.category,
        },
        series: this.series.map(data => ({
          type: 'line',
          showAllSymbol: true,
          data,
        })),
      }

      const theme = this.theme === 'dark' ? styleDark : styleLight

      return merge(baseOptions, theme, data)
    },
  },
}
</script>

<style>
.graph-line {
  width: 100%;
  height: 100%;
}
</style>

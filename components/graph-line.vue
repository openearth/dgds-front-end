<template>
  <figure
    class="graph-line"
    :class="{ 'graph-line__collapsible': collapsible }"
  >
    <button v-if="collapsible" class="graph-line__toggle" @click="toggle">
      Toggle
    </button>
    <figcaption class="graph-line__caption" @click="toggle">
      {{ title }}
    </figcaption>
    <div
      v-if="!isCollapsed"
      v-echarts="{ data }"
      class="graph-line__chart"
    ></div>
  </figure>
</template>

<script>
import merge from 'lodash/merge'

const styleLight = {
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
    collapsible: {
      type: Boolean,
      default: false,
    },
  },
  data: () => ({
    isCollapsed: false,
  }),
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
  methods: {
    toggle() {
      if (this.collapsible) {
        this.isCollapsed = !this.isCollapsed
      }
    },
  },
}
</script>

<style>
.graph-line {
  position: relative;
}

.graph-line__chart {
  width: 100%;
  height: 100%;
}

.graph-line__collapsible .graph-line__caption {
  cursor: pointer;
}

.graph-line__toggle {
  position: absolute;
  top: 1rem;
  right: 1rem;
}

.graph-line__caption {
  padding: 1rem;
  background-color: #ffffff;
}
</style>

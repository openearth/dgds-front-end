
<template>
  <div>
    <v-container class="pa-0">
      <v-col cols="12" class="graph-line pa-0">
        <v-chart
          v-if="isLine || isScatter || isMultiple || isEnsemble"
          :ref="title"
          :option="graphData"
          :autoresize="true"
          class="graph-line__chart"
        />
        <img v-else :src="imageUrl" class="graph-line__image" />
      </v-col>
      <v-col cols="12">
        <v-btn
          v-if="user && (isLine || isScatter || isMultiple || isEnsemble)"
          @click="downloadJson"
          outlined
          block>
          Download data
        </v-btn>
        <v-btn
          v-if="user && isImage"
          @click="downloadImage"
          outlined
          block>
          Download image
        </v-btn>
        <div v-if="!user">
          <custom-icon name="info" />
          Please log in to download data.
        </div>
      </v-col>
    </v-container>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import merge from 'lodash/merge'
import moment from 'moment'
import VChart from 'vue-echarts'
import { saveAs } from 'file-saver'
import CustomIcon from '@/components/CustomIcon'

// import ECharts modules manually to reduce bundle size
import {
  SVGRenderer,
  CanvasRenderer
} from 'echarts/renderers'

import {
  LineChart,
  ScatterChart,
  LinesChart
} from 'echarts/charts'

import {
  GridComponent,
  TooltipComponent,
  MarkLineComponent,
  MarkPointComponent,
  DataZoomComponent,
  TimelineComponent
} from 'echarts/components'

import { use } from 'echarts/core'

use([
  ScatterChart,
  CanvasRenderer,
  LineChart,
  GridComponent,
  TooltipComponent,
  MarkLineComponent,
  MarkPointComponent,
  DataZoomComponent,
  TimelineComponent,
  LinesChart
])

use([CanvasRenderer])
use([SVGRenderer])

const getStyle = (colors = {}) => ({
  backgroundColor: colors.background,
  color: colors.pink,
  textStyle: {
    color: colors.textColor
  },
  xAxis: {
    axisLine: {
      lineStyle: {
        color: colors.textColor
      }
    }
  },
  yAxis: {
    axisLine: {
      lineStyle: {
        color: colors.textColor
      }
    },
    splitLine: {
      lineStyle: {
        color: colors.formBase
      }
    }
  }
})

const baseOptions = {
  tooltip: {
    trigger: 'axis',
    axisPointer: {
      type: 'shadow'
    },
    backgroundColor: 'rgba(50,50,50,0.7)',
    textStyle: {
      color: '#fff'
    }
  },
  grid: {
    show: true,
    top: 30,
    bottom: 50,
    right: 20,
    left: 90
  },
  dataZoom: [
    {
      type: 'inside',
      realtime: true
    }
  ],
  textStyle: {
    fontFamily: 'Helvetica'
  },
  xAxis: {
    type: 'time',
    axisLine: {
      onZero: false,
      show: false
    },
    splitLine: {
      show: true
    },
    axisLabel: {
      formatter: '{dd}-{MM}-{yy}'
    }
  },
  yAxis: {
    type: 'value',
    axisLabel: {
      fontSize: 14
    },
    nameLocation: 'middle',
    nameGap: 55,
    nameTextStyle: {
      fontSize: 14,
      fontFamily: 'Helvetica'
    }
  }
}
export default {
  components: { VChart, CustomIcon },
  props: {
    imageUrl: {
      type: String,
      default: () => ''
    },
    category: {
      type: Array,
      default: () => []
    },
    series: {
      type: Array,
      default: () => []
    },
    title: {
      type: String,
      default: ''
    },
    theme: {
      type: String,
      default: ''
    },
    collapsible: {
      type: Boolean,
      default: false
    },
    units: {
      type: String,
      default: '-'
    },
    type: {
      type: String,
      default: 'line',
      validator (value) {
        // The value must match one of these strings
        return ['line', 'scatter', 'images', 'multiple', 'ensemble'].includes(value)
      }
    },
    parameterId: {
      type: String,
      default: ''
    },
    timeSpanType: {
      type: String,
      default: ''
    },
    timeFormatType: {
      type: String,
      default: ''
    },
    setMarkPoint: {
      type: Boolean,
      default: false
    },
    timeStep: {
      type: String,
      default: ''
    }
  },
  computed: {
    ...mapGetters(['colors', 'user']),
    ...mapGetters(['activeTimestamp']),
    isLine () {
      return this.type === 'line'
    },
    isImage () {
      return this.type === 'images'
    },
    isScatter () {
      return this.type === 'scatter'
    },
    isMultiple () {
      return this.type === 'multiple'
    },
    isEnsemble () {
      return this.type === 'ensemble'
    },
    graphData () {
      let series = []
      if (this.type === 'multiple') {
        series.push(this.addLineToGraph(this.series[0][1]))
        series.push(this.addAreaToGraph(this.series[0][2], 'lower', '#a3a3a3'))
        series.push(this.addAreaToGraph(this.series[0][0], 'upper'))
      } else if (this.type === 'ensemble') {
        series.push(this.addLineToGraph(this.series[0][1].data))
        series.push(this.addAreaToGraph(this.series[0][2].data, 'lower', '#a3a3a3'))
        series.push(this.addAreaToGraph(this.series[0][0].data, 'upper'))
      } else {
        series = this.series.map(serie => {
          return this.addLineToGraph(serie)
        })
        const markPointCoord = this.getMarkPointCoord(this.series[0])

        if (this.timeStep !== '') {
          series.push({
            type: this.type,
            markPoint: {
              data: [
                {
                  coord: markPointCoord,
                  symbolSize: 30
                }
              ]
            }
          })
        }
        // T0 marker line, only add for Live data
        if (this.timeSpanType === 'Live') {
          series.push({
            type: 'line',
            markLine: {
              silent: true,
              data: [
                {
                  xAxis: moment().format()
                }
              ],
              lineStyle: { color: 'white' }
            }
          })
        }
      }

      // TODO:
      // - add x-label to population exposure graph
      // - avoid that y-label crosses values y-axis
      const dataOptions = {
        series,
        yAxis: {
          name: `${this.title} [${this.units}]`
        },
        // TODO: Make this conditional to availability of formatType
        xAxis: {
          axisLabel: {
            formatter: `{${this.timeFormatType}}`
          }
        }
      }

      const theme = getStyle(this.colors)
      // Merge eChart plot settings, low to high prio
      const result = merge(baseOptions, dataOptions, theme)
      return result
    }
  },
  methods: {
    getMarkPointCoord (serie) {
      let data = serie.map((col, i) => [this.category[i], col])
      // Make sure that all data is in chronological order to plot it correctly
      data = data.sort((colA, colB) => {
        return moment(colA[0]) - moment(colB[0])
      })

      // Create a markpoint if there is a value on the exact timestamp selected
      const markPointCoord = data.find(val => {
        const same = moment(val[0]).isSame(moment(this.timeStep))
        return same
      })
      return markPointCoord
    },
    addLineToGraph (graphSerie) {
      let data = graphSerie.map((col, i) => [this.category[i], col])
      // Make sure that all data is in chronological order to plot it correctly
      data = data.sort((colA, colB) => {
        return moment(colA[0]) - moment(colB[0])
      })

      return {
        type: 'line',
        showAllSymbol: true,
        data,
        itemStyle: {
          normal: {
            borderWidth: 1
          }
        }
      }
    },
    addAreaToGraph (serie, label, color = null, legend = false) {
      let data = serie.map((col, i) => [this.category[i], col])
      // Make sure that all data is in chronological order to plot it correctly
      data = data.sort((colA, colB) => {
        return moment(colA[0]) - moment(colB[0])
      })

      const series = {
        name: label,
        data: data,
        type: 'line',
        symbol: 'none',
        lineStyle: {
          opacity: 0
        },
        z: -1,
        color: color
      }
      if (color) {
        series.areaStyle = {
          color: color,
          origin: 'start',
          opacity: 0.3
        }
      } else {
        series.areaStyle = {
          color: '#202020', // TODO: get from custom style
          opacity: 1,
          origin: 'start'
        }
      }
      return series
    },
    downloadJson () {
      const fileName = `${this.title}.json`
      const data = {
        title: this.title,
        timeseries: this.series,
        units: this.units,
        dates: this.category
      }
      // Create a blob of the data
      const fileToSave = new Blob([JSON.stringify(data)], {
        type: 'application/json',
        name: fileName
      })

      // Save the file
      saveAs(fileToSave, fileName)
    },
    downloadImage () {
      const fileName = `${this.title}.svg`

      fetch(this.imageUrl)
        .then(res => {
          return res.text()
        })
        .then(response => {
          // create elements
          const parser = new DOMParser()
          const doc = parser.parseFromString(response, 'image/svg+xml')
          const svg = doc.getElementsByTagName('svg')[0]
          const style = document.createElement('style')

          // set style
          style.innerHTML = `svg {
              background-color: black;
            }`
          svg.append(style)

          // convert to url
          const data = new XMLSerializer().serializeToString(doc)
          const svgBlob = new Blob([data], {
            type: 'image/svg+xml;charset=utf-8'
          })
          const svgUrl = URL.createObjectURL(svgBlob)

          // Save the file
          saveAs(svgUrl, fileName)
        })
    }
  }
}
</script>

<style>
.graph-line__aspect-ratio--image {
  height: 1200px;
}

.graph-line__image {
  height: 1200px;
  max-width: 100%;
  background-repeat: no-repeat;
  background-size: 50% 100%;
}

.graph-line {
  position: relative;
  min-height: 400px;
}

.graph-line__chart {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 85%;
}

</style>


<template>
  <div>
    <v-container>
      <v-col cols="12" class='graph-line'>
        <v-chart
          v-if='isLine || isScatter'
          :ref='title'
          :option='graphData'
          :autoresize='true'
          class='graph-line__chart'
        />
        <img v-else :src='imageUrl' class='graph-line__image' />
      </v-col>
      <v-col cols="12">
        <v-btn
          v-if="user && (isLine || isScatter)"
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
import { mapGetters, mapState } from 'vuex'
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
  ScatterChart
} from 'echarts/charts'

import {
  GridComponent,
  TooltipComponent,
  MarkLineComponent,
  MarkPointComponent,
  DataZoomComponent
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
  DataZoomComponent
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
        return ['line', 'scatter', 'images'].includes(value)
      }
    },
    parameterId: {
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
    ...mapGetters(['colors']),
    ...mapGetters(['getCollapsedDatasets', 'activeTimestamp']),
    ...mapState(['user']),
    isCollapsed () {
      return this.getCollapsedDatasets.includes(this.parameterId)
    },
    isLine () {
      return this.type === 'line'
    },
    isImage () {
      return this.type === 'images'
    },
    isScatter () {
      return this.type === 'scatter'
    },
    graphData () {
      let series = []
      let markPointCoord = []
      series = this.series.map(serie => {
        let data = serie.map((col, i) => [this.category[i], col])
        // Make sure that all data is in chronological order to plot it correctly
        data = data.sort((colA, colB) => {
          return moment(colA[0]) - moment(colB[0])
        })

        // Create a markpoint if there is a value on the exact timestamp selected
        markPointCoord = data.find(val => {
          const same = moment(val[0]).isSame(moment(this.timeStep))
          return same
        })

        return {
          type: this.type,
          showAllSymbol: true,
          data,
          itemStyle: {
            normal: {
              borderWidth: 1
            }
          }
        }
      })

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
      const dataOptions = {
        series,
        yAxis: {
          name: `${this.title} [${this.units}]`
        }
      }
      const theme = getStyle(this.colors)
      const result = merge(dataOptions, baseOptions, theme)
      return result
    }
  },
  methods: {
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

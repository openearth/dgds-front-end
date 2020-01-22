<template>
  <figure
    class="graph-line"
    :class="{
      'graph-line__collapsible': collapsible,
      'graph-line--collapsed': isCollapsed,
    }"
  >
    <ui-button-icon
      v-if="collapsible"
      class="graph-line__toggle"
      label="Toggle"
      @click="toggleCollapsedDataset(parameterId)"
    >
      <icon-chevron />
    </ui-button-icon>
    <figcaption
      class="graph-line__caption strong"
      @click="toggleCollapsedDataset(parameterId)"
    >
      {{ title }}
    </figcaption>
    <div
      v-if="!isCollapsed"
      class="graph-line__aspect-ratio"
      :class="{ image: type === 'images' }"
    >
      <v-chart
        v-if="type === 'line' || type === 'scatter'"
        :ref="title"
        :options="graphData()"
        :autoresize="true"
        height="100%"
        class="graph-line__chart"
      />
      <img
        v-if="type === 'images'"
        id="graphImage"
        :src="imageUrl"
        class="graph-line__chart"
      >
      <ui-button
        class="download-btn"
        kind="quiet"
        @click="download()"
      >
        DOWNLOAD
      </ui-button>
    </div>
  </figure>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex'
import merge from 'lodash/merge'
import moment from 'moment'
import ECharts from 'vue-echarts'
import { saveAs } from 'file-saver'
import UiButtonIcon from '~/components/ui-button-icon'
import UiButton from '~/components/ui-button'
import IconChevron from '~/assets/icon-action-chevron-down.svg'
import 'echarts/lib/chart/line'
import 'echarts/lib/chart/scatter'
import 'echarts/lib/component/dataZoom'
import 'echarts/lib/component/tooltip'
import 'echarts/lib/component/markLine'

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
  components: { UiButtonIcon, IconChevron, 'v-chart': ECharts, UiButton },
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
    }
  },
  computed: {
    ...mapGetters('preferences/theme', ['colors']),
    ...mapGetters('map', ['getCollapsedDatasets']),
    isCollapsed () {
      return this.getCollapsedDatasets.includes(this.parameterId)
    }
  },
  methods: {
    ...mapMutations('map', ['toggleCollapsedDataset']),
    graphData () {
      let series = []
      series = this.series.map((serie) => {
        let data = serie.map((col, i) => [this.category[i], col])

        // Make sure that all data is in chronological order to plot it correctly
        data = data.sort((colA, colB) => {
          return moment(colA[0]) - moment(colB[0])
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
    },
    download () {
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
    }
  }
}
</script>

<style>
.graph-line__aspect-ratio.image {
  height: 600px;
}

#graphImage {
  background-repeat: no-repeat;
  background-size: 50% 100%;
  height: 600px;
}

.echarts {
  width: 100%;
  height: 100%;
}

.graph-line {
  position: relative;
  --caption-height: 3rem;
}

.graph-line__aspect-ratio {
  height: 0;
  overflow: hidden;
  padding-top: 50%;
  position: relative;
  padding-top: 60%;
  height: ;
}

.graph-line__chart {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 90%;
}

.graph-line__collapsible .graph-line__caption {
  cursor: pointer;
}

.graph-line__toggle {
  position: absolute;
  top: calc(var(--caption-height) / 2);
  right: 0;
  transition: transform 0.25s ease-in-out;
  transform: translateY(-50%);
}

.graph-line--collapsed .graph-line__toggle {
  transform: translateY(-50%) rotate(180deg);
}

.graph-line__caption {
  padding: var(--spacing-small);
  background-color: var(--color-background);
  height: var(--caption-height);
}

#btn-div {
  height: 10%;
  position: absolute;
}
.download-btn {
  right: 0;
  bottom: 0;
  position: absolute;
}
</style>

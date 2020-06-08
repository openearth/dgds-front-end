<template>
  <figure
    :class="{
      'graph-line__collapsible': collapsible,
      'graph-line--collapsed': isCollapsed,
    }"
    class="graph-line"
  >
    <ui-button-icon
      v-if="collapsible"
      @click="toggleCollapsedDataset(parameterId)"
      class="graph-line__toggle"
      label="Toggle"
    >
      <icon name="action-chevron-down" />
    </ui-button-icon>
    <figcaption @click="toggleCollapsedDataset(parameterId)" class="graph-line__caption strong">
      {{ title }}
    </figcaption>
    <div
      v-if="!isCollapsed"
      :class="{ 'graph-line__aspect-ratio--image': isImage }"
      class="graph-line__aspect-ratio"
    >
      <v-chart
        v-if="isLine || isScatter"
        :ref="title"
        :options="graphData"
        :autoresize="true"
        class="graph-line__chart"
      />
      <img v-else :src="imageUrl" class="graph-line__image" />
      <ui-button
        v-if="user && (isLine || isScatter)"
        @click="downloadJson"
        class="graph-line__download"
        kind="secondary"
      >
        Download data
      </ui-button>
      <ui-button
        v-if="user && isImage"
        @click="downloadImage"
        class="graph-line__download"
        kind="secondary"
      >
        Download image
      </ui-button>
      <p v-if="!user" class="graph-line__message">
        <icon name="info" />
        Please log in to download data
      </p>
    </div>
  </figure>
</template>

<script>
  import { mapGetters, mapMutations, mapState } from 'vuex'
  import merge from 'lodash/merge'
  import moment from 'moment'
  import ECharts from 'vue-echarts'
  import { saveAs } from 'file-saver'
  import UiButtonIcon from '~/components/ui-button-icon'
  import UiButton from '~/components/ui-button'
  import Icon from '~/components/icon'
  import 'echarts/lib/chart/line'
  import 'echarts/lib/chart/scatter'
  import 'echarts/lib/component/dataZoom'
  import 'echarts/lib/component/tooltip'
  import 'echarts/lib/component/markLine'
  import 'echarts/lib/component/markPoint'

  const getStyle = (colors = {}) => ({
    backgroundColor: colors.background,
    color: colors.pink,
    textStyle: {
      color: colors.textColor,
    },
    xAxis: {
      axisLine: {
        lineStyle: {
          color: colors.textColor,
        },
      },
    },
    yAxis: {
      axisLine: {
        lineStyle: {
          color: colors.textColor,
        },
      },
      splitLine: {
        lineStyle: {
          color: colors.formBase,
        },
      },
    },
  })

  const baseOptions = {
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow',
      },
    },
    grid: {
      show: true,
      top: 30,
      bottom: 50,
      right: 20,
      left: 90,
    },
    dataZoom: [
      {
        type: 'inside',
        realtime: true,
      },
    ],
    textStyle: {
      fontFamily: 'Helvetica',
    },
    xAxis: {
      type: 'time',
      axisLine: {
        onZero: false,
        show: false,
      },
    },
    yAxis: {
      type: 'value',
      axisLabel: {
        fontSize: 14,
      },
      nameLocation: 'middle',
      nameGap: 55,
      nameTextStyle: {
        fontSize: 14,
        fontFamily: 'Helvetica',
      },
    },
  }

  export default {
    components: { UiButtonIcon, Icon, 'v-chart': ECharts, UiButton },
    props: {
      imageUrl: {
        type: String,
        default: () => '',
      },
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
      units: {
        type: String,
        default: '-',
      },
      type: {
        type: String,
        default: 'line',
        validator(value) {
          // The value must match one of these strings
          return ['line', 'scatter', 'images'].includes(value)
        },
      },
      parameterId: {
        type: String,
        default: '',
      },
      setMarkPoint: {
        type: Boolean,
        default: false,
      },
      timeStep: {
        type: String,
        default: '',
      },
    },
    computed: {
      ...mapGetters('preferences/theme', ['colors']),
      ...mapGetters('map', ['getCollapsedDatasets', 'activeTimestamp']),
      ...mapState('preferences', ['user']),
      isCollapsed() {
        return this.getCollapsedDatasets.includes(this.parameterId)
      },
      isLine() {
        return this.type === 'line'
      },
      isImage() {
        return this.type === 'images'
      },
      isScatter() {
        return this.type === 'scatter'
      },
    },
    methods: {
      ...mapMutations('map', ['toggleCollapsedDataset']),
      graphData() {
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
                borderWidth: 1,
              },
            },
          }
        })

        if (this.timeStep !== '') {
          series.push({
            type: this.type,
            markPoint: {
              data: [
                {
                  coord: markPointCoord,
                  symbolSize: 30,
                },
              ],
            },
          })
        }
        series.push({
          type: 'line',
          markLine: {
            silent: true,
            data: [
              {
                xAxis: moment().format(),
              },
            ],
            lineStyle: { color: 'white' },
          },
        })
        const dataOptions = {
          series,
          yAxis: {
            name: `${this.title} [${this.units}]`,
          },
        }
        const theme = getStyle(this.colors)
        const result = merge(dataOptions, baseOptions, theme)
        return result
      },
      downloadJson() {
        const fileName = `${this.title}.json`

        const data = {
          title: this.title,
          timeseries: this.series,
          units: this.units,
          dates: this.category,
        }
        // Create a blob of the data
        const fileToSave = new Blob([JSON.stringify(data)], {
          type: 'application/json',
          name: fileName,
        })

        // Save the file
        saveAs(fileToSave, fileName)
      },
      downloadImage() {
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
              type: 'image/svg+xml;charset=utf-8',
            })
            const svgUrl = URL.createObjectURL(svgBlob)

            // Save the file
            saveAs(svgUrl, fileName)
          })
      },
    },
  }
</script>

<style>
  .graph-line__aspect-ratio.image {
    height: 1200px;
  }

  .graph-image {
    height: 1200px;
    background-repeat: no-repeat;
    background-size: 50% 100%;
  }

  .graph-line {
    position: relative;
  }

  .graph-line__aspect-ratio {
    position: relative;
    min-height: 400px;
  }

  .graph-line__aspect-ratio--image {
    height: 600px;
  }

  .graph-line__chart {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 85%;
  }

  .graph-line__image {
    height: 600px;
    background-repeat: no-repeat;
    background-size: 50% 100%;
  }

  .graph-line__collapsible .graph-line__caption {
    cursor: pointer;
  }

  .graph-line__toggle {
    position: absolute;
    right: 0;
  }

  .graph-line__toggle .icon {
    transition: transform 0.25s ease-in-out;
  }

  .graph-line--collapsed .graph-line__toggle .icon {
    transform: rotate(180deg);
  }

  .graph-line__caption {
    height: 3rem;
    padding: var(--spacing-small);
    background-color: var(--color-background);
  }

  .graph-line__download,
  .graph-line__message {
    position: absolute;
    right: 0;
    bottom: 0;
  }

  .graph-line__download {
    text-transform: uppercase;
  }

  .graph-line__message {
    display: flex;
    align-items: center;
  }

  .graph-line__message .icon {
    width: 20px;
    height: 20px;
    margin-right: 0.5rem;
  }
</style>

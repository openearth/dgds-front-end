<template>
  <div>
    <v-autocomplete
      v-model="selectedParameter1"
      :items="parameter1Options"
      item-value="value"
      item-text="label"
      label="First parameter"
      clearable
      return-object
      persistent-counter
      :disabled="isLoading"
      @change="selectParameter1"
    >
      <template #item="data">
        <v-list-item-content>
          <v-list-item-title>
            <span v-html="data.item.label" />
          </v-list-item-title>
        </v-list-item-content>
      </template>
      <template #selection="data">
        <span v-html="data.item.label" />
      </template>
    </v-autocomplete>
    <v-autocomplete
      v-model="selectedParameter2"
      :items="parameter2Options"
      item-value="value"
      item-text="label"
      label="Second parameter"
      clearable
      return-object
      persistent-counter
      :disabled="isLoading"
      @change="selectParameter2"
    >
      <template #item="data">
        <v-list-item-content>
          <v-list-item-title>
            <span v-html="data.item.label" />
          </v-list-item-title>
        </v-list-item-content>
      </template>
      <template #selection="data">
        <span v-html="data.item.label" />
      </template>
    </v-autocomplete>
    <div v-if="selectionBox">
      <v-select
        v-model="selectionBox.value"
        :items="selectionBox.options"
        :label="selectionBox.title"
        :disabled="isLoading"
        @change="selectParameter3"
      />
    </div>
    <div style="width: 100%; height: 400px; margin: 8px 0px">
      <v-chart
        ref="rosePlot"
        class="chart"
        :option="roseOption"
        autoresize
      />
    </div>
  </div>
</template>

<script>
import VChart, { THEME_KEY } from 'vue-echarts'
import { mapActions } from 'vuex'

export default {
  components: {
    VChart
  },
  provide() {
    return {
      [THEME_KEY]: 'dark'
    }
  },
  props: {
    locationId: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      parameters: [],
      parameterLookup: [],
      parameter1Options: [],
      parameter2Options: [],
      selectedParameter1: {},
      selectedParameter2: {},

      selectionBox: null,

      classes: [],
      data: [],
      roseOption: {
        tooltip: {
          trigger: 'item',
          confine: true,
          padding: 4,
          textStyle: {
            fontSize: 12
          },
          formatter: function (e) {
            let tooltip = '<table>'

            Object.keys(e.data).forEach((key, i) => {
              let value = e.data[key]
              if (typeof value === 'number') {
                value = value.toLocaleString('en-US', {
                  maximumFractionDigits: 4
                })
              }
              if (i === 0) {
                tooltip += `<tr><td>${e.marker}</td><td style="padding-right:8px;">${this.transformLabel(e.dimensionNames[i])}:</td><td><b>${value}</b></td></tr>`
              } else {
                tooltip += `<tr><td></td><td style="padding-right:8px;">${this.transformLabel(e.dimensionNames[i])}:</td><td><b>${value}</b></td></tr>`
              }
            })

            tooltip += '</table>'

            return tooltip
          }.bind(this),
          textStyle: {
            color: '#000'
          }
        },
        angleAxis: {},
        radiusAxis: {
          axisLabel: {
            show: true,
            textStyle: {
              color: 'white',
              fontWeight: 'bold',
              textShadowColor: 'black',
              textShadowBlur: 4
            },
            formatter: function (e) {
              return `${e}%`
            }
          },
          axisTick: {
            show: false
          },
          axisLine: {
            show: false
          }
        },
        polar: {
          center: ['40%', '50%'],
          radius: '80%'
        },
        color: [
          '#F5DA4D',
          '#F2CD47',
          '#FCAE12',
          '#F99711',
          '#F78211',
          '#F36D23',
          '#E75D2F',
          '#D74B36',
          '#CB4149',
          '#B73C53',
          '#A92E5E',
          '#962C62',
          '#85216B',
          '#73216E',
          '#60136E',
          '#4F1164',
          '#3A0A63',
          '#2D0B54',
          '#140B35',
          '#0F082A',
          '#0B061E'
        ],
        backgroundColor: 'transparent'
      },

      isLoading: false
    }
  },
  watch: {
    locationId(newLocationId) {
      if (newLocationId) {
        this.getChartData()
      }
    }
  },
  mounted() {
    this.fetchParameters()
  },
  methods: {
    ...mapActions(['loadNonTimeGraphDataForLocation']),
    transformLabel(label) {
      label = label.replace(/_\{([^}]+)\}/g, '<sub>$1</sub>')
      label = label.replace(/\^\{([^}]+)\}/g, '<sup>$1</sup>')
      label = label.replace(/\{circ\}/g, '°')

      return label
    },
    fetchParameters() {
      fetch(`/static/data/JOT-parameters.json`)
        .then((response) => response.json())
        .then((json) => {
          this.parameters = json.map((j) => ({
            parameter1: {
              ...j.parameter1,
              label: this.transformLabel(j.parameter1.label)
            },
            parameter2: {
              ...j.parameter2,
              label: this.transformLabel(j.parameter2.label)
            }
          }))

          this.populateParameter1Options()
          this.populateParameter2Options()
        })
      fetch(`/static/data/JOT-definition.json`)
        .then((response) => response.json())
        .then((json) => {
          this.definition = json || []
        })
      fetch(`/static/data/JOT-bins.json`)
        .then((response) => response.json())
        .then((json) => {
          this.bins = json || []
        })
    },
    selectParameter1(value) {
      this.selectedParameter1 = value
      this.updateParameter2Options()
    },
    selectParameter2(value) {
      this.selectedParameter2 = value
      this.updateParameter1Options()
    },
    selectParameter3(value) {
      this.selectionBox.value = value
      this.updateChart()
    },
    populateParameter1Options() {
      const uniqueParameter1Options = [
        ...new Set(this.parameters.map((item) => item.parameter1))
      ]
      this.parameter1Options = uniqueParameter1Options
    },
    populateParameter2Options() {
      const uniqueParameter2Options = [
        ...new Set(this.parameters.map((item) => item.parameter2))
      ]
      this.parameter2Options = uniqueParameter2Options
    },
    updateParameter2Options() {
      if (this.selectedParameter1) {
        this.parameter2Options = this.parameters
          .filter((item) => item.parameter1 === this.selectedParameter1)
          .map((item) => item.parameter2)
      } else {
        this.populateParameter2Options()
      }

      this.$nextTick(() => {
        this.getChartData()
      })
    },
    updateParameter1Options() {
      if (this.selectedParameter2) {
        this.parameter1Options = this.parameters
          .filter((item) => item.parameter2 === this.selectedParameter2)
          .map((item) => item.parameter1)
      } else {
        this.populateParameter1Options()
      }

      this.$nextTick(() => {
        this.getChartData()
      })
    },
    getChartData() {
      let parameter
      if (this.selectedParameter1?.value && this.selectedParameter2?.value) {
        parameter = `JOT-${this.selectedParameter1.value}-${this.selectedParameter2.value}`
      }

      if (!parameter) {
        this.data = []
        this.$nextTick(() => {
          this.updateChart()
        })
        return
      }

      const jot = this.definition[parameter]
      if (jot?.selection_box) {
        this.selectionBox = jot.selection_box
        this.selectionBox.value = jot.selection_box?.options?.[0]
      } else {
        this.selectionBox = null
      }

      this.loadNonTimeGraphDataForLocation({
        parameter: parameter,
        month: null,
        graph: 'roseplot_jot_values'
      }).then((pointData) => {
        const { data } = pointData

        this.data = data.arrayData[0]

        this.angleAxis = {
          ...jot.parameter2,
          data: this.bins[jot.parameter2.bin]
        }
        this.classesAxis = {
          ...jot.parameter1,
          data: this.bins[jot.parameter1.bin].reverse()
        }

        this.$nextTick(() => {
          this.updateChart()
        })
      })
    },
    createSeriesData(data) {
      return this.classesAxis.data.map((classe, index) => {
        const seriesData = Array.from(data[index]).map((d, i) => {
          return {
            class: classe,
            direction: this.angleAxis.data[i],
            value: d
          }
        })

        return {
          name: classe,
          type: 'bar',
          coordinateSystem: 'polar',
          data: seriesData,
          stack: 'stack1',
          z: 0,
          dimensions: ['class', 'direction', 'value']//[this.classesAxis.bin, this.angleAxis.bin, 'Value']
        }
      })
    },
    updateChart() {
      let dataForSelection

      if (this.selectionBox) {
        const indexOfSelection = this.selectionBox.options.indexOf(
          this.selectionBox.value
        )
        dataForSelection = this.data[indexOfSelection]
      } else {
        dataForSelection = this.data
      }

      const instance = this.$refs.rosePlot?.chart

      if (instance) {
        if (!dataForSelection || dataForSelection?.length === 0) {
          instance.setOption(
            {
              series: [],
              legend: {}
            },
            {
              replaceMerge: ['series', 'legend']
            }
          )

          return
        }

        this.isLoading = true
        instance.setOption({ series: [] }, { replaceMerge: ['series'] })

        instance.showLoading({
          text: 'Loading data...',
          color: '#409EFF',
          textColor: 'rgba(0,0,0,1)',
          maskColor: 'rgba(220, 220, 220, 0.8)',
          zlevel: 0
        })

        instance.on('rendered', () => {
          if (instance.getOption().series?.length > 0) {
            this.isLoading = false
            instance.hideLoading()

            instance.off('rendered')
          }
        })

        instance.setOption(
          {
            toolbox: {
              top: 0,
              left: 8,
              feature: {
                saveAsImage: {
                  name: 'Extreme_values',
                  title: 'Save as image',
                  type: 'png',
                  icon: 'M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2M8.9 13.98l2.1 2.53 3.1-3.99c.2-.26.6-.26.8.01l3.51 4.68c.25.33.01.8-.4.8H6.02c-.42 0-.65-.48-.39-.81L8.12 14c.19-.26.57-.27.78-.02',
                  emphasis: {
                    iconStyle: {
                      borderColor: '#fff'
                    }
                  }
                },
                myFeature: {
                  show: true,
                  name: 'Extreme_values',
                  title: 'Download as CSV',
                  icon: 'M16.59 9H15V4c0-.55-.45-1-1-1h-4c-.55 0-1 .45-1 1v5H7.41c-.89 0-1.34 1.08-.71 1.71l4.59 4.59c.39.39 1.02.39 1.41 0l4.59-4.59c.63-.63.19-1.71-.7-1.71M5 19c0 .55.45 1 1 1h12c.55 0 1-.45 1-1s-.45-1-1-1H6c-.55 0-1 .45-1 1',
                  onclick: () => {
                    this.downloadAsCSV(
                      ['class', 'direction', 'value'],
                      'Rose_plot'
                    )
                  },
                  emphasis: {
                    iconStyle: {
                      borderColor: '#fff'
                    }
                  }
                }
              }
            },
            angleAxis: {
              type: 'category',
              data: this.angleAxis.data,
              boundaryGap: false,
              axisTick: {
                show: true
              },
              splitLine: {
                show: true
              },
              axisLabel: {
                show: true,
                interval: 0
              }
            },
            series: this.createSeriesData(dataForSelection),
            legend: {
              orient: 'vertical',
              type: 'scroll',
              show: true,
              top: 0,
              right: 0,
              pageIconColor: "rgba(255,255,255,0.9)",
              pageIconInactiveColor: "rgba(255,255,255,0.4)",
              pageTextStyle: {
                color: "rgba(255,255,255,0.7)",
              }
            }
          },
          {
            replaceMerge: ['toolbox', 'angleAxis', 'series', 'legend']
          }
        )
      }
    },
    downloadAsCSV(keys, filename) {
      const instance = this.$refs.rosePlot?.chart
      if (instance) {
        const option = instance.getOption()

        // Get the current state of the legend (which series are selected/visible)
        const legend = option.legend[0].selected

        // Add header row to CSV
        let csvContent = `data:text/csv;charset=utf-8,${keys.join(',')} \r\n`

        // Retrieve visible data from the current state (respect dataZoom)
        const zoomStart = option.dataZoom?.[0]?.start / 100 || 0
        const zoomEnd = option.dataZoom?.[0]?.end / 100 || 1

        option.series.forEach((serie) => {
          if (serie.data && legend[serie.name] !== false) {
            const startIndex = Math.floor(zoomStart * serie.data.length)
            const endIndex = Math.ceil(zoomEnd * serie.data.length)

            // Process the visible data range for this series
            serie.data.slice(startIndex, endIndex).forEach((point) => {
              keys.forEach((key, keyIndex) => {
                csvContent += keyIndex === 0 ? point[key] : `, ${point[key]}`
              })
              csvContent += '\r\n'
            })
          }
        })

        const encodedUri = encodeURI(csvContent)
        const link = document.createElement('a')
        link.setAttribute('href', encodedUri)
        link.setAttribute('download', `${filename}.csv`)
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
      }
    }
  }
}
</script>

<style scoped>
::v-deep .v-select__selections {
  white-space: nowrap;
}
.v-select__selections span {
  text-overflow: ellipsis;
  overflow: hidden;
  max-width: 99%;
}
::v-deep .v-autocomplete.v-select.v-input--is-focused input {
  min-width: 0;
}
</style>

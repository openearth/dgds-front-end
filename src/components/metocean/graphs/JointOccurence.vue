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
    <div
      :style="{ height: chartHeight + 'px' }"
      style="width: 100%; margin: 8px 0px"
    >
      <v-chart
        ref="jointOccurence"
        class="chart"
        :option="jointOccurenceOption"
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
    return { [THEME_KEY]: 'dark' }
  },
  props: {
    locationId: {
      type: [String, Number],
      default: ''
    }
  },
  data() {
    return {
      chartHeight: 400,
      parameters: [],
      parameterLookup: [],
      parameter1Options: [],
      parameter2Options: [],
      selectedParameter1: {},
      selectedParameter2: {},

      selectionBox: null,

      data: [],
      jointOccurenceOption: {
        tooltip: {
          position: 'top',
          confine: true,
          padding: 4,
          textStyle: {
            fontSize: 14
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
          }.bind(this)
        },
        grid: {
          containLabel: true,
          top: 75,
          right: 0,
          bottom: 16,
          left: 28
        },
        xAxis: {},
        yAxis: {},
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
    transformLabelWithRichText(label) {
      return label
        .replace(/_\{([^}]+)\}/g, '{sub|$1}')
        .replace(/\^\{([^}]+)\}/g, '{sup|$1}')
        .replace(/\{circ\}/g, '°')
    },
    fetchParameters() {
      fetch(`/static/data/JOT-parameters.json`)
        .then((response) => response.json())
        .then((json) => {
          this.parameters = json
            .filter((j) => j.jot)
            .map((j) => ({
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

        this.xAxis = {
          ...jot.parameter2,
          data: this.bins[jot.parameter2.bin]
        }
        this.yAxis = {
          ...jot.parameter1,
          data: this.bins[jot.parameter1.bin]
        }

        const newHeight = 120 + this.bins[jot.parameter1.bin].length * 20
        this.chartHeight = newHeight

        this.$nextTick(() => {
          const instance = this.$refs.jointOccurence?.chart
          instance?.resize('100%', newHeight, true)

          this.updateChart()
        })
      })
    },
    isValueInRange(range, value) {
      const min = Math.min(...range)
      const max = Math.max(...range)

      return value >= min && value <= max
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

      const instance = this.$refs.jointOccurence?.chart

      if (instance) {
        if (!dataForSelection || dataForSelection?.length === 0) {
          instance.setOption(
            {
              xAxis: {},
              yAxis: {},
              visualMap: null,
              series: []
            },
            {
              replaceMerge: ['xAxis', 'yAxis', 'visualMap', 'series']
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

        const xAxisTotals = this.xAxis.data
          ? new Array(this.xAxis.data.length).fill(0)
          : []
        const yAxisTotals = this.yAxis.data
          ? new Array(this.yAxis.data.length).fill(0)
          : []

        const seriesData = []
        let min = 0
        let max = 0

        const option = instance.getOption()
        const visualMap = option.visualMap?.[0]?.range

        dataForSelection.forEach((selection, yIndex) => {
          const currentYAxis = this.yAxis.data[yIndex]

          this.xAxis.data.forEach((xAxisValue, xIndex) => {
            let value = selection[xIndex]
            value = value != null && !isNaN(value) ? parseFloat(value) : 0

            yAxisTotals[yIndex] += parseFloat(value)
            xAxisTotals[xIndex] += parseFloat(value)

            seriesData.push([
              xAxisValue,
              currentYAxis,
              value === 0 ? null : value
            ])

            if (value > max) {
              max = value
            }
          })
        })

        instance.setOption(
          {
            toolbox: {
              top: 0,
              left: 8,
              feature: {
                saveAsImage: {
                  name: 'Joint_occurence',
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
                  name: 'Joint_occurence',
                  title: 'Download as CSV',
                  icon: 'M16.59 9H15V4c0-.55-.45-1-1-1h-4c-.55 0-1 .45-1 1v5H7.41c-.89 0-1.34 1.08-.71 1.71l4.59 4.59c.39.39 1.02.39 1.41 0l4.59-4.59c.63-.63.19-1.71-.7-1.71M5 19c0 .55.45 1 1 1h12c.55 0 1-.45 1-1s-.45-1-1-1H6c-.55 0-1 .45-1 1',
                  onclick: () => {
                    this.downloadAsCSV(
                      [this.xAxis.bin, this.yAxis.bin, 'value'],
                      'Joint_occurence'
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
            xAxis: [
              {
                name: this.transformLabelWithRichText(this.xAxis.title),
                nameLocation: 'center',
                nameTextStyle: {
                  fontSize: 14,
                  fontWeight: 600,
                  rich: {
                    sub: {
                      fontSize: 10,
                      verticalAlign: 'bottom'
                    },
                    sup: {
                      fontSize: 10,
                      verticalAlign: 'top'
                    }
                  }
                },
                nameGap: 40,
                type: 'category',
                position: 'top',
                splitArea: {
                  show: true
                },
                axisTick: {
                  interval: 0,
                  alignWithLabel: false
                },
                axisLabel: {
                  align: 'right',
                  interval: 0,
                  margin: 10,
                  rotate: 30
                }
              },
              {
                type: 'category',
                data: xAxisTotals.map((t) => t.toFixed(2)),
                position: 'bottom',
                splitArea: {
                  show: true
                },
                axisTick: {
                  interval: 0,
                  alignWithLabel: false
                },
                axisLabel: {
                  align: 'right',
                  color: '#ffffff',
                  interval: 0,
                  margin: 10,
                  rotate: 30
                }
              }
            ],
            yAxis: [
              {
                name: this.transformLabelWithRichText(this.yAxis.title),
                nameLocation: 'center',
                nameTextStyle: {
                  fontSize: 14,
                  fontWeight: 600,
                  rich: {
                    sub: {
                      fontSize: 10,
                      verticalAlign: 'bottom'
                    },
                    sup: {
                      fontSize: 10,
                      verticalAlign: 'top'
                    }
                  }
                },
                nameGap: 68,
                type: 'category',
                position: 'left',
                splitArea: {
                  show: true
                },
                axisTick: {
                  interval: 0,
                  alignWithLabel: false
                },
                axisLabel: {
                  interval: 0,
                  margin: 10,
                  rotate: 0
                }
              },
              {
                name: 'Total (100)',
                nameLocation: 'start',
                nameGap: 24,
                type: 'category',
                position: 'right',
                data: yAxisTotals.map((t) => t.toFixed(2)),
                nameTextStyle: {
                  color: '#ffffff',
                  fontSize: 12,
                  fontWeight: 600
                },
                splitArea: {
                  show: true
                },
                axisTick: {
                  interval: 0,
                  alignWithLabel: false
                },
                axisLabel: {
                  color: '#ffffff',
                  interval: 0,
                  margin: 10,
                  rotate: 0
                }
              }
            ],
            visualMap: {
              min: min,
              max: max,
              range: visualMap
                ? [
                    visualMap[0] >= min ? visualMap[0] : min,
                    max // visualMap[1] <= max ? visualMap[1] : max
                  ]
                : [min, max],
              calculable: true,
              right: 0,
              top: 0,
              orient: 'horizontal',
              inRange: {
                color: ['#fff', '#faf9f0', '#f6efa6', '#d88273', '#bf444c']
              },
              outOfRange: {
                color: '#c1c1c1'
              }
            },
            series: [
              {
                type: 'heatmap',
                data: seriesData,
                dimensions: [this.xAxis.bin, this.yAxis.bin, 'value'],
                label: {
                  show: true,
                  align: 'center',
                  verticalAlign: 'center',
                  formatter: (e) => {
                    return e.data[2].toLocaleString('en-US', {
                      maximumFractionDigits: 1
                    })
                  }
                },
                itemStyle: {
                  borderWidth: 0.2,
                  borderColor: '#000',
                  borderType: 'solid'
                },
                emphasis: {
                  itemStyle: {
                    shadowBlur: 1
                  }
                }
              }
            ]
          },
          {
            replaceMerge: ['toolbox', 'xAxis', 'yAxis', 'visualMap', 'series']
          }
        )
      }
    },
    downloadAsCSV(keys, filename) {
      const instance = this.$refs.jointOccurence?.chart
      if (instance) {
        const option = instance.getOption()

        // Get the current range of the visualMap (which series are selected/visible)
        const visualMap = option.visualMap[0].range

        // Add header row to CSV
        let csvContent = `data:text/csv;charset=utf-8,${keys.join(',')} \r\n`

        // Retrieve visible data from the current state (respect dataZoom)
        const zoomStart = option.dataZoom?.[0]?.start / 100 || 0
        const zoomEnd = option.dataZoom?.[0]?.end / 100 || 1

        option.series.forEach((serie) => {
          if (serie.data) {
            const startIndex = Math.floor(zoomStart * serie.data.length)
            const endIndex = Math.ceil(zoomEnd * serie.data.length)

            // Process the visible data range for this series
            serie.data
              .filter((point) =>
                this.isValueInRange(visualMap, parseFloat(point[2]))
              )
              .slice(startIndex, endIndex)
              .forEach((point) => {
                keys.forEach((key, keyIndex) => {
                  const indexOfKey = serie.dimensions.indexOf(key)

                  csvContent +=
                    keyIndex === 0
                      ? point[indexOfKey]
                      : `, ${point[indexOfKey]}`
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

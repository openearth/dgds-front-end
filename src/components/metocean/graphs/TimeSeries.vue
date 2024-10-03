<template>
  <div>
    <div v-if="parameters?.length > 0">
      <v-autocomplete
        v-model="selectedParameter"
        :items="parameters"
        item-value="value"
        item-text="label"
        label="Parameter"
        clearable
        return-object
        persistent-counter
        :disabled="isLoading"
        @change="selectParameter"
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
    </div>
    <div v-else>
      Loading parameters...
    </div>
    <div
      style="width: 100%; height: 400px; margin: 8px 0px; position: relative"
    >
      <div
        data-v-step="6"
        style="position: absolute; top: 12px; right: 0"
      />
      <v-chart
        ref="timeseries"
        :option="timeseriesOption"
        :autoresize="true"
      />
    </div>
  </div>
</template>

<script>
import moment from 'moment'
import VChart, { THEME_KEY } from 'vue-echarts'
import { mapActions, mapGetters } from 'vuex'
import 'echarts'

export default {
  components: {
    VChart
  },
  provide() {
    return { [THEME_KEY]: 'dark' }
  },
  props: {
    locationDataset: {
      type: [String],
      default: ''
    },
    locationId: {
      type: [String, Number],
      default: ''
    }
  },
  data() {
    return {
      timeseriesOption: {
        animation: false,
        toolbox: this.getToolbox(),
        tooltip: {
          trigger: 'axis',
          confine: true,
          padding: 4,
          textStyle: {
            fontSize: 12
          },
          formatter: function (e) {
            let tooltip = ''
            e.forEach((serie) => {
              tooltip += `${serie.marker} <b style="font-weight:bold;">${this.transformLabel(serie.seriesName)}:</b><br/>`

              const value = serie.data.value.toLocaleString('en-US', {
                maximumFractionDigits: 2
              })
              tooltip += '<table>'
              tooltip += `<tr><td>${moment(serie.data['Date+Time']).format('DD-MM-YYYY HH')}: <b>${value}<b/></td></tr>`
              tooltip += '</table>'
            })
            return tooltip
          }.bind(this)
        },
        grid: {
          containLabel: true,
          top: 48,
          right: 8,
          bottom: 96,
          left: 8
        },
        yAxis: {
          scale: true
        },
        xAxis: {
          name: 'Datetime',
          nameLocation: 'center',
          type: 'category',
          nameGap: 30,
          axisLabel: {
            formatter: function (value) {
              return moment(Number(value)).format('DD-MM-YYYY')
            }
          }
        },
        color: ['#F78211'],
        backgroundColor: 'transparent'
      },
      parameters: [],
      selectedParameter: {},

      data: [],
      isLoading: false
    }
  },
  watch: {
    locationDataset: {
      immediate: true,
      handler(newLocationDataset) {
        this.fetchParameters(newLocationDataset)
      }
    },
    locationId(newLocationId) {
      if (newLocationId) {
        this.getChartData()
      }
    }
  },
  computed: {
    ...mapGetters(['colors', 'user'])
  },
  mounted() {},
  methods: {
    ...mapActions(['loadGraphDataForLocation']),
    ...mapGetters(['getActiveLocationName']),
    transformLabel(label) {
      label = label.replace(/_\{([^}]+)\}/g, '<sub>$1</sub>')
      label = label.replace(/\^\{([^}]+)\}/g, '<sup>$1</sup>')
      label = label.replace(/\{circ\}/g, '°')

      return label
    },
    replaceSubSupTags(label) {
      return label
        .replace(/<sub>/g, '')
        .replace(/<\/sub>/g, '')
        .replace(/<sup>/g, '')
        .replace(/<\/sup>/g, '')
    },
    fetchParameters(dataset) {
      let fileName = 'TimeserieParameters'
      if (dataset === 'metocean_WRA_points2') {
        fileName = 'TimeserieParameters-WRA'
      }

      fetch(`/static/data/${fileName}.json`)
        .then((response) => response.json())
        .then((parameters) => {
          this.parameters = parameters.map((parameter) => ({
            ...parameter,
            label: this.transformLabel(parameter.label)
          }))

          this.selectParameter()
          // this.selectParameter(this.parameters[0])
        })
    },
    getStepInterval(data, key) {
      const firstDate = moment(data[0][key])
      const lastDate = moment(data[1][key])
      const diff = lastDate.diff(firstDate, 'days')

      if (diff >= 1) {
        return 'days'
      } else {
        return 'hours'
      }
    },
    getAverageStepInterval(data, key) {
      if (data.length < 2) return 'days'

      let totalDiff = 0

      for (let i = 1; i < data.length; i++) {
        const prevDate = moment(data[i - 1][key])
        const currDate = moment(data[i][key])
        totalDiff += currDate.diff(prevDate, 'hours')
      }

      const averageDiff = totalDiff / (data.length - 1)

      if (averageDiff >= 24) {
        return 'days'
      } else {
        return 'hours'
      }
    },
    getIndexForTimePeriod(period, years) {
      const numDaysInYear = 365
      const numHoursInDay = 24

      if (period === 'days') {
        return numDaysInYear * years
      } else if (period === 'hours') {
        return numHoursInDay * numDaysInYear * years
      } else {
        return 0
      }
    },
    updateChart() {
      const instance = this.$refs.timeseries?.chart

      if (instance) {
        if (!this.data || this.data?.length === 0) {
          instance.setOption(
            {
              title: {},
              toolbox: {},
              xAxis: {
                name: 'Datetime',
                nameLocation: 'center',
                type: 'category',
                nameGap: 30,
                data: []
              },
              dataZoom: [
                {
                  type: 'inside',
                  startValue: 0,
                  endValue: 100
                },
                {
                  height: 48,
                  right: 8,
                  bottom: 16,
                  left: 8
                }
              ],
              series: []
            },
            {
              replaceMerge: ['title', 'xAxis', 'dataZoom', 'series']
            }
          )
          return
        }

        const stepInterval = this.getStepInterval(this.data, 'Date+Time')
        // const stepInterval = this.getAverageStepInterval(this.data, 'Date+Time')
        const indexForYears = this.getIndexForTimePeriod(stepInterval, 10)

        const locationName = this.getActiveLocationName()

        instance.setOption(
          {
            title: {
              top: -10,
              left: 0,
              subtext: this.createTitleText(),
              subtextStyle: {
                width: instance.getWidth() - 64,
                fontSize: 10,
                overflow: 'truncate'
              }
            },
            toolbox: this.getToolbox(locationName),
            yAxis: {
              scale: true
            },
            xAxis: {
              name: 'Datetime',
              nameLocation: 'center',
              type: 'category',
              nameGap: 30,
              axisLabel: {
                formatter: function (value) {
                  return moment(Number(value)).format('DD-MM-YYYY')
                }
              },
              data: this.data.map((d, i) => {
                const value = moment(d['Date+Time']).valueOf()
                return value
              })
            },
            dataZoom: [
              {
                type: 'inside',
                startValue: Math.max(0, this.data.length - indexForYears),
                endValue: this.data.length
              },
              {
                height: 48,
                right: 8,
                bottom: 16,
                left: 8,
                labelFormatter: function (value, valueStr) {
                  return moment(Number(valueStr)).format('DD-MM-YYYY')
                }
              }
            ],
            legend: {
              orient: 'vertical',
              show: true,
              top: 32,
              right: 0
            },
            series: [
              {
                name: 'Time series', //this.selectedParameter.label,
                data: this.data.map((d, i) => {
                  return {
                    value: d[this.selectedParameter.value],
                    ...d
                  }
                }),
                showSymbol: false,
                symbolSize: 8,
                type: 'line'
              }
            ]
          },
          {
            replaceMerge: [
              'toolbox',
              'yAxis',
              'xAxis',
              'dataZoom',
              'legend',
              'series'
            ]
          }
        )
      }
    },
    getChartData() {
      if (!this.selectedParameter || !this.selectedParameter?.value) {
        this.data = []
        this.$nextTick(() => {
          this.updateChart()
        })
        return
      }

      const instance = this.$refs.timeseries?.chart
      if (instance) {
        this.isLoading = true
        instance.setOption(
          {
            toolbox: this.getToolbox(),
            series: []
          },
          { replaceMerge: ['toolbox', 'series'] }
        )

        instance.showLoading({
          text: 'Loading data...',
          color: '#409EFF',
          textColor: 'rgba(0,0,0,1)',
          maskColor: 'rgba(220, 220, 220, 0.8)',
          zlevel: 0
        })

        instance.on('rendered', () => {
          if (instance.getOption()?.series?.length > 0) {
            this.isLoading = false
            instance.hideLoading()

            instance.off('rendered')
          }
        })
      }

      this.loadGraphDataForLocation({
        parameter: this.selectedParameter.value,
        graph: 'time_series'
      }).then((pointData) => {
        const { data } = pointData

        this.data = data.serie.data.map((value, index) => ({
          'Date+Time': data.category[index],
          value
        }))

        this.$nextTick(() => {
          this.updateChart()
        })
      })
    },
    selectParameter(parameter) {
      this.selectedParameter = parameter
      this.getChartData()
    },
    downloadAsCSV(keys, filename) {
      const instance = this.$refs.timeseries?.chart

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
    },
    createTitleText() {
      let title = ''
      if (this.selectedParameter) {
        title += `Parameter: ${this.replaceSubSupTags(this.selectedParameter.label)} \n`
      }

      return title
    },
    getToolbox(locationName) {
      const fileName = locationName
        ? `Time_series_${locationName}`
        : 'Time_series'

      return {
        top: 0,
        right: 8,
        feature: {
          saveAsImage: {
            backgroundColor: '#1E1E1E',
            name: fileName,
            title: 'Sav as image',
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
            name: fileName,
            title: 'Download as CSV',
            icon: 'M16.59 9H15V4c0-.55-.45-1-1-1h-4c-.55 0-1 .45-1 1v5H7.41c-.89 0-1.34 1.08-.71 1.71l4.59 4.59c.39.39 1.02.39 1.41 0l4.59-4.59c.63-.63.19-1.71-.7-1.71M5 19c0 .55.45 1 1 1h12c.55 0 1-.45 1-1s-.45-1-1-1H6c-.55 0-1 .45-1 1',
            onclick: () => {
              this.downloadAsCSV(['Date+Time', 'value'], fileName)
            },
            emphasis: {
              iconStyle: {
                borderColor: '#fff'
              }
            }
          }
        }
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

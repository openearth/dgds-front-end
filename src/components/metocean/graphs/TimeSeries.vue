<template>
  <div>
    <div v-if="parameters.length > 0">
      <v-autocomplete
        v-model="selectedParameter"
        :items="parameters"
        item-value="value"
        item-text="label"
        label="Parameter"
        clearable
        return-object
        persistent-counter
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
    <div v-if="selectedParameter?.value">
      <div v-if="data.length > 0">
        <v-spacer />
        <v-menu offset-y>
          <template #activator="{ on }">
            Start Date
            <v-btn
              text
              v-on="on"
            >
              {{ selectedStartDate }}
              <v-icon right>
                mdi-calendar
              </v-icon>
            </v-btn>
          </template>
          <v-date-picker
            v-model="selectedStartDate"
            scrollable
          >
            <v-spacer />
            <v-btn
              text
              @click="closeStartDatePicker"
            >
              Cancel
            </v-btn>
            <v-btn
              text
              @click="applyStartDatePicker"
            >
              Apply
            </v-btn>
          </v-date-picker>
        </v-menu>
        <v-spacer />
        <v-menu offset-y>
          <template #activator="{ on }">
            End Date
            <v-btn
              text
              v-on="on"
            >
              {{ selectedEndDate }}
              <v-icon right>
                mdi-calendar
              </v-icon>
            </v-btn>
          </template>
          <v-date-picker
            v-model="selectedEndDate"
            scrollable
          >
            <v-spacer />
            <v-btn
              text
              @click="closeEndDatePicker"
            >
              Cancel
            </v-btn>
            <v-btn
              text
              @click="applyEndDatePicker"
            >
              Apply
            </v-btn>
          </v-date-picker>
        </v-menu>
        <div style="width: 100%; height: 400px; margin: 8px 0px">
          <v-chart
            :option="timeseriesOption"
            :autoresize="true"
            :group="'timeseriesv3'"
          />
        </div>
      </div>
      <div v-else>
        Loading data...
      </div>
    </div>
    <div v-else>
      Select a parameter
    </div>
  </div>
</template>

<script>
import * as echarts from 'echarts'
import moment from 'moment'
import VChart, { THEME_KEY } from 'vue-echarts'
import { mapActions, mapGetters } from 'vuex'

export default {
  components: {
    VChart
  },
  provide() {
    return { [THEME_KEY]: 'dark' }
  },
  data() {
    return {
      timeseriesOption: {
        toolbox: {
          top: 0,
          left: 8,
          feature: {
            saveAsImage: {
              name: 'Time_series',
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
              name: 'Time_series',
              title: 'Download as CSV',
              icon: 'M16.59 9H15V4c0-.55-.45-1-1-1h-4c-.55 0-1 .45-1 1v5H7.41c-.89 0-1.34 1.08-.71 1.71l4.59 4.59c.39.39 1.02.39 1.41 0l4.59-4.59c.63-.63.19-1.71-.7-1.71M5 19c0 .55.45 1 1 1h12c.55 0 1-.45 1-1s-.45-1-1-1H6c-.55 0-1 .45-1 1',
              onclick: () => {
                this.downloadAsCSV(
                  ['Date+Time', "value"],
                  'timeseriesv3',
                  'Time_series'
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
        tooltip: {
          trigger: 'axis',
          confine: true,
          formatter: function (e) {
            let tooltip = ''
            e.forEach((serie) => {
              tooltip += `${serie.marker} <b style="font-weight:bold;">${this.transformLabel(serie.seriesName)}:</b><br/>`

              const value = serie.data.value.toLocaleString('en-US', {
                maximumFractionDigits: 2
              })
              tooltip += '<table>'
              tooltip += `<tr><td>${moment(serie.data['Date+Time']).format('DD-MM-YYYY')}: <b>${value}<b/></td></tr>`
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
        yAxis: {},
        color: ['#F78211'],
        backgroundColor: 'transparent'
      },
      parameters: [],
      selectedParameter: {},
      selectedStartDate: '1984-01-01',
      selectedEndDate: '2015-12-31',

      data: []
    }
  },
  computed: {
    ...mapGetters(['colors', 'user'])
  },
  mounted() {
    this.fetchParameters()
  },
  methods: {
    ...mapActions(['loadGraphDataForLocation']),
    transformLabel(label) {
      label = label.replace(/_\{([^}]+)\}/g, '<sub>$1</sub>')
      label = label.replace(/\^\{([^}]+)\}/g, '<sup>$1</sup>')
      label = label.replace(/\{circ\}/g, '°')

      return label
    },
    fetchParameters() {
      fetch(`/static/data/TimeserieParameters.json`)
        .then((response) => response.json())
        .then((parameters) => {
          this.parameters = parameters.map((parameter) => ({
            ...parameter,
            label: this.transformLabel(parameter.label)
          }))

          this.selectParameter(parameters[0])
        })
    },
    getStepInterval(data, key) {
      const firstDate = moment(data[0][key])
      const lastDate = moment(data[data.length - 1][key])
      const diff = lastDate.diff(firstDate, 'days')

      if (diff > 365) {
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
      document.querySelectorAll('canvas, div').forEach((e) => {
        const instance = echarts.getInstanceByDom(e)
        if (instance && instance.group === 'timeseriesv3') {
          // Determine the step interval and calculate the index for x amount of years
          const stepInterval = this.getStepInterval(this.data, 'Date+Time')
          const indexForYears = this.getIndexForTimePeriod(stepInterval, 10)

          instance.setOption(
            {
              yAxis: {},
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
                  // startValue: this.data.length - 356 * 10,
                  // endValue: this.data.length
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
                top: 4,
                right: 0,
                formatter: function (name) {
                  let formattedName = this.transformLabel(name)

                  formattedName = formattedName.replace(
                    /<sub>(.*?)<\/sub>/g,
                    '{sub|$1}'
                  )

                  formattedName = formattedName.replace(
                    /<sup>(.*?)<\/sup>/g,
                    '{sup|$1}'
                  )

                  return formattedName
                }.bind(this),
                textStyle: {
                  overflow: 'breakAll',
                  rich: {
                    sub: {
                      fontSize: 8,
                      lineHeight: 2.5
                    },
                    sup: {
                      fontSize: 8
                    }
                  }
                }
              },
              series: [
                {
                  name: this.selectedParameter.label,
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
                'yAxis',
                'xAxis',
                'dataZoom',
                'legend',
                'series'
              ]
            }
          )
        }
      })
    },
    getChartData() {
      if (!this.selectedParameter.value) {
        this.data = []
        return
      }

      this.loadGraphDataForLocation({
        parameter: this.selectedParameter.value,
        startDate: this.selectedStartDate,
        endDate: this.selectedEndDate
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
    downloadAsCSV(keys, instanceKey, filename) {
      document.querySelectorAll('canvas, div').forEach((e) => {
        const instance = echarts.getInstanceByDom(e)
        if (instance?.group === instanceKey) {
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
      })
    },
    closeStartDatePicker() {
      // Implement closing logic if needed
    },
    applyStartDatePicker() {
      // Implement apply logic if needed
    },
    closeEndDatePicker() {
      // Implement closing logic if needed
    },
    applyEndDatePicker() {
      // Implement apply logic if needed
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

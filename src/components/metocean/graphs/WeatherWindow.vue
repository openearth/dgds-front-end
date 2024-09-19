<template>
  <div>
    <v-btn-toggle
      v-model="selectedExceedance"
      mandatory
    >
      <v-btn
        v-for="(exceedance, i) in exceedances"
        :key="`${exceedance}-${i}`"
        :value="exceedance"
        depressed
        @click="selectExceedance(exceedance)"
      >
        {{ exceedance }}
      </v-btn>
    </v-btn-toggle>
    <div
      style="
        display: flex;
        flex-wrap: wrap;
        justify-content: space-around;
        margin: 16px 0;
      "
    >
      <div
        v-for="(key, index) in Object.keys(thresholds)"
        :key="`${key}-${index}`"
        style="flex: 1; min-width: 300px; margin: 10px"
      >
        <b>{{ key }}</b>
        <v-select
          v-model="selectedThresholds[key]"
          :items="thresholds[key]"
          :label="`Select ${key}`"
          @change="selectThreshold(key, $event)"
        />
      </div>
    </div>
    <div style="width: 100%; height: 300px; margin: 8px 0px">
      <v-chart
        :option="weatherWindowOption"
        autoresize
        group="weatherWindow"
      />
    </div>
    <div style="margin-bottom: 8px">
      <v-data-table
        :headers="tableHeaders"
        :items="tableItems"
        disable-sort
        hide-default-footer
        class="weather-window-table"
      />
    </div>
  </div>
</template>

<script>
import * as echarts from 'echarts'
import VChart, { THEME_KEY } from 'vue-echarts'

export default {
  components: {
    VChart
  },
  provide() {
    return { [THEME_KEY]: 'dark' }
  },
  data() {
    return {
      data: [],
      durations: [],
      exceedances: [],
      months: [
        'Jan',
        'Feb',
        'Mar',
        'Apr',
        'May',
        'Jun',
        'Jul',
        'Aug',
        'Sep',
        'Oct',
        'Nov',
        'Dec',
        'All-year'
      ],
      thresholds: {},
      selectedExceedance: null,
      selectedThresholds: {},
      weatherWindowOption: {
        toolbox: {
          top: 0,
          left: 8,
          feature: {
            saveAsImage: {
              name: 'Weather_window',
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
              name: 'Weather_window',
              title: 'Download as CSV',
              icon: 'M16.59 9H15V4c0-.55-.45-1-1-1h-4c-.55 0-1 .45-1 1v5H7.41c-.89 0-1.34 1.08-.71 1.71l4.59 4.59c.39.39 1.02.39 1.41 0l4.59-4.59c.63-.63.19-1.71-.7-1.71M5 19c0 .55.45 1 1 1h12c.55 0 1-.45 1-1s-.45-1-1-1H6c-.55 0-1 .45-1 1',
              onclick: () => {
                this.downloadAsCSV(
                  ['duration', 'month', 'value'],
                  'weatherWindow',
                  'weather_window'
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
          formatter: function (e) {
            let tooltip = `Month: <b>${e[0].data.month}</b><br/>`

            tooltip += "<table>"
            e.forEach((serie) => {
              tooltip += `<tr><td>${serie.marker}</td><td>${serie.data.duration}<td><td><b>${serie.data.value}</b></td></tr>`
            })
            tooltip += "</table>"

            return tooltip
          }
        },
        grid: {
          containLabel: true,
          top: 48,
          right: 8,
          bottom: 16,
          left: 32
        },
        xAxis: {
          name: 'Durations',
          nameLocation: 'center',
          nameGap: 24,
          type: 'category',
          data: this.months
        },
        yAxis: {
          name: 'Percentage of time',
          nameLocation: 'center',
          nameGap: 48,
          type: 'value',
          axisLabel: { formatter: (e) => `${e}%` }
        },
        legend: {
          orient: 'vertical',
          show: true,
          top: 0,
          right: 0,
          data: this.durations
        },
        color: [
          '#F5DA4D',
          '#FCAE12',
          '#F78211',
          '#E75D2F',
          '#CB4149',
          '#A92E5E',
          '#85216B',
          '#60136E',
          '#3A0A63',
          '#140B35'
        ],
        backgroundColor: 'transparent'
      }
    }
  },
  computed: {
    tableHeaders() {
      return [
        { text: 'Duration', value: 'duration' },
        ...this.months.map((month) => ({ text: month, value: month }))
      ]
    },
    tableItems() {
      return this.durations.map((duration) => {
        const item = { duration }
        this.months.forEach((month) => {
          item[month] = this.getCellData(duration, month)
        })
        return item
      })
    }
  },
  mounted() {
    this.fetchData()
  },
  methods: {
    fetchData() {
      fetch('/static/data/PersistencyHsU10.json').then((response) => {
        if (response) {
          response.json().then((json) => {
            this.data = json

            const durations = this.getUniquePropertyValues(json, 'duration')
            this.durations = durations

            const exceedances = this.getUniquePropertyValues(json, 'exceedance')
            this.exceedances = exceedances
            this.selectExceedance(exceedances[1])

            const thresholds = this.getUniqueThresholdKeys(json)
            this.thresholds = thresholds

            Object.keys(thresholds).forEach((key) => {
              thresholds[key]?.[1] &&
                this.selectThreshold(key, thresholds[key][1])
            })
          })
        }
      })
    },
    updateChart() {
      document.querySelectorAll('canvas, div').forEach((e) => {
        const instance = echarts.getInstanceByDom(e)
        if (instance && instance.group === 'weatherWindow') {
          instance.setOption({
            series: this.createSeriesData()
          })
        }
      })
    },
    findSeriesData(duration) {
      const filteredData = this.data.find(
        (d) =>
          d.duration === duration &&
          d.exceedance === this.selectedExceedance &&
          Object.keys(this.selectedThresholds).every(
            (key) => d.threshold[key] === this.selectedThresholds[key]
          )
      )

      return filteredData || {}
    },
    createSeriesData() {
      return this.durations.map((duration) => {
        const filteredData = this.findSeriesData(duration)
        const serieData = this.months.map((month) => ({
          duration: duration,
          month: month,
          value: filteredData[month]
        }))

        return {
          name: duration,
          type: 'line',
          symbolSize: 8,
          data: serieData,
          dimensions: ['month', 'value', 'duration'],
          encode: {
            x: 'month',
            y: 'value'
          }
        }
      })
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

          console.log('option.series', option.series)

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
    // downloadAsCSV() {
    //   document.querySelectorAll('canvas, div').forEach((e) => {
    //     const instance = echarts.getInstanceByDom(e)
    //     if (instance && instance.group === 'weatherWindow') {
    //       const data = []
    //       const columnNames = []
    //       const option = instance.getOption()

    //       // Get the current state of the legend (which series are selected/visible)
    //       const legend = option.legend[0].selected

    //       // Track the visible series indices
    //       const visibleSeriesIndices = []

    //       // Add column names based on visible series names
    //       option.series.forEach((series, seriesIndex) => {
    //         if (legend[series.name] !== false) {
    //           columnNames.push(series.name) // Only include visible series
    //           visibleSeriesIndices.push(seriesIndex) // Track its index
    //         }
    //       })

    //       // Add header row to CSV
    //       let csvContent = `data:text/csv;charset=utf-8,${columnNames.join(',')} \r\n`

    //       // Retrieve visible data from the current state (respect dataZoom)
    //       visibleSeriesIndices.forEach((seriesIndex) => {
    //         const series = option.series[seriesIndex]
    //         if (series.data) {
    //           const zoomStart = option.dataZoom?.[0]?.start / 100 || 0
    //           const zoomEnd = option.dataZoom?.[0]?.end / 100 || 1

    //           const startIndex = Math.floor(zoomStart * series.data.length)
    //           const endIndex = Math.ceil(zoomEnd * series.data.length)

    //           // Ensure the data array is properly constructed for the visible data
    //           series.data
    //             .slice(startIndex, endIndex)
    //             .forEach((point, dataIndex) => {
    //               if (!data[dataIndex]) {
    //                 data[dataIndex] = []
    //               }
    //               // Handle [x, y] or y format, append only visible series data
    //               if (Array.isArray(point)) {
    //                 data[dataIndex].push(point[1]) // Take y value
    //               } else {
    //                 data[dataIndex].push(point) // Take single value
    //               }
    //             })
    //         }
    //       })

    //       // Convert array to CSV string
    //       data.forEach((rowArray) => {
    //         const row = rowArray.join(',')
    //         csvContent += row + '\r\n'
    //       })

    //       // Create a download link and trigger download
    //       const encodedUri = encodeURI(csvContent)
    //       const link = document.createElement('a')
    //       link.setAttribute('href', encodedUri)
    //       link.setAttribute('download', 'Weather_window.csv')
    //       document.body.appendChild(link)
    //       link.click()
    //       document.body.removeChild(link)
    //     }
    //   })
    // },
    getChartData(thresholds, exceedance) {
      if (!exceedance || Object.values(thresholds).length < 2) return

      console.log('getChartData thresholds', thresholds)
      console.log('getChartData exceedance', exceedance)

      this.updateChart()
      // this.loadGraphDataForLocation({
      //   ...thresholds,
      //   exceedance: exceedance
      // }).then((pointData) => {
      //   console.log('getChartData pointData', pointData)
      //   const { data } = pointData
      //   console.log('getChartData data', data)
      //   // this.data = data[265].serie[0].data.map((value, index) => ({
      //   //   'Date+Time': data[265].category[index],
      //   //   value
      //   // }))
      //   // this.updateChart()
      // })
    },
    selectExceedance(value) {
      this.selectedExceedance = value
      this.getChartData(this.selectedThresholds, value)
    },
    selectThreshold(key, value) {
      this.selectedThresholds[key] = value
      this.getChartData(this.selectedThresholds, this.selectedExceedance)
    },
    getCellData(duration, key) {
      const filteredData = this.findSeriesData(duration)
      return filteredData[key]
    },
    getUniquePropertyValues(arr, property) {
      return [...new Set(arr.map((obj) => obj[property]))]
    },
    getUniqueThresholdKeys(arr) {
      const thresholdKeys = {}
      arr.forEach((obj) => {
        const threshold = obj.threshold || {}
        Object.keys(threshold).forEach((key) => {
          if (!thresholdKeys[key]) {
            thresholdKeys[key] = [threshold[key]]
          } else if (!thresholdKeys[key].includes(threshold[key])) {
            thresholdKeys[key].push(threshold[key])
          }
        })
      })

      return thresholdKeys
    }
  }
}
</script>

<style scoped>
.weather-window-table {
  background-color: transparent !important;
}
</style>

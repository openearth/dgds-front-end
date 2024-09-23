<template>
  <div>
    <v-autocomplete
      v-model="selectedParameter1"
      :items="parameter1Options"
      label="First parameter"
      clearable
      @change="selectParameter1"
    />
    <v-autocomplete
      v-model="selectedParameter2"
      :items="parameter2Options"
      label="Second parameter"
      clearable
      @change="selectParameter2"
    />
    <v-select
      v-model="selectedMonth"
      :items="months"
      label="Month of interest"
    />
    <div style="width: 100%; height: 400px; margin: 8px 0px">
      <v-chart
        class="chart"
        :option="jointOccurenceOption"
        autoresize
        group="jointOccurence"
      />
    </div>
  </div>
</template>

<script>
import * as echarts from 'echarts'
import VChart, { THEME_KEY } from 'vue-echarts'
import { mapActions } from 'vuex'

export default {
  components: {
    VChart
  },
  provide: {
    [THEME_KEY]: 'dark'
  },
  data() {
    return {
      parameter1Options: [],
      parameter2Options: [],
      selectedParameter1: '',
      selectedParameter2: '',

      xAxisData: [],
      yAxisData: [],

      selectedMonth: 'All-year',
      months: [
        'All-year',
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
        'Dec'
      ],

      selectedStartDate: '2014-01-01',
      selectedEndDate: '2015-12-31',
      data: [],
      jointOccurenceOption: {
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
                  [
                    'x',
                    'y',
                    'value',
                    this.selectedParameter1,
                    this.selectedParameter2
                  ],
                  'jointOccurence',
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
        tooltip: {
          position: 'top'
        },
        grid: {
          containLabel: true,
          top: 40,
          right: 64,
          bottom: 24,
          left: 32
        },
        xAxis: {},
        yAxis: {},
        backgroundColor: 'transparent'
      }
    }
  },
  mounted() {
    this.fetchData()
  },
  methods: {
    ...mapActions(['loadGraphDataForLocation']),
    fetchData() {
      fetch(`/static/data/JointOccurenceParameters.json`)
        .then((response) => response.json())
        .then((parameters) => {
          this.parameters = parameters

          this.populateParameter1Options()
          this.populateParameter2Options()
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

      this.getChartData(this.selectedParameter1, this.selectedParameter2)
    },
    updateParameter1Options() {
      if (this.selectedParameter2) {
        this.parameter1Options = this.parameters
          .filter((item) => item.parameter2 === this.selectedParameter2)
          .map((item) => item.parameter1)
      } else {
        this.populateParameter1Options()
      }

      this.getChartData(this.selectedParameter1, this.selectedParameter2)
    },
    getChartData(parameter1, parameter2) {
      if (!parameter1 || !parameter2 || !this.selectedMonth) {
        this.data = []
        this.updateChart()
        return
      }

      this.data = [
        [0, 0, 4.21],
        [0, 1, 13.45],
        [0, 2, 6.34],
        [0, 3, 1.77],
        [0, 4, 0.85],
        [0, 5, 0.32],
        [0, 6, 0.09],
        [0, 7, 0.06],
        [0, 8, 0.01],
        [0, 9, null],
        [0, 10, null],
        [1, 0, 0.09],
        [1, 1, 20.22],
        [1, 2, 18.68],
        [1, 3, 5.19],
        [1, 4, 2.12],
        [1, 5, 0.73],
        [1, 6, 0.12],
        [1, 7, 0.01],
        [1, 8, null],
        [1, 9, null],
        [1, 10, null],
        [2, 0, null],
        [2, 1, 0.49],
        [2, 2, 13.94],
        [2, 3, 2.62],
        [2, 4, 0.54],
        [2, 5, 0.18],
        [2, 6, 0.05],
        [2, 7, 0],
        [2, 8, null],
        [2, 9, null],
        [2, 10, null],
        [3, 0, null],
        [3, 1, null],
        [3, 2, 2.65],
        [3, 3, 3.2],
        [3, 4, 0.25],
        [3, 5, 0.03],
        [3, 6, 0.01],
        [3, 7, 0],
        [3, 8, null],
        [3, 9, null],
        [3, 10, null],
        [4, 0, null],
        [4, 1, null],
        [4, 2, 0.01],
        [4, 3, 1.17],
        [4, 4, 0.24],
        [4, 5, 0.01],
        [4, 6, 0],
        [4, 7, null],
        [4, 8, null],
        [4, 9, null],
        [4, 10, null],
        [5, 0, null],
        [5, 1, null],
        [5, 2, null],
        [5, 3, 0.11],
        [5, 4, 0.16],
        [5, 5, 0.03],
        [5, 6, 0],
        [5, 7, null],
        [5, 8, null],
        [5, 9, null],
        [5, 10, null],
        [6, 0, null],
        [6, 1, null],
        [6, 2, null],
        [6, 3, 0],
        [6, 4, 0.02],
        [6, 5, 0.02],
        [6, 6, 0],
        [6, 7, null],
        [6, 8, null],
        [6, 9, null],
        [6, 10, null],
        [7, 0, null],
        [7, 1, null],
        [7, 2, null],
        [7, 3, null],
        [7, 4, null],
        [7, 5, 0],
        [7, 6, 0],
        [7, 7, null],
        [7, 8, null],
        [7, 9, null],
        [7, 10, null],
        [8, 0, null],
        [8, 1, null],
        [8, 2, null],
        [8, 3, null],
        [8, 4, null],
        [8, 5, 0],
        [8, 6, 0],
        [8, 7, null],
        [8, 8, null],
        [8, 9, null],
        [8, 10, null],
        [9, 0, null],
        [9, 1, null],
        [9, 2, null],
        [9, 3, null],
        [9, 4, null],
        [9, 5, null],
        [9, 6, null],
        [9, 7, null],
        [9, 8, null],
        [9, 9, null],
        [9, 10, null],
        [10, 0, null],
        [10, 1, null],
        [10, 2, null],
        [10, 3, null],
        [10, 4, null],
        [10, 5, null],
        [10, 6, null],
        [10, 7, null],
        [10, 8, null],
        [10, 9, null],
        [10, 10, null]
      ]
      this.xAxisData = [
        '0.0-4.0',
        '4.0-6.0',
        '6.0-8.0',
        '8.0-10.0',
        '10.0-12.0',
        '12.0-14.0',
        '14.0-16.0',
        '16.0-18.0',
        '18.0-20.0',
        '20.0-22.0',
        '>22.0'
      ]
      this.yAxisData = [
        '0.1-1.0',
        '1.0-2.0',
        '2.0-3.0',
        '3.0-4.0',
        '4.0-5.0',
        '5.0-6.0',
        '6.0-7.0',
        '7.0-8.0',
        '8.0-9.0',
        '9.0-10.0',
        '>10'
      ]

      this.updateChart()

      // this.loadGraphDataForLocation({
      //   parameter1: parameter1,
      //   parameter2: parameter2,
      //   month: this.selectedMonth
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
    isValueInRange(range, value) {
      const min = Math.min(...range)
      const max = Math.max(...range)

      return value >= min && value <= max
    },
    updateChart() {
      this.xAxisTotals = new Array(this.xAxisData.length).fill(0)
      this.yAxisTotals = new Array(this.yAxisData.length).fill(0)

      this.data.forEach(([yIndex, xIndex, value]) => {
        this.xAxisTotals[xIndex] += value
        this.yAxisTotals[yIndex] += value
      })

      const seriesData = this.data.map(function (item) {
        return [
          item[1],
          item[0],
          item[2] > 0 || item[2] === 0 ? item[2].toFixed(2) : null
        ]
      })

      document.querySelectorAll('canvas, div').forEach((e) => {
        const instance = echarts.getInstanceByDom(e)
        if (instance && instance.group === 'jointOccurence') {
          instance.setOption({
            xAxis: [
              {
                name: 'Tp > (s)',
                nameLocation: 'center',
                nameTextStyle: {
                  fontSize: 14,
                  fontWeight: 600
                },
                nameGap: 45,
                type: 'category',
                data: this.xAxisData,
                position: 'top',
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
                  rotate: 30
                }
              },
              {
                type: 'category',
                data: this.xAxisTotals.map((t) => t.toFixed(2)),
                position: 'bottom',
                splitArea: {
                  show: true
                },
                axisTick: {
                  interval: 0,
                  alignWithLabel: false
                },
                axisLabel: {
                  color: '#ffffff',
                  interval: 0
                }
              }
            ],
            yAxis: [
              {
                name: 'Hs > (m)',
                nameLocation: 'center',
                nameTextStyle: {
                  fontSize: 14,
                  fontWeight: 600
                },
                nameGap: 60,
                type: 'category',
                position: 'left',
                data: this.yAxisData,
                splitArea: {
                  show: true
                },
                axisTick: {
                  interval: 0,
                  alignWithLabel: false
                },
                axisLabel: {
                  interval: 0
                }
              },
              {
                name: 'Total (100)',
                nameLocation: 'start',
                nameGap: 30,
                type: 'category',
                position: 'right',
                data: this.yAxisTotals.map((t) => t.toFixed(2)),
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
                  interval: 0
                }
              }
            ],
            visualMap: {
              min: 0,
              max: 20.22,
              calculable: true,
              right: 0,
              top: 0,
              orient: 'vertical',
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
                dimensions: ['x', 'y', 'value'],
                encode: {
                  x: 'x',
                  y: 'y'
                },
                label: {
                  show: true
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
          })
        }
      })
    },
    downloadAsCSV(keys, instanceKey, filename) {
      document.querySelectorAll('canvas, div').forEach((e) => {
        const instance = echarts.getInstanceByDom(e)
        if (instance?.group === instanceKey) {
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

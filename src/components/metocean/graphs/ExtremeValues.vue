<template>
  <div>
    <v-select
      v-model="selectedParameter"
      :items="parameters"
      label="Parameter"
      @change="selectParameter"
    />
    <div style="width: 100%; height: 400px; margin: 8px 0px">
      <v-chart
        :option="lineOption"
        autoresize
        group="extremeValues"
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
  provide() {
    return {
      [THEME_KEY]: 'dark'
    }
  },
  data() {
    return {
      data: [],
      parameters: [],
      selectedParameter: null,
      lineOption: {
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
                  [
                    'returnPeriod',
                    'bestEstimate',
                    'lowerBound',
                    'upperBound',
                    'U10mag'
                  ],
                  'extremeValues',
                  'Extreme_values'
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
        grid: {
          containLabel: true,
          top: 48,
          right: 8,
          bottom: 16,
          left: 32
        },
        tooltip: {
          trigger: 'axis',
          formatter: function (e) {
            let tooltip = `ReturnPeriod: <b>${e[0].data[0]}</b><br/>`

            tooltip += '<table>'
            e.forEach((serie) => {
              tooltip += `<tr><td>${serie.marker}</td><td>${serie.seriesName}<td><td><b>${serie.data[1]}</b></td></tr>`
            })
            tooltip += '</table>'

            return tooltip
          }
        },
        xAxis: {
          name: 'Return period',
          nameLocation: 'center',
          nameGap: 24,
          type: 'log'
        },
        yAxis: {
          name: 'Value',
          nameLocation: 'center',
          nameGap: 40,
          scale: true,
          type: 'value'
        },
        legend: {
          orient: 'vertical',
          show: true,
          top: 0,
          right: 0
        },
        color: [
          '#F5DA4D',
          // '#FCAE12',
          '#F78211',
          // '#E75D2F',
          '#CB4149',
          // '#A92E5E',
          '#85216B',
          // '#60136E',
          '#3A0A63'
          // '#140B35'
        ],
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
      const parameters = [
        'Extreme mean wind speed U10 (m/s)',
        'Extreme seastates SS (-)'
      ]
      this.parameters = parameters

      this.$nextTick(() => {
        this.selectParameter(parameters[0])
      })
    },
    createSeriesData() {
      return [
        {
          name: 'Best estimate',
          type: 'line',
          data: this.data.map((line) => [line.returnPeriod, line.bestEstimate]),
          dimensions: ['returnPeriod', 'bestEstimate'],
          encode: {
            x: 'returnPeriod',
            y: 'bestEstimate'
          },
          showSymbol: false
        },
        {
          name: 'Lower bound',
          type: 'line',
          data: this.data.map((line) => [line.returnPeriod, line.lowerBound]),
          dimensions: ['returnPeriod', 'lowerBound'],
          encode: {
            x: 'returnPeriod',
            y: 'lowerBound'
          },
          showSymbol: false,
          lineStyle: {
            type: 'dashed'
          }
        },
        {
          name: 'Upper bound',
          type: 'line',
          data: this.data.map((line) => [line.returnPeriod, line.upperBound]),
          dimensions: ['returnPeriod', 'upperBound'],
          encode: {
            x: 'returnPeriod',
            y: 'upperBound'
          },
          showSymbol: false,
          lineStyle: {
            type: 'dashed'
          }
        }
      ]
    },
    createGraphic() {
      let text = '1 year: 22.3 (21.9 - 22.7) \n'
      text += '10 year: 26.1 (24.8 - 27.4) \n'
      text += '50 year: 28.8 (26.5 - 31.8) \n'
      text += '100 year: 30.0 (27.1 - 34.1) \n'
      text += '1.000 year:  33.9 (28.7 - 42.4) \n'
      text += '10.000 year:  37.7 (29.9 - 52.7)'

      return [
        {
          type: 'group',
          left: '12%',
          top: '12%',
          children: [
            {
              type: 'rect',
              z: 100,
              left: 'center',
              top: 'middle',
              shape: {
                width: 205,
                height: 100,
                r: 2
              },
              style: {
                fill: 'rgba(255,255,255,0.95)',
                stroke: '#555',
                lineWidth: 1,
                shadowBlur: 8,
                shadowOffsetX: 3,
                shadowOffsetY: 3,
                shadowColor: 'rgba(0,0,0,0.2)'
              }
            },
            {
              type: 'text',
              z: 100,
              left: 'center',
              top: 'middle',
              style: {
                fill: '#333',
                overflow: 'break',
                text: text,
                font: '14px Roboto'
              }
            }
          ]
        }
      ]
    },
    getChartData(parameter) {
      this.data = [
        {
          returnPeriod: 0.3,
          bestEstimate: 20.025,
          lowerBound: 19.855,
          upperBound: 20.225
        },
        {
          returnPeriod: 0.5,
          bestEstimate: 20.912,
          lowerBound: 20.642,
          upperBound: 21.19
        },
        {
          returnPeriod: 1.1,
          bestEstimate: 22.278,
          lowerBound: 21.896,
          upperBound: 22.673
        },
        {
          returnPeriod: 2,
          bestEstimate: 23.311,
          lowerBound: 22.765,
          upperBound: 23.824
        },
        {
          returnPeriod: 3,
          bestEstimate: 24.01,
          lowerBound: 23.32,
          upperBound: 24.662
        },
        {
          returnPeriod: 4,
          bestEstimate: 24.505,
          lowerBound: 23.695,
          upperBound: 25.286
        },
        {
          returnPeriod: 5,
          bestEstimate: 24.888,
          lowerBound: 23.974,
          upperBound: 25.769
        },
        {
          returnPeriod: 6,
          bestEstimate: 25.202,
          lowerBound: 24.21,
          upperBound: 26.199
        },
        {
          returnPeriod: 7,
          bestEstimate: 25.466,
          lowerBound: 24.405,
          upperBound: 26.565
        },
        {
          returnPeriod: 8,
          bestEstimate: 25.695,
          lowerBound: 24.565,
          upperBound: 26.884
        },
        {
          returnPeriod: 9,
          bestEstimate: 25.897,
          lowerBound: 24.686,
          upperBound: 27.157
        },
        {
          returnPeriod: 10,
          bestEstimate: 26.078,
          lowerBound: 24.797,
          upperBound: 27.408
        },
        {
          returnPeriod: 20,
          bestEstimate: 27.263,
          lowerBound: 25.564,
          upperBound: 29.227
        },
        {
          returnPeriod: 30,
          bestEstimate: 27.955,
          lowerBound: 25.963,
          upperBound: 30.335
        },
        {
          returnPeriod: 40,
          bestEstimate: 28.445,
          lowerBound: 26.258,
          upperBound: 31.182
        },
        {
          returnPeriod: 50,
          bestEstimate: 28.825,
          lowerBound: 26.481,
          upperBound: 31.845
        },
        {
          returnPeriod: 60,
          bestEstimate: 29.135,
          lowerBound: 26.656,
          upperBound: 32.382
        },
        {
          returnPeriod: 70,
          bestEstimate: 29.397,
          lowerBound: 26.795,
          upperBound: 32.859
        },
        {
          returnPeriod: 80,
          bestEstimate: 29.623,
          lowerBound: 26.913,
          upperBound: 33.305
        },
        {
          returnPeriod: 90,
          bestEstimate: 29.823,
          lowerBound: 27.009,
          upperBound: 33.706
        },
        {
          returnPeriod: 100,
          bestEstimate: 30.002,
          lowerBound: 27.093,
          upperBound: 34.056
        },
        {
          returnPeriod: 200,
          bestEstimate: 31.176,
          lowerBound: 27.617,
          upperBound: 36.37
        },
        {
          returnPeriod: 300,
          bestEstimate: 31.861,
          lowerBound: 27.898,
          upperBound: 37.721
        },
        {
          returnPeriod: 400,
          bestEstimate: 32.346,
          lowerBound: 28.112,
          upperBound: 38.778
        },
        {
          returnPeriod: 500,
          bestEstimate: 32.722,
          lowerBound: 28.264,
          upperBound: 39.647
        },
        {
          returnPeriod: 600,
          bestEstimate: 33.029,
          lowerBound: 28.378,
          upperBound: 40.375
        },
        {
          returnPeriod: 700,
          bestEstimate: 33.288,
          lowerBound: 28.466,
          upperBound: 41.002
        },
        {
          returnPeriod: 800,
          bestEstimate: 33.513,
          lowerBound: 28.54,
          upperBound: 41.538
        },
        {
          returnPeriod: 900,
          bestEstimate: 33.71,
          lowerBound: 28.604,
          upperBound: 42.003
        },
        {
          returnPeriod: 1000,
          bestEstimate: 33.887,
          lowerBound: 28.667,
          upperBound: 42.423
        },
        {
          returnPeriod: 4000,
          bestEstimate: 36.208,
          lowerBound: 29.482,
          upperBound: 48.403
        },
        {
          returnPeriod: 10000,
          bestEstimate: 37.734,
          lowerBound: 29.915,
          upperBound: 52.693
        }
      ]
      this.updateChart()

      // this.loadGraphDataForLocation({
      //   parameter: parameter,
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
    selectParameter(parameter) {
      this.selectedParameter = parameter
      this.getChartData(parameter)
    },
    updateChart() {
      document.querySelectorAll('canvas, div').forEach((e) => {
        const instance = echarts.getInstanceByDom(e)
        if (instance && instance.group === 'extremeValues') {
          instance.setOption({
            // title: {
            //   text: this.selectedParameter,
            //   left: 'center'
            // },
            series: this.createSeriesData(),
            graphic: this.createGraphic()
          })
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

          option.series.forEach((serie) => {
            if (serie.data && legend[serie.name] !== false) {
              const startIndex = Math.floor(zoomStart * serie.data.length)
              const endIndex = Math.ceil(zoomEnd * serie.data.length)

              // Process the visible data range for this series
              serie.data.slice(startIndex, endIndex).forEach((point) => {
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
    }
  }
}
</script>

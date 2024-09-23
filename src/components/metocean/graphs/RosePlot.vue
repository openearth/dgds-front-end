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
        :option="roseOption"
        autoresize
        group="rosePlot"
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
      parameters: [
        {
          parameter1: 'Hourly-averaged horizontal wind speed at 10 m height',
          parameter2: 'Hourly-averaged horizontal wind direction at 10 m height'
        },
        {
          parameter1: 'Hourly-averaged horizontal wind speed at 60 m height',
          parameter2: 'Hourly-averaged horizontal wind direction at 60 m height'
        },
        {
          parameter1: 'Hourly-averaged horizontal wind speed at 100 m height',
          parameter2:
            'Hourly-averaged horizontal wind direction at 100 m height'
        },
        {
          parameter1: 'Hourly-averaged horizontal wind speed at 120 m height',
          parameter2:
            'Hourly-averaged horizontal wind direction at 120 m height'
        },
        {
          parameter1: 'Hourly-averaged horizontal wind speed at 160 m height',
          parameter2:
            'Hourly-averaged horizontal wind direction at 160 m height'
        },
        {
          parameter1: 'Hourly-averaged horizontal wind speed at 200 m height',
          parameter2:
            'Hourly-averaged horizontal wind direction at 200 m height'
        },
        {
          parameter1: 'Hourly-averaged horizontal wind speed at 250 m height',
          parameter2:
            'Hourly-averaged horizontal wind direction at 250 m height'
        },
        {
          parameter1: 'Hourly-averaged horizontal wind speed at 300 m height',
          parameter2:
            'Hourly-averaged horizontal wind direction at 300 m height'
        },
        {
          parameter1: 'Depth-averaged total current speed',
          parameter2: 'Depth-averaged total current direction'
        },
        {
          parameter1: 'Depth-averaged tidal current speed',
          parameter2: 'Depth-averaged tidal current direction'
        },
        {
          parameter1: 'Depth-averaged residual current speed',
          parameter2: 'Depth-averaged residual current direction'
        },
        {
          parameter1: 'Total current speed at 100% of the water depth',
          parameter2: 'Total current direction at 100% of the water depth'
        },
        {
          parameter1: 'Tidal current speed at 100% of the water depth',
          parameter2: 'Tidal current direction at 100% of the water depth'
        },
        {
          parameter1: 'Residual current speed at 100% of the water depth',
          parameter2: 'Residual current direction at 100% of the water depth'
        },
        {
          parameter1: 'Total current speed at 75% of the water depth',
          parameter2: 'Total current direction at 75% of the water depth'
        },
        {
          parameter1: 'Tidal current speed at 75% of the water depth',
          parameter2: 'Tidal current direction at 75% of the water depth'
        },
        {
          parameter1: 'Residual current speed at 75% of the water depth',
          parameter2: 'Residual current direction at 75% of the water depth'
        },
        {
          parameter1: 'Total current speed at 50% of the water depth',
          parameter2: 'Total current direction at 50% of the water depth'
        },
        {
          parameter1: 'Tidal current speed at 50% of the water depth',
          parameter2: 'Tidal current direction at 50% of the water depth'
        },
        {
          parameter1: 'Residual current speed at 50% of the water depth',
          parameter2: 'Residual current direction at 50% of the water depth'
        },
        {
          parameter1: 'Total current speed at 25% of the water depth',
          parameter2: 'Total current direction at 25% of the water depth'
        },
        {
          parameter1: 'Tidal current speed at 25% of the water depth',
          parameter2: 'Tidal current direction at 25% of the water depth'
        },
        {
          parameter1: 'Residual current speed at 25% of the water depth',
          parameter2: 'Residual current direction at 25% of the water depth'
        },
        {
          parameter1: 'Total current speed at 5% of the water depth',
          parameter2: 'Total current direction at 5% of the water depth'
        },
        {
          parameter1: 'Tidal current speed at 5% of the water depth',
          parameter2: 'Tidal current direction at 5% of the water depth'
        },
        {
          parameter1: 'Residual current speed at 5% of the water depth',
          parameter2: 'Residual current direction at 5% of the water depth'
        },
        {
          parameter1: 'Significant wave height for total sea',
          parameter2: 'Peak wave period for total sea'
        },
        {
          parameter1: 'Significant wave height for total sea',
          parameter2:
            'Mean wave period (based on spectral moments of order 2 en 0) for total sea'
        },
        {
          parameter1: 'Significant wave height for total sea',
          parameter2: 'Mean wave direction for total sea'
        },
        {
          parameter1: 'Significant wave height for total sea',
          parameter2: 'Peak wave direction for total sea'
        },
        {
          parameter1: 'Peak wave period for total sea',
          parameter2: 'Mean wave direction for total sea'
        },
        {
          parameter1: 'Peak wave period for total sea',
          parameter2: 'Peak wave direction for total sea'
        },
        {
          parameter1: 'Significant wave height for swell',
          parameter2: 'Peak wave period for swell'
        },
        {
          parameter1: 'Significant wave height for swell',
          parameter2:
            'Mean wave period (based on spectral moments of order 2 en 0) for swell'
        },
        {
          parameter1: 'Significant wave height for swell',
          parameter2: 'Mean wave direction for swell'
        },
        {
          parameter1: 'Significant wave height for swell',
          parameter2: 'Peak wave direction for swell'
        },
        {
          parameter1: 'Peak wave period for swell',
          parameter2: 'Mean wave direction for swell'
        },
        {
          parameter1: 'Peak wave period for swell',
          parameter2: 'Peak wave direction for swell'
        },
        {
          parameter1: 'Significant wave height for wind sea',
          parameter2: 'Peak wave period for wind sea'
        },
        {
          parameter1: 'Significant wave height for wind sea',
          parameter2:
            'Mean wave period (based on spectral moments of order 2 en 0) for wind sea'
        },
        {
          parameter1: 'Significant wave height for wind sea',
          parameter2: 'Mean wave direction for wind sea'
        },
        {
          parameter1: 'Significant wave height for wind sea',
          parameter2: 'Peak wave direction for wind sea'
        },
        {
          parameter1: 'Peak wave period for wind sea',
          parameter2: 'Mean wave direction for wind sea'
        },
        {
          parameter1: 'Peak wave period for wind sea',
          parameter2: 'Peak wave direction for wind sea'
        },
        {
          parameter1: 'Hourly-averaged horizontal wind speed at 10 m height',
          parameter2: 'Hourly-averaged horizontal wind direction at 10 m height'
        },
        {
          parameter1: 'Hourly-averaged horizontal wind speed at 60 m height',
          parameter2: 'Hourly-averaged horizontal wind direction at 60 m height'
        },
        {
          parameter1: 'Hourly-averaged horizontal wind speed at 100 m height',
          parameter2:
            'Hourly-averaged horizontal wind direction at 100 m height'
        },
        {
          parameter1: 'Hourly-averaged horizontal wind speed at 120 m height',
          parameter2:
            'Hourly-averaged horizontal wind direction at 120 m height'
        },
        {
          parameter1: 'Hourly-averaged horizontal wind speed at 160 m height',
          parameter2:
            'Hourly-averaged horizontal wind direction at 160 m height'
        },
        {
          parameter1: 'Hourly-averaged horizontal wind speed at 200 m height',
          parameter2:
            'Hourly-averaged horizontal wind direction at 200 m height'
        },
        {
          parameter1: 'Hourly-averaged horizontal wind speed at 250 m height',
          parameter2:
            'Hourly-averaged horizontal wind direction at 250 m height'
        },
        {
          parameter1: 'Hourly-averaged horizontal wind speed at 300 m height',
          parameter2:
            'Hourly-averaged horizontal wind direction at 300 m height'
        },
        {
          parameter1: 'Significant wave height for total sea',
          parameter2: 'Mean wave direction for total sea'
        },
        {
          parameter1: 'Significant wave height for total sea',
          parameter2: 'Mean wave direction for total sea'
        },
        {
          parameter1: 'Total water level',
          parameter2: 'Depth-averaged total current direction'
        },
        {
          parameter1: 'Residual water level',
          parameter2: 'Depth-averaged residual current direction'
        },
        {
          parameter1: 'Total water level',
          parameter2: 'Significant wave height for total sea'
        },
        {
          parameter1: 'Total water level',
          parameter2: 'Significant wave height for total sea'
        }
      ],
      parameter1Options: [],
      parameter2Options: [],
      selectedParameter1: '',
      selectedParameter2: '',

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

      classes: [],
      data: [],
      roseOption: {
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
                    this.selectedParameter1,
                    this.selectedParameter2,
                    'class',
                    'winddirection'
                  ],
                  'rosePlot',
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
        tooltip: {
          trigger: 'item',
          formatter: function (e) {
            const { U10, winddirection } = e.data
            return `Winddirection: ${winddirection} <br/>U10: ${U10} <br/>Windspeed (m/s): ${e.data.class}`
          },
          textStyle: {
            color: '#000'
          }
        },
        angleAxis: {
          type: 'category',
          data: [
            0, 22.5, 45, 67.5, 90, 112.5, 135, 157.5, 180, 202.5, 225, 247.5,
            270, 292.5, 315, 337.5
          ],
          boundaryGap: false,
          axisTick: {
            show: true
          },
          splitLine: {
            show: true
          },
          axisLabel: {
            show: true,
            interval: 1
          }
        },
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
  mounted() {
    this.populateParameter1Options()
    this.populateParameter2Options()
  },
  methods: {
    ...mapActions(['loadGraphDataForLocation']),
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
        {
          U10: 0.78,
          U120: 0.5,
          class: '<3.25',
          winddirection: 0
        },
        {
          U10: 2.18,
          U120: 0,
          class: '3.25 - 6.5',
          winddirection: 0
        },
        {
          U10: 1.67,
          U120: 0.25,
          class: '6.5 - 9.75',
          winddirection: 0
        },
        {
          U10: 0.49,
          U120: 0,
          class: '9.75 - 13',
          winddirection: 0
        },
        {
          U10: 0.11,
          U120: 0,
          class: '13 - 16.26',
          winddirection: 0
        },
        {
          U10: 0.02,
          U120: 0,
          class: '16.26 - 19.51',
          winddirection: 0
        },
        {
          U10: 0,
          U120: 0,
          class: '19.51 - 22.76',
          winddirection: 0
        },
        {
          U10: 0,
          U120: 0,
          class: '22.76 - 26.01',
          winddirection: 0
        },
        {
          U10: 0,
          U120: 0,
          class: '26.01 - 29.26',
          winddirection: 0
        },
        {
          U10: 0,
          U120: 0,
          class: '>29.26',
          winddirection: 0
        },
        {
          U10: 0.74,
          U120: 0,
          class: '<3.25',
          winddirection: 22.5
        },
        {
          U10: 2.28,
          U120: 0,
          class: '3.25 - 6.5',
          winddirection: 22.5
        },
        {
          U10: 1.6,
          U120: 0,
          class: '6.5 - 9.75',
          winddirection: 22.5
        },
        {
          U10: 0.38,
          U120: 0,
          class: '9.75 - 13',
          winddirection: 22.5
        },
        {
          U10: 0.05,
          U120: 0,
          class: '13 - 16.26',
          winddirection: 22.5
        },
        {
          U10: 0,
          U120: 0,
          class: '16.26 - 19.51',
          winddirection: 22.5
        },
        {
          U10: 0,
          U120: 0,
          class: '19.51 - 22.76',
          winddirection: 22.5
        },
        {
          U10: 0,
          U120: 0,
          class: '22.76 - 26.01',
          winddirection: 22.5
        },
        {
          U10: 0,
          U120: 0,
          class: '26.01 - 29.26',
          winddirection: 22.5
        },
        {
          U10: 0,
          U120: 0,
          class: '>29.26',
          winddirection: 22.5
        },
        {
          U10: 0.76,
          U120: 0,
          class: '<3.25',
          winddirection: 45
        },
        {
          U10: 2.17,
          U120: 0,
          class: '3.25 - 6.5',
          winddirection: 45
        },
        {
          U10: 1.53,
          U120: 0,
          class: '6.5 - 9.75',
          winddirection: 45
        },
        {
          U10: 0.34,
          U120: 0,
          class: '9.75 - 13',
          winddirection: 45
        },
        {
          U10: 0.05,
          U120: 0,
          class: '13 - 16.26',
          winddirection: 45
        },
        {
          U10: 0,
          U120: 0,
          class: '16.26 - 19.51',
          winddirection: 45
        },
        {
          U10: 0,
          U120: 0,
          class: '19.51 - 22.76',
          winddirection: 45
        },
        {
          U10: 0,
          U120: 0,
          class: '22.76 - 26.01',
          winddirection: 45
        },
        {
          U10: 0,
          U120: 0,
          class: '26.01 - 29.26',
          winddirection: 45
        },
        {
          U10: 0,
          U120: 0,
          class: '>29.26',
          winddirection: 45
        },
        {
          U10: 0.79,
          U120: 0,
          class: '<3.25',
          winddirection: 67.5
        },
        {
          U10: 2.31,
          U120: 0,
          class: '3.25 - 6.5',
          winddirection: 67.5
        },
        {
          U10: 1.55,
          U120: 0,
          class: '6.5 - 9.75',
          winddirection: 67.5
        },
        {
          U10: 0.44,
          U120: 0,
          class: '9.75 - 13',
          winddirection: 67.5
        },
        {
          U10: 0.05,
          U120: 0,
          class: '13 - 16.26',
          winddirection: 67.5
        },
        {
          U10: 0,
          U120: 0,
          class: '16.26 - 19.51',
          winddirection: 67.5
        },
        {
          U10: 0,
          U120: 0,
          class: '19.51 - 22.76',
          winddirection: 67.5
        },
        {
          U10: 0,
          U120: 0,
          class: '22.76 - 26.01',
          winddirection: 67.5
        },
        {
          U10: 0,
          U120: 0,
          class: '26.01 - 29.26',
          winddirection: 67.5
        },
        {
          U10: 0,
          U120: 0,
          class: '>29.26',
          winddirection: 67.5
        },
        {
          U10: 0.77,
          U120: 0,
          class: '<3.25',
          winddirection: 90
        },
        {
          U10: 2.34,
          U120: 0,
          class: '3.25 - 6.5',
          winddirection: 90
        },
        {
          U10: 1.32,
          U120: 0,
          class: '6.5 - 9.75',
          winddirection: 90
        },
        {
          U10: 0.43,
          U120: 0,
          class: '9.75 - 13',
          winddirection: 90
        },
        {
          U10: 0.04,
          U120: 0,
          class: '13 - 16.26',
          winddirection: 90
        },
        {
          U10: 0,
          U120: 0,
          class: '16.26 - 19.51',
          winddirection: 90
        },
        {
          U10: 0,
          U120: 0,
          class: '19.51 - 22.76',
          winddirection: 90
        },
        {
          U10: 0,
          U120: 0,
          class: '22.76 - 26.01',
          winddirection: 90
        },
        {
          U10: 0,
          U120: 0,
          class: '26.01 - 29.26',
          winddirection: 90
        },
        {
          U10: 0,
          U120: 0,
          class: '>29.26',
          winddirection: 90
        },
        {
          U10: 0.79,
          U120: 0,
          class: '<3.25',
          winddirection: 112.5
        },
        {
          U10: 2.02,
          U120: 0,
          class: '3.25 - 6.5',
          winddirection: 112.5
        },
        {
          U10: 1.04,
          U120: 0,
          class: '6.5 - 9.75',
          winddirection: 112.5
        },
        {
          U10: 0.24,
          U120: 0,
          class: '9.75 - 13',
          winddirection: 112.5
        },
        {
          U10: 0.02,
          U120: 0,
          class: '13 - 16.26',
          winddirection: 112.5
        },
        {
          U10: 0,
          U120: 0,
          class: '16.26 - 19.51',
          winddirection: 112.5
        },
        {
          U10: 0,
          U120: 0,
          class: '19.51 - 22.76',
          winddirection: 112.5
        },
        {
          U10: 0,
          U120: 0,
          class: '22.76 - 26.01',
          winddirection: 112.5
        },
        {
          U10: 0,
          U120: 0,
          class: '26.01 - 29.26',
          winddirection: 112.5
        },
        {
          U10: 0,
          U120: 0,
          class: '>29.26',
          winddirection: 112.5
        },
        {
          U10: 0.72,
          U120: 0,
          class: '<3.25',
          winddirection: 135
        },
        {
          U10: 1.83,
          U120: 0,
          class: '3.25 - 6.5',
          winddirection: 135
        },
        {
          U10: 0.88,
          U120: 0,
          class: '6.5 - 9.75',
          winddirection: 135
        },
        {
          U10: 0.19,
          U120: 0,
          class: '9.75 - 13',
          winddirection: 135
        },
        {
          U10: 0.03,
          U120: 0,
          class: '13 - 16.26',
          winddirection: 135
        },
        {
          U10: 0,
          U120: 0,
          class: '16.26 - 19.51',
          winddirection: 135
        },
        {
          U10: 0,
          U120: 0,
          class: '19.51 - 22.76',
          winddirection: 135
        },
        {
          U10: 0,
          U120: 0,
          class: '22.76 - 26.01',
          winddirection: 135
        },
        {
          U10: 0,
          U120: 0,
          class: '26.01 - 29.26',
          winddirection: 135
        },
        {
          U10: 0,
          U120: 0,
          class: '>29.26',
          winddirection: 135
        },
        {
          U10: 0.71,
          U120: 0,
          class: '<3.25',
          winddirection: 157.5
        },
        {
          U10: 1.85,
          U120: 0,
          class: '3.25 - 6.5',
          winddirection: 157.5
        },
        {
          U10: 1.24,
          U120: 0,
          class: '6.5 - 9.75',
          winddirection: 157.5
        },
        {
          U10: 0.36,
          U120: 0,
          class: '9.75 - 13',
          winddirection: 157.5
        },
        {
          U10: 0.07,
          U120: 0,
          class: '13 - 16.26',
          winddirection: 157.5
        },
        {
          U10: 0.01,
          U120: 0,
          class: '16.26 - 19.51',
          winddirection: 157.5
        },
        {
          U10: 0,
          U120: 0,
          class: '19.51 - 22.76',
          winddirection: 157.5
        },
        {
          U10: 0,
          U120: 0,
          class: '22.76 - 26.01',
          winddirection: 157.5
        },
        {
          U10: 0,
          U120: 0,
          class: '26.01 - 29.26',
          winddirection: 157.5
        },
        {
          U10: 0,
          U120: 0,
          class: '>29.26',
          winddirection: 157.5
        },
        {
          U10: 0.68,
          U120: 0,
          class: '<3.25',
          winddirection: 180
        },
        {
          U10: 1.97,
          U120: 0,
          class: '3.25 - 6.5',
          winddirection: 180
        },
        {
          U10: 1.87,
          U120: 0,
          class: '6.5 - 9.75',
          winddirection: 180
        },
        {
          U10: 0.96,
          U120: 0,
          class: '9.75 - 13',
          winddirection: 180
        },
        {
          U10: 0.28,
          U120: 0,
          class: '13 - 16.26',
          winddirection: 180
        },
        {
          U10: 0.05,
          U120: 0,
          class: '16.26 - 19.51',
          winddirection: 180
        },
        {
          U10: 0,
          U120: 0,
          class: '19.51 - 22.76',
          winddirection: 180
        },
        {
          U10: 0,
          U120: 0,
          class: '22.76 - 26.01',
          winddirection: 180
        },
        {
          U10: 0,
          U120: 0,
          class: '26.01 - 29.26',
          winddirection: 180
        },
        {
          U10: 0,
          U120: 0,
          class: '>29.26',
          winddirection: 180
        },
        {
          U10: 0.72,
          U120: 0,
          class: '<3.25',
          winddirection: 202.5
        },
        {
          U10: 2.31,
          U120: 0,
          class: '3.25 - 6.5',
          winddirection: 202.5
        },
        {
          U10: 2.64,
          U120: 0,
          class: '6.5 - 9.75',
          winddirection: 202.5
        },
        {
          U10: 1.85,
          U120: 0,
          class: '9.75 - 13',
          winddirection: 202.5
        },
        {
          U10: 0.77,
          U120: 0,
          class: '13 - 16.26',
          winddirection: 202.5
        },
        {
          U10: 0.16,
          U120: 0,
          class: '16.26 - 19.51',
          winddirection: 202.5
        },
        {
          U10: 0.03,
          U120: 0,
          class: '19.51 - 22.76',
          winddirection: 202.5
        },
        {
          U10: 0,
          U120: 0,
          class: '22.76 - 26.01',
          winddirection: 202.5
        },
        {
          U10: 0,
          U120: 0,
          class: '26.01 - 29.26',
          winddirection: 202.5
        },
        {
          U10: 0,
          U120: 0,
          class: '>29.26',
          winddirection: 202.5
        },
        {
          U10: 0.8,
          U120: 0,
          class: '<3.25',
          winddirection: 225
        },
        {
          U10: 2.87,
          U120: 0,
          class: '3.25 - 6.5',
          winddirection: 225
        },
        {
          U10: 3.96,
          U120: 0,
          class: '6.5 - 9.75',
          winddirection: 225
        },
        {
          U10: 2.61,
          U120: 0,
          class: '9.75 - 13',
          winddirection: 225
        },
        {
          U10: 1.09,
          U120: 0,
          class: '13 - 16.26',
          winddirection: 225
        },
        {
          U10: 0.25,
          U120: 0,
          class: '16.26 - 19.51',
          winddirection: 225
        },
        {
          U10: 0.04,
          U120: 0,
          class: '19.51 - 22.76',
          winddirection: 225
        },
        {
          U10: 0,
          U120: 0,
          class: '22.76 - 26.01',
          winddirection: 225
        },
        {
          U10: 0,
          U120: 0,
          class: '26.01 - 29.26',
          winddirection: 225
        },
        {
          U10: 0,
          U120: 0,
          class: '>29.26',
          winddirection: 225
        },
        {
          U10: 0.85,
          U120: 0,
          class: '<3.25',
          winddirection: 247.5
        },
        {
          U10: 2.87,
          U120: 0,
          class: '3.25 - 6.5',
          winddirection: 247.5
        },
        {
          U10: 3.61,
          U120: 0,
          class: '6.5 - 9.75',
          winddirection: 247.5
        },
        {
          U10: 2.22,
          U120: 0,
          class: '9.75 - 13',
          winddirection: 247.5
        },
        {
          U10: 1,
          U120: 0,
          class: '13 - 16.26',
          winddirection: 247.5
        },
        {
          U10: 0.24,
          U120: 0,
          class: '16.26 - 19.51',
          winddirection: 247.5
        },
        {
          U10: 0.04,
          U120: 0,
          class: '19.51 - 22.76',
          winddirection: 247.5
        },
        {
          U10: 0.01,
          U120: 0,
          class: '22.76 - 26.01',
          winddirection: 247.5
        },
        {
          U10: 0,
          U120: 0,
          class: '26.01 - 29.26',
          winddirection: 247.5
        },
        {
          U10: 0,
          U120: 0,
          class: '>29.26',
          winddirection: 247.5
        },
        {
          U10: 0.8,
          U120: 0,
          class: '<3.25',
          winddirection: 270
        },
        {
          U10: 2.54,
          U120: 0,
          class: '3.25 - 6.5',
          winddirection: 270
        },
        {
          U10: 2.34,
          U120: 0,
          class: '6.5 - 9.75',
          winddirection: 270
        },
        {
          U10: 1.42,
          U120: 0,
          class: '9.75 - 13',
          winddirection: 270
        },
        {
          U10: 0.68,
          U120: 0,
          class: '13 - 16.26',
          winddirection: 270
        },
        {
          U10: 0.2,
          U120: 0,
          class: '16.26 - 19.51',
          winddirection: 270
        },
        {
          U10: 0.05,
          U120: 0,
          class: '19.51 - 22.76',
          winddirection: 270
        },
        {
          U10: 0,
          U120: 0,
          class: '22.76 - 26.01',
          winddirection: 270
        },
        {
          U10: 0,
          U120: 0,
          class: '26.01 - 29.26',
          winddirection: 270
        },
        {
          U10: 0,
          U120: 0,
          class: '>29.26',
          winddirection: 270
        },
        {
          U10: 0.76,
          U120: 0,
          class: '<3.25',
          winddirection: 292.5
        },
        {
          U10: 2.12,
          U120: 0,
          class: '3.25 - 6.5',
          winddirection: 292.5
        },
        {
          U10: 1.81,
          U120: 0,
          class: '6.5 - 9.75',
          winddirection: 292.5
        },
        {
          U10: 1.05,
          U120: 0,
          class: '9.75 - 13',
          winddirection: 292.5
        },
        {
          U10: 0.48,
          U120: 0,
          class: '13 - 16.26',
          winddirection: 292.5
        },
        {
          U10: 0.17,
          U120: 0,
          class: '16.26 - 19.51',
          winddirection: 292.5
        },
        {
          U10: 0.03,
          U120: 0,
          class: '19.51 - 22.76',
          winddirection: 292.5
        },
        {
          U10: 0,
          U120: 0,
          class: '22.76 - 26.01',
          winddirection: 292.5
        },
        {
          U10: 0,
          U120: 0,
          class: '26.01 - 29.26',
          winddirection: 292.5
        },
        {
          U10: 0,
          U120: 0,
          class: '>29.26',
          winddirection: 292.5
        },
        {
          U10: 0.78,
          U120: 0,
          class: '<3.25',
          winddirection: 315
        },
        {
          U10: 2,
          U120: 0,
          class: '3.25 - 6.5',
          winddirection: 315
        },
        {
          U10: 1.63,
          U120: 0,
          class: '6.5 - 9.75',
          winddirection: 315
        },
        {
          U10: 0.85,
          U120: 0,
          class: '9.75 - 13',
          winddirection: 315
        },
        {
          U10: 0.3,
          U120: 0,
          class: '13 - 16.26',
          winddirection: 315
        },
        {
          U10: 0.01,
          U120: 0,
          class: '16.26 - 19.51',
          winddirection: 315
        },
        {
          U10: 0,
          U120: 0,
          class: '19.51 - 22.76',
          winddirection: 315
        },
        {
          U10: 0,
          U120: 0,
          class: '22.76 - 26.01',
          winddirection: 315
        },
        {
          U10: 0,
          U120: 0,
          class: '26.01 - 29.26',
          winddirection: 315
        },
        {
          U10: 0,
          U120: 0,
          class: '>29.26',
          winddirection: 315
        },
        {
          U10: 0.79,
          U120: 0,
          class: '<3.25',
          winddirection: 337.5
        },
        {
          U10: 2.21,
          U120: 0,
          class: '3.25 - 6.5',
          winddirection: 337.5
        },
        {
          U10: 1.72,
          U120: 0,
          class: '6.5 - 9.75',
          winddirection: 337.5
        },
        {
          U10: 0.76,
          U120: 0,
          class: '9.75 - 13',
          winddirection: 337.5
        },
        {
          U10: 0.23,
          U120: 0,
          class: '13 - 16.26',
          winddirection: 337.5
        },
        {
          U10: 0.06,
          U120: 0,
          class: '16.26 - 19.51',
          winddirection: 337.5
        },
        {
          U10: 0,
          U120: 0,
          class: '19.51 - 22.76',
          winddirection: 337.5
        },
        {
          U10: 0,
          U120: 0,
          class: '22.76 - 26.01',
          winddirection: 337.5
        },
        {
          U10: 0,
          U120: 0,
          class: '26.01 - 29.26',
          winddirection: 337.5
        },
        {
          U10: 0,
          U120: 0,
          class: '> 29.26',
          winddirection: 337.5
        }
      ]

      this.classes = [
        '<3.25',
        '3.25 - 6.5',
        '6.5 - 9.75',
        '9.75 - 13',
        '13 - 16.26',
        '16.26 - 19.51',
        '19.51 - 22.76',
        '22.76 - 26.01',
        '26.01 - 29.26',
        '> 29.26'
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
    createSeriesData() {
      return this.classes.map((c) => {
        const seriesData = this.data
          .filter((d) => d.class === c)
          .map((d) => {
            d.value = d['U10']
            return d
          })

        return {
          name: c,
          type: 'bar',
          coordinateSystem: 'polar',
          data: seriesData,
          stack: 'stack1',
          z: 0
        }
      })
    },
    updateChart() {
      document.querySelectorAll('canvas, div').forEach((e) => {
        const instance = echarts.getInstanceByDom(e)
        if (instance && instance.group === 'rosePlot') {
          instance.setOption({
            series: this.createSeriesData(),
            legend: {
              orient: 'vertical',
              title: 'Wind speed (m/s)',
              show: true,
              top: 0,
              right: 0,
              data: this.classes
            }
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
    }
  }
}
</script>

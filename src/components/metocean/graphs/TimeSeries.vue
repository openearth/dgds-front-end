<template>
  <div v-if="data.length > 0 && parameters.length > 0">
    <v-menu offset-y>
      <template v-slot:activator="{ on }">
        <v-btn text v-on="on">
          {{ selectedParameter.label }}
          <v-icon right>mdi-chevron-down</v-icon>
        </v-btn>
      </template>
      <v-list>
        <v-list-item
          v-for="(parameter, index) in parameters"
          :key="index"
          @click="selectParameter(parameter)"
        >
          <v-list-item-title>
            {{ parameter.label }}
          </v-list-item-title>
        </v-list-item>
      </v-list>
    </v-menu>
    <v-spacer></v-spacer>
    <!-- Start Date Picker -->
    <v-menu offset-y>
      <template v-slot:activator="{ on }">
        Start Date
        <v-btn text v-on="on">
          {{ selectedStartDate }}
          <v-icon right>mdi-calendar</v-icon>
        </v-btn>
      </template>
      <v-date-picker v-model="selectedStartDate" scrollable>
        <v-spacer></v-spacer>
        <v-btn text @click="closeStartDatePicker">Cancel</v-btn>
        <v-btn text @click="applyStartDatePicker">Apply</v-btn>
      </v-date-picker>
    </v-menu>
    <v-spacer></v-spacer>
    <!-- End Date Picker -->
    <v-menu offset-y>
      <template v-slot:activator="{ on }">
        End Date
        <v-btn text v-on="on">
          {{ selectedEndDate }}
          <v-icon right>mdi-calendar</v-icon>
        </v-btn>
      </template>
      <v-date-picker v-model="selectedEndDate" scrollable>
        <v-spacer></v-spacer>
        <v-btn text @click="closeEndDatePicker">Cancel</v-btn>
        <v-btn text @click="applyEndDatePicker">Apply</v-btn>
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
    Loading...
  </div>
</template>

<script>
import * as echarts from 'echarts'
import moment from 'moment'
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
      timeseriesOption: {
        tooltip: {
          trigger: 'axis',
          formatter: function(e) {
            let tooltip = ''
            e.forEach(serie => {
              tooltip += `<b style="font-weight:bold;">${serie.seriesName}:</b><br/>`
              tooltip += `Datetime: ${moment(serie.data['Date+Time']).format(
                'DD-MM-YYYY'
              )}<br/>Value: ${Math.round(serie.data.value)}`
            })
            return tooltip
          }
        },
        xAxis: {
          name: 'Datetime',
          nameLocation: 'center',
          type: 'category',
          nameGap: 30,
          axisLabel: {
            formatter: function(value) {
              console.log(value)
              // Assuming value is a timestamp
              return moment(Number(value)).format('DD-MM-YYYY')
            }
          }
        },
        yAxis: {
          name: '',
          type: 'value',
          scale: true,
          nameTextStyle: {
            align: 'left'
          }
        },
        grid: [
          {
            bottom: '30%'
          }
        ],
        dataZoom: [
          {
            type: 'inside',
            start: 0,
            end: 100
          },
          {
            start: 0,
            end: 100,
            height: 50,
            bottom: 20,
            labelFormatter: function(value, valueStr) {
              return moment(Number(valueStr)).format('DD-MM-YYYY')
            }
          }
        ],
        color: ['#FA8D0B'],
        legend: {
          orient: 'vertical',
          show: true,
          right: true
        },
        backgroundColor: 'transparent'
      },
      parameters: [],
      selectedParameter: { label: '', value: '' },
      selectedStartDate: '1984-01-01',
      selectedEndDate: '2015-12-31',
      data: []
    }
  },
  methods: {
    fetchData() {
      fetch(`/static/data/Timeseries.json`)
        .then(response => response.json())
        .then(data => {
          this.data = data
          const keys = Object.keys(data[0]).filter(d => d !== 'Date+Time')

          this.parameters = keys.map(key => ({
            label: this.customLabel(key),
            value: key
          }))

          this.appendDummyParameters()
          this.selectedParameter = this.parameters[0]
          this.$nextTick(() => {
            this.updateChart()
          })
        })
    },
    customLabel(key) {
      if (key === 'Hs (total) (m)') {
        return 'Total significant wave height Hs,tot (m)'
      }

      if (key === 'Tp (total) (s)') {
        return 'Total spectral peak wave period Tp,tot (s)'
      }

      return key
    },
    appendDummyParameters() {
      const dummyParams = [
        {
          label:
            'Horizontal 10-minute averaged wind speed at 10 m height U10 (m/s)'
        },
        {
          label:
            'Horizontal 10-minute averaged wind speed at 120 m height U120 (m/s)'
        },
        {
          label: 'Depth averaged total current velocity V,total (m/s)'
        },
        {
          label: 'Depth averaged tidal current velocity V,tidal (m/s)'
        },
        {
          label: 'Depth averaged residual current velocity V,res (m/s)'
        }
      ]

      dummyParams.forEach(({ label }) =>
        this.parameters.push({ label, value: '' })
      )
    },
    updateChart() {
      document.querySelectorAll('canvas, div').forEach(e => {
        const instance = echarts.getInstanceByDom(e)
        if (instance && instance.group === 'timeseriesv3') {
          instance.setOption({
            yAxis: {
              name: this.selectedParameter.label
            },
            xAxis: {
              data: this.data.map((d, i) => {
                const value = moment(d['Date+Time']).valueOf()
                return value
              }),
              axisLabel: {
                formatter: value => {
                  const date = moment(Number(value))
                  return date.format('DD-MM-YYYY')
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
                symbolSize: 8,
                type: 'line'
              }
            ]
          })
        }
      })
    },
    selectParameter(parameter) {
      this.selectedParameter = parameter
      this.updateChart()
    }
  },
  mounted() {
    this.fetchData()
  }
}
</script>

<style scoped></style>

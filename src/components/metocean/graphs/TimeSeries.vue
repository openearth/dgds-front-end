<!-- <template>
  <div>
    <v-btn-toggle v-model="selectedParameters" multiple>
      <v-btn
        v-for="(parameter, i) in parameters"
        :key="`${parameter}-${i}`"
        :value="parameter"
        @click="filterLegend(parameter)"
        depressed
      >
        {{ parameter }}
      </v-btn>
    </v-btn-toggle>
    <div style="width: 100%; height: 500px; margin: 8px 0px">
      <v-chart :option="timeseriesOption" autoresize group="timeseriesv2" />
    </div>
  </div>
</template> -->
<template>
  <div>
    <v-menu offset-y>
      <template v-slot:activator="{ on }">
        <v-btn text v-on="on">
          {{ selectedParameters[0] }}
          <!-- Display the selected option -->
          <v-icon right>mdi-chevron-down</v-icon>
        </v-btn>
      </template>
      <v-list>
        <v-list-item
          v-for="(parameter, i) in parameters"
          :key="`${parameter}-${i}`"
          @click="filterLegend(parameter)"
        >
          <v-list-item-title>{{ parameter }}</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-menu>

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
    <div style="width: 100%; height: 500px; margin: 8px 0px">
      <v-chart :option="timeseriesOption" autoresize group="timeseriesv2" />
    </div>
  </div>
</template>

<script>
import * as echarts from 'echarts'
import VChart, { THEME_KEY } from 'vue-echarts'
import moment from 'moment'
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
        'Horizontal 10-minute averaged wind speed at 10 m height U10 (m/s)',
        'Horizontal 10-minute averaged wind speed at 120 m height U120 (m/s)',
        'Total significant wave height Hs,tot (m)',
        'Total spectral peak wave period Tp,tot (s)',
        'Depth averaged total current velocity V,total (m/s)',
        'Depth averaged tidal current velocity V,tidal (m/s)',
        'Depth averaged residual current velocity V,res (m/s)'
      ],
      selectedParameters: [
        'Horizontal 10-minute averaged wind speed at 10 m height U10 (m/s)',
        'Horizontal 10-minute averaged wind speed at 120 m height U120 (m/s)',
        'Total significant wave height Hs,tot (m)',
        'Total spectral peak wave period Tp,tot (s)',
        'Depth averaged total current velocity V,total (m/s)',
        'Depth averaged tidal current velocity V,tidal (m/s)',
        'Depth averaged residual current velocity V,res (m/s)'
      ],
      selectedStartDate: '1984-01-01',
      selectedEndDate: '2015-12-31',
      timeseriesOption: {
        tooltip: {
          trigger: 'item',
          formatter: function(e) {
            const timeStamp = moment(Number(e.name))
            const value = Math.round(e.value)

            return `Datetime: ${timeStamp.format(
              'DD-MM-YYYY'
            )} <br/>Value: ${value}`
          }
        },
        xAxis: {
          name: 'Datetime',
          nameLocation: 'center',
          type: 'category',
          nameGap: 30,
          axisLabel: {
            formatter: '{dd}-{MM}-{yyyy}'
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
            top: 60,
            bottom: 125
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
          show: false,
          right: true,
          data: this.parameters
        },
        backgroundColor: 'transparent'
      },
      baseUrl: 'https://blueearthdata.org',
      func: '/api/timeseries',
      body: {
        locationId: 'BOX_186_057_47',
        startTime: '2023-11-04T09:53:49+01:00',
        endTime: '2023-11-14T09:53:49+01:00',
        datasetId: 'sm'
      }
    }
  },
  methods: {
    async postData(url, data) {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      })

      return response.json()
    },
    updateChart(result) {
      document.querySelectorAll('canvas, div').forEach(e => {
        const instance = echarts.getInstanceByDom(e)

        if (instance && instance.group === 'timeseriesv2') {
          const { unit, quantity } = result.observationType
          const newSeries = this.parameters.map((parameter, index) => {
            return {
              name: parameter,
              data: result.events.map(
                (event, i) =>
                  event.value + Math.floor(Math.random() * 50) + i * 10
              ),
              symbolSize: 8,
              type: 'line'
            }
          })
          instance.setOption({
            yAxis: {
              name: `${quantity} [${unit}]`,
              axisLabel: {
                formatter: e => `${e} ${unit}`
              }
            },
            xAxis: {
              data: result.events.map(item => {
                const value = moment(item.timeStamp).valueOf()

                return value
              }),
              axisLabel: {
                formatter: value => {
                  const date = moment(Number(value))

                  return date.format('DD-MM-YYYY')
                }
              }
            },
            series: newSeries
          })
          instance.on('legendselectchanged', params => {
            const indexOf = this.selectedParameters.indexOf(params.name)
            const newArr = [...this.selectedParameters]

            if (indexOf > -1) {
              newArr.splice(indexOf, 1)
            } else {
              newArr.push(params.name)
            }

            this.selectedParameters = newArr
          })
        }
      })
    },
    filterLegend(string) {
      document.querySelectorAll('canvas, div').forEach(e => {
        const instance = echarts.getInstanceByDom(e)

        if (instance && instance.group === 'timeseriesv2') {
          const indexOf = this.selectedParameters.indexOf(string)
          const newArr = [...this.selectedParameters]

          if (indexOf > -1) {
            newArr.splice(indexOf, 1)
          } else {
            newArr.push(string)
          }

          this.selectedParameters = newArr

          instance.dispatchAction({
            type: indexOf > -1 ? 'legendUnSelect' : 'legendSelect',
            name: string
          })
        }
      })
    }
  },
  mounted() {
    this.postData(`${this.baseUrl}${this.func}`, this.body).then(json => {
      if (json) {
        const result = json.results[0]
        this.updateChart(result)
      }
    })
  }
}
</script>

<style scoped></style>

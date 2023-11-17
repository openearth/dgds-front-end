<template>
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
      parameters: ['T0', 'T1', 'T2', 'T3', 'T4'],
      selectedParameters: ['T0', 'T1', 'T2', 'T3', 'T4'],
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
          show: true,
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

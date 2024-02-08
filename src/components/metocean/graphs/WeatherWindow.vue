<template>
  <div>
    <v-btn-toggle v-model="selectedExceedance" mandatory>
      <v-btn
        v-for="(exceedance, i) in exceedances"
        :key="`${exceedance}-${i}`"
        :value="exceedance"
        @click="selectExceedance(exceedance)"
        depressed
      >
        {{ exceedance }}
      </v-btn>
    </v-btn-toggle>
    <div
      style="display: flex; flex-wrap: wrap; justify-content: space-around; margin: 16px 0"
    >
      <div
        v-for="(key, index) in Object.keys(thresholds)"
        :key="`${key}-${index}`"
        style="flex: 1; min-width: 300px; margin: 10px;"
      >
        <p>
          <b>{{ key }}</b>
        </p>
        <v-select
          :items="thresholds[key]"
          v-model="selectedThresholds[key]"
          @change="selectThreshold(key, $event)"
          :label="`Select ${key}`"
          single-line
          dense
        ></v-select>
      </div>
    </div>
    <div style="width: 100%; height: 400px; margin: 8px 0px">
      <v-chart :option="lineOption" autoresize group="weatherWindow" />
    </div>
    <div style="margin-bottom: 8px">
      <v-data-table
        :key="weatherWindowKey"
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
      lineOption: null,
      weatherWindowKey: 0
    }
  },
  computed: {
    tableHeaders() {
      return [
        { text: 'Duration', value: 'duration' },
        ...this.months.map(month => ({ text: month, value: month }))
      ]
    },
    tableItems() {
      return this.durations.map(duration => {
        const item = { duration }
        this.months.forEach(month => {
          item[month] = this.getCellData(duration, month)
        })
        return item
      })
    }
  },
  methods: {
    setDefaultThresholds() {
      const defaultValues = {
        Hs: '< 1.25 m',
        U10: '< 10.0 m/s'
      }

      Object.keys(this.thresholds).forEach(key => {
        if (
          defaultValues[key] &&
          this.thresholds[key].includes(defaultValues[key])
        ) {
          this.selectedThresholds[key] = defaultValues[key]
        } else {
          this.selectedThresholds[key] = this.thresholds[key][0]
        }
      })
    },
    fetchData() {
      fetch('/static/data/PersistencyHsU10.json').then(response => {
        if (response) {
          response.json().then(json => {
            this.data = json
            this.durations = this.getUniquePropertyValues(json, 'duration')
            const newExceedances = this.getUniquePropertyValues(
              json,
              'exceedance'
            )
            this.selectedExceedance = newExceedances[0]
            this.exceedances = newExceedances
            this.thresholds = this.getUniqueThresholdKeys(json)

            this.setDefaultThresholds()
            this.updateData()
          })
        }
      })
    },
    updateData() {
      this.lineOption = {
        tooltip: { trigger: 'item', formatter: this.tooltipFormatter },
        xAxis: {
          name: 'Durations',
          nameLocation: 'center',
          nameGap: 30,
          type: 'category',
          data: this.months
        },
        yAxis: {
          name: 'Percentage of time',
          nameLocation: 'center',
          nameGap: 60,
          type: 'value',
          axisLabel: { formatter: e => `${e}%` }
        },
        series: this.createSeriesData(),
        legend: {
          orient: 'vertical',
          show: true,
          right: true,
          data: this.durations
        },
        backgroundColor: 'transparent'
      }

      this.weatherWindowKey += 1
    },
    findSeriesData(duration) {
      const filteredData = this.data.find(
        d =>
          d.duration === duration &&
          d.exceedance === this.selectedExceedance &&
          Object.keys(this.selectedThresholds).every(
            key => d.threshold[key] === this.selectedThresholds[key]
          )
      )

      return filteredData || {}
    },
    createSeriesData() {
      return this.durations.map(duration => {
        const filteredData = this.findSeriesData(duration)
        const serieData = this.months.map(month => filteredData[month])

        return { name: duration, type: 'line', symbolSize: 8, data: serieData }
      })
    },
    selectExceedance(value) {
      this.selectedExceedance = value
      this.updateData()
    },
    selectThreshold(key, value) {
      this.selectedThresholds[key] = value
      this.updateData()
    },
    getCellData(duration, key) {
      const filteredData = this.findSeriesData(duration)
      return filteredData[key]
    },
    tooltipFormatter(e) {
      const obj = this.findSeriesData(e.seriesName)
      const { duration, exceedance } = obj

      let tooltip = `Duration: ${duration} <br/>Exceedance: ${exceedance} <br/>Month: ${e.name} <br/>Value: ${e.value}%`

      Object.keys(obj.threshold).forEach(key => {
        tooltip += `<br/> Threshold ${key}: ${obj.threshold[key]}`
      })

      return tooltip
    },
    getUniquePropertyValues(arr, property) {
      return [...new Set(arr.map(obj => obj[property]))]
    },
    getUniqueThresholdKeys(arr) {
      const thresholdKeys = {}
      arr.forEach(obj => {
        const threshold = obj.threshold || {}
        Object.keys(threshold).forEach(key => {
          if (!thresholdKeys[key]) {
            thresholdKeys[key] = [threshold[key]]
          } else if (!thresholdKeys[key].includes(threshold[key])) {
            thresholdKeys[key].push(threshold[key])
          }
        })
      })

      return thresholdKeys
    }
  },
  mounted() {
    this.fetchData()
  }
}
</script>

<style scoped>
.weather-window-table {
  background-color: transparent !important;
}
</style>

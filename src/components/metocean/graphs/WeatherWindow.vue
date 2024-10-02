<template>
  <div>
    <div>
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

      <div v-if="hsParameters">
        <v-select
          v-model="selectedHs"
          :items="hsParameters"
          label="Hs"
          @change="selectHsParameter"
        />
      </div>

      <div v-if="uParameters">
        <v-select
          v-model="selectedU"
          :items="uParameters"
          label="Umag"
          @change="selectUParameter"
        />
      </div>
    </div>

    <div v-if="exceedances">
      <v-btn-toggle v-model="selectedExceedance">
        <v-btn
          v-for="(exceedance, i) in exceedances"
          :key="`${exceedance}-${i}`"
          :value="exceedance"
          @click="selectExceedance(exceedance)"
        >
          {{ exceedance }}
        </v-btn>
      </v-btn-toggle>
    </div>
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
        ref="weatherWindow"
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
        dense
        hide-default-footer
        class="weather-window-table"
      />
    </div>
  </div>
</template>

<script>
import VChart, { THEME_KEY } from 'vue-echarts'
import { mapActions, mapGetters } from 'vuex'

export default {
  components: {
    VChart
  },
  provide() {
    return { [THEME_KEY]: 'dark' }
  },
  props: {
    locationId: {
      type: [String, Number],
      default: ''
    }
  },
  data() {
    return {
      data: [],
      selectedParameter: null,
      selectedHs: null,
      selectedU: null,
      parameters: [],
      definitions: {},
      thresholdParameters: [],
      hsParameters: null,
      uParameters: null,
      durations: [],
      exceedances: null,
      months: [],
      thresholds: {},
      selectedExceedance: null,
      selectedThresholds: {},
      weatherWindowOption: {
        tooltip: {
          trigger: 'axis',
          confine: true,
          padding: 4,
          textStyle: {
            fontSize: 14
          },
          formatter: function (e) {
            let tooltip = `Month: <b>${e[0].data.month}</b><br/>`

            tooltip += '<table>'
            e.forEach((serie) => {
              tooltip += `<tr><td>${serie.marker}</td><td style="padding-right:8px;">${serie.data.duration}<td><td><b>${serie.data.value}</b></td></tr>`
            })
            tooltip += '</table>'

            return tooltip
          }
        },
        grid: {
          containLabel: true,
          top: 56,
          right: 8,
          bottom: 16,
          left: 32
        },
        xAxis: {
          name: 'Months',
          nameLocation: 'center',
          nameGap: 24,
          type: 'category',
          axisLabel: {
            formatter: (e) => {
              const months = this.months?.slice(1, this.months.length) || []
              return months[e]
            }
          }
        },
        yAxis: {
          name: 'Percentage of time',
          nameLocation: 'center',
          nameGap: 40,
          type: 'value',
          min: 0,
          max: 100,
          interval: 10,
          axisLabel: { formatter: (e) => `${e}%` }
        },
        legend: {
          orient: 'vertical',
          show: true,
          top: 32,
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
      },
      isLoading: false
    }
  },
  computed: {
    tableHeaders() {
      return [
        {
          text: 'Duration',
          value: 'duration',
          width: 60,
          class: 'weather-window-header',
          cellClass: 'weather-window-cell'
        },
        ...this.months.map((month, i) => ({
          width: i === 0 ? 60 : 40,
          text: month,
          value: month,
          class: 'weather-window-header',
          cellClass: 'weather-window-cell'
        }))
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
  watch: {
    locationId(newLocationId) {
      if (newLocationId) {
        this.getChartData()
      }
    }
  },
  mounted() {
    this.fetchParameters()
  },
  methods: {
    ...mapActions(['loadNonTimeGraphDataForLocation']),
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
    fetchParameters() {
      fetch(`/static/data/PERS_bins.json`)
        .then((response) => response.json())
        .then((json) => {
          this.months = json.period_bins
          this.durations = json.duration_bins
        })

      fetch(`/static/data/PERS-parameters.json`)
        .then((response) => response.json())
        .then((json) => {
          this.parameters = json.map((j) => {
            return {
              ...j,
              label: this.transformLabel(j.label)
            }
          })
          this.thresholdParameters = json.map((j) =>
            this.transformLabel(j.label)
          )
        })

      fetch(`/static/data/PERS-definition.json`)
        .then((response) => response.json())
        .then((json) => {
          this.definitions = json
        })
    },
    updateChart() {
      const instance = this.$refs.weatherWindow?.chart

      if (instance) {
        if (!this.data || this.data?.length === 0) {
          instance.setOption(
            {
              title: {},
              series: []
            },
            {
              replaceMerge: ['title', 'series']
            }
          )

          return
        }

        this.isLoading = true
        instance.setOption(
          { title: {}, series: [] },
          { replaceMerge: ['title', 'series'] }
        )

        instance.showLoading({
          text: 'Loading data...',
          color: '#409EFF',
          textColor: 'rgba(0,0,0,1)',
          maskColor: 'rgba(220, 220, 220, 0.8)',
          zlevel: 0
        })

        instance.on('rendered', () => {
          if (instance.getOption().series?.length > 0) {
            this.isLoading = false
            instance.hideLoading()

            instance.off('rendered')
          }
        })

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
            toolbox: {
              top: 0,
              right: 8,
              feature: {
                saveAsImage: {
                  backgroundColor: '#1E1E1E',
                  name: `Weather_window_${locationName}`,
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
                  name: `Weather_window_${locationName}`,
                  title: 'Download as CSV',
                  icon: 'M16.59 9H15V4c0-.55-.45-1-1-1h-4c-.55 0-1 .45-1 1v5H7.41c-.89 0-1.34 1.08-.71 1.71l4.59 4.59c.39.39 1.02.39 1.41 0l4.59-4.59c.63-.63.19-1.71-.7-1.71M5 19c0 .55.45 1 1 1h12c.55 0 1-.45 1-1s-.45-1-1-1H6c-.55 0-1 .45-1 1',
                  onclick: () => {
                    this.downloadAsCSV(
                      ['duration', 'month', 'value'],
                      `Weather_window_${locationName}`
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
            series: this.createSeriesData()
          },
          {
            replaceMerge: ['title', 'toolbox', 'series']
          }
        )
      }
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
        const months = this.months?.slice(1, this.months.length) || []
        const serieData = months.map((month) => ({
          duration: duration,
          month: month,
          value: filteredData[month]
        }))

        return {
          name: duration,
          type: 'line',
          showSymbol: true,
          symbolSize: 6,
          data: serieData,
          dimensions: ['month', 'value', 'duration'],
          encode: {
            x: 'month',
            y: 'value'
          }
        }
      })
    },
    createTitleText() {
      let title = ''
      if (this.selectedParameter) {
        title += `Parameter: ${this.replaceSubSupTags(this.selectedParameter.label)} \n`
      }
      if (this.selectedHs) {
        title += `Hs: ${this.selectedHs} \n`
      }
      if (this.selectedU) {
        title += `U: ${this.selectedU} \n`
      }
      if (this.selectedExceedance) {
        title += `Exceedance ${this.selectedExceedance} \n`
      }

      return title
    },
    selectParameter() {
      this.data = []

      const sel = 'PERS-' + this.selectedParameter?.value
      const definition = this.definitions[sel]

      this.selectedHs = null
      this.selectedU = null
      this.selectedExceedance = null

      this.exceedances = definition?.selection_box1?.options || null
      this.hsParameters = definition?.Hs?.options || null
      this.uParameters = definition?.U?.options || null

      this.$nextTick(() => {
        this.updateChart()
      })
    },
    selectHsParameter() {
      this.$nextTick(() => {
        this.getChartData()
      })
    },
    selectUParameter() {
      this.$nextTick(() => {
        this.getChartData()
      })
    },
    downloadAsCSV(keys, filename) {
      const instance = this.$refs.weatherWindow?.chart

      if (instance) {
        const option = instance.getOption()

        // Get the current state of the legend (which series are selected/visible)
        const legend = option.legend[0].selected

        // Add header row to CSV
        let csvContent = `data:text/csvcharset=utf-8,${keys.join(',')} \r\n`

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
    createSlice() {
      if (this.selectedHs && this.selectedU)
        return [
          0,
          this.hsParameters.indexOf(this.selectedHs),
          this.uParameters.indexOf(this.selectedU),
          this.exceedances.indexOf(this.selectedExceedance)
        ]
      else if (this.selectedHs && !this.selectedU)
        return [
          0,
          this.hsParameters.indexOf(this.selectedHs),
          this.exceedances.indexOf(this.selectedExceedance)
        ]
      else if (!this.selectedHs && this.selectedU)
        return [
          0,
          this.uParameters.indexOf(this.selectedU),
          this.exceedances.indexOf(this.selectedExceedance)
        ]
    },
    clearData() {
      this.data = []

      this.$nextTick(() => {
        this.updateChart()
      })
    },
    getChartData() {
      if (this.hsParameters != null && this.selectedHs == null) {
        this.clearData()
      } else if (this.uParameters != null && this.selectedU == null) {
        this.clearData()
      } else if (this.exceedances != null && this.selectedExceedance == null) {
        this.clearData()
      } else {
        this.loadNonTimeGraphDataForLocation({
          parameter: 'PERS-' + this.selectedParameter.value,
          slice: this.createSlice(this.selectedExceedance),
          graph: 'persistency_values'
        }).then((pointData) => {
          const { data } = pointData

          // Corresponding month names
          const months = [
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
          ]

          // Function to convert Float64Array to object structure
          const convertToObject = (dataArray) => {
            let dataObject = []

            this.durations.forEach((duration, index) => {
              let obj = {}

              months.forEach((month, indexMonth) => {
                obj[month] = Math.round(dataArray[index][indexMonth] * 100)
              })

              obj['exceedance'] = this.selectedExceedance
              obj['duration'] = duration
              obj['threshold'] = {}

              dataObject.push(obj)
            })

            return dataObject
          }

          // Mapping original data to desired format
          const transformedData = convertToObject(data.arrayData)

          this.data = transformedData

          this.$nextTick(() => {
            this.updateChart()
          })
        })
      }
    },
    selectExceedance(value) {
      this.selectedExceedance = this.selectedExceedance === value ? null : value

      this.$nextTick(() => {
        this.getChartData()
      })
    },
    selectThreshold(key, value) {
      this.selectedThresholds[key] = value

      this.$nextTick(() => {
        this.getChartData()
      })
    },
    getCellData(duration, key) {
      const filteredData = this.findSeriesData(duration)
      return filteredData[key] != undefined ? `${filteredData[key]}%` : null
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
.weather-window-table {
  background-color: transparent !important;
}
::v-deep .weather-window-table .weather-window-header,
::v-deep .weather-window-table .weather-window-cell {
  padding: 0 8px;
}
::v-deep .weather-window-table .weather-window-cell {
  font-size: 0.75rem;
}
</style>

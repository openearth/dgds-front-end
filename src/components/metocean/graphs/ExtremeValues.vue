<template>
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

    <v-select
      v-model="selectedDirection"
      :items="directions"
      label="Direction"
      @change="selectDirection"
    />

    <div style="width: 100%; height: 400px; margin: 8px 0px">
      <v-chart
        ref="extremeValues"
        :option="lineOption"
        autoresize
        group="extremeValues"
      />
    </div>
  </div>
</template>

<script>
import moment from 'moment'
import VChart, { THEME_KEY } from 'vue-echarts'
import { mapActions, mapGetters } from 'vuex'

export default {
  components: {
    VChart
  },
  provide() {
    return {
      [THEME_KEY]: 'dark'
    }
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
      parameters: [],
      definitions: [],
      bins: [],
      directions: null,
      selectedParameter: null,
      selectedDirection: null,
      lineOption: {
        grid: {
          containLabel: true,
          top: 48,
          right: 8,
          bottom: 16,
          left: 32
        },
        tooltip: {
          trigger: 'axis',
          confine: true,
          padding: 4,
          textStyle: {
            fontSize: 14
          },
          formatter: function (e) {
            let tooltip = `Return period: <b>${e[0].data[0]}</b><br/>`

            tooltip += '<table>'
            e.forEach((serie) => {
              tooltip += `<tr><td>${serie.marker}</td><td style="padding-right:8px;">${serie.seriesName}<td><td><b>${serie.data[1]}</b></td></tr>`
            })
            tooltip += '</table>'

            return tooltip
          }
        },
        xAxis: {
          name: 'Return period',
          nameLocation: 'center',
          nameGap: 24,
          type: 'log',
          axisLabel: {
            alignMinLabel: 'left',
            alignMaxLabel: 'right'
          }
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
          top: 32,
          right: 0
        },
        color: ['#F5DA4D', '#F78211', '#CB4149', '#85216B', '#3A0A63'],
        backgroundColor: 'transparent'
      },
      isLoading: false
    }
  },
  watch: {
    getActiveLocationLat: {
      immediate: true,
      handler(newVal) {
        this.activeLocationLat = newVal
      }
    },
    getActiveLocationLng: {
      immediate: true,
      handler(newVal) {
        this.activeLocationLng = newVal
      }
    },
    locationId(newLocationId) {
      if (newLocationId) {
        this.selectedDirection = null
        this.selectedParameter = null
        this.data = []

        this.$nextTick(() => {
          this.updateChart()
        })
      }
    }
  },
  mounted() {
    this.fetchParameters()
  },
  methods: {
    ...mapActions(['loadNonTimeGraphDataForLocation']),
    ...mapGetters([
      'getActiveLocationName',
      'getActiveLocationLat',
      'getActiveLocationLng'
    ]),
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
      fetch(`/static/data/EXTR-bins.json`)
        .then((response) => response.json())
        .then((bins) => {
          this.bins = bins
        })

      fetch(`/static/data/EXTR-parameters.json`)
        .then((response) => response.json())
        .then((json) => {
          this.parameters = json.map((j) => {
            return {
              ...j,
              label: this.transformLabel(j.label)
            }
          })
        })

      fetch(`/static/data/EXTR-definition.json`)
        .then((response) => response.json())
        .then((definitions) => {
          this.definitions = definitions
        })
    },
    createSeriesData() {
      return [
        {
          name: '2.5% Bound',
          type: 'line',
          data: this.data.map((line) => [
            line['return period'],
            line['2.5% bound']
          ]),
          dimensions: ['return period', '2.5% bound'],
          encode: {
            x: 'return period',
            y: '2.5% bound'
          },
          showSymbol: true,
          symbolSize: 6,
          lineStyle: {
            type: 'dashed'
          }
        },
        {
          name: 'Best estimate',
          type: 'line',
          data: this.data.map((line) => [
            line['return period'],
            line['best estimate']
          ]),
          dimensions: ['return period', 'best estimate'],
          encode: {
            x: 'return period',
            y: 'best estimate'
          },
          showSymbol: true,
          symbolSize: 6
        },
        {
          name: '97.5% Bound',
          type: 'line',
          data: this.data.map((line) => [
            line['return period'],
            line['97.5% bound']
          ]),
          dimensions: ['return period', '97.5% bound'],
          encode: {
            x: 'return period',
            y: '97.5% bound'
          },
          showSymbol: true,
          symbolSize: 6,
          lineStyle: {
            type: 'dashed'
          }
        }
      ]
    },
    formatText(dataArray) {
      let text = ''

      dataArray.forEach((item) => {
        text += `${item['return period']} year: ${item['best estimate']} (${item['2.5% bound']} - ${item['97.5% bound']}) \n`
      })

      return text
    },
    createGraphic() {
      const text = this.formatText(this.data)

      if (!text) return null

      return [
        {
          type: 'group',
          left: '12%',
          top: '12%',
          silent: true,
          children: [
            {
              type: 'rect',
              z: 100,
              shape: {
                width: 200,
                height: this.data.length * 15,
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
              top: 4,
              left: 4,
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
    getChartData(direction) {
      const sel = 'EXTR-' + this.selectedParameter.value
      const bin = this.definitions[sel].parameter.bin

      const returnPeriods = this.bins[bin]

      this.loadNonTimeGraphDataForLocation({
        parameter: sel,
        slice: [0, this.directions.indexOf(direction)],
        graph: 'extreme_values'
      }).then((pointData) => {
        const { data } = pointData

        this.data = data.arrayData
          .filter((arr) => arr[0] && arr[1] && arr[2])
          .map((arr, index) => ({
            'return period': returnPeriods[index],
            '2.5% bound': arr[0],
            'best estimate': arr[1],
            '97.5% bound': arr[2]
          }))

        this.$nextTick(() => {
          this.updateChart()
        })
      })
    },
    selectParameter() {
      this.data = []

      const sel = 'EXTR-' + this.selectedParameter?.value
      const definition = this.definitions[sel]

      // this.directions = this.definitions[sel].selection_box.options
      this.directions = definition?.selection_box?.options || null
      this.selectedDirection = null

      this.$nextTick(() => {
        this.updateChart()
      })
    },
    selectDirection(direction) {
      this.selectedDirection = direction
      this.$nextTick(() => {
        this.getChartData(direction)
      })
    },
    updateChart() {
      const instance = this.$refs.extremeValues?.chart

      if (instance) {
        if (!this.data || this.data?.length === 0) {
          instance.setOption(
            {
              title: {},
              series: [],
              graphic: null
            },
            {
              replaceMerge: ['title', 'series', 'graphic']
            }
          )

          return
        }

        this.isLoading = true
        instance.setOption({ series: [] }, { replaceMerge: ['series'] })

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
                  name: `Extreme_values_${locationName}`,
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
                  name: `Extreme_values_${locationName}`,
                  title: 'Download as CSV',
                  icon: 'M16.59 9H15V4c0-.55-.45-1-1-1h-4c-.55 0-1 .45-1 1v5H7.41c-.89 0-1.34 1.08-.71 1.71l4.59 4.59c.39.39 1.02.39 1.41 0l4.59-4.59c.63-.63.19-1.71-.7-1.71M5 19c0 .55.45 1 1 1h12c.55 0 1-.45 1-1s-.45-1-1-1H6c-.55 0-1 .45-1 1',
                  onclick: () => {
                    this.downloadAsCSV(
                      [
                        'return period',
                        '2.5% bound',
                        'best estimate',
                        '97.5% bound'
                      ],
                      `Extreme_values_${locationName}`
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
            series: this.createSeriesData(),
            graphic: this.createGraphic()
          },
          {
            replaceMerge: ['title', 'toolbox', 'series', 'graphic']
          }
        )
      }
    },
    downloadAsCSV(keys, filename) {
      const instance = this.$refs.extremeValues?.chart

      if (instance) {
        const option = instance.getOption()

        if (!this.selectedParameter || !this.selectedDirection) return

        const legend = option.legend[0]?.selected

        let csvContent = ''

        const lat = this.getActiveLocationLat()
        const lng = this.getActiveLocationLng()

        csvContent += `# Parameter: ${this.replaceSubSupTags(this.selectedParameter.label).replaceAll(",", "_")} \r\n`
        csvContent += `# Direction: ${this.selectedDirection} \r\n`
        csvContent += `# Location (lat-lon): ${lat}-${lng} \r\n`
        csvContent += `# Data generated at metoceandata.org on ${moment().format("DD-MM-YYYY HH:mm")} \r\n`
        csvContent += `# See report: https://offshore.digital-database.economie.fgov.be/#/category/60 \r\n`
        csvContent += '\r\n'

        const delimiter = ';'
        csvContent += `${keys.join(delimiter)} \r\n`

        const zoomStart = option.dataZoom?.[0]?.start / 100 || 0
        const zoomEnd = option.dataZoom?.[0]?.end / 100 || 1

        let groupedData = {}

        option.series.forEach((serie) => {
          if (serie.data && legend[serie.name] !== false) {
            const startIndex = Math.floor(zoomStart * serie.data.length)
            const endIndex = Math.ceil(zoomEnd * serie.data.length)

            serie.data.slice(startIndex, endIndex).forEach((point) => {
              const returnPeriodIndex = serie.dimensions.indexOf('return period')
              const returnPeriod = point[returnPeriodIndex]

              if (!groupedData[returnPeriod]) {
                groupedData[returnPeriod] = {}
              }

              keys.forEach((key) => {
                const keyIndex = serie.dimensions.indexOf(key)
                if (keyIndex !== -1) {
                  groupedData[returnPeriod][key] = point[keyIndex]
                }
              })
            })
          }
        })

        Object.keys(groupedData).forEach((returnPeriod) => {
          const row = [returnPeriod]
          keys.slice(1).forEach((key) => {
            row.push(groupedData[returnPeriod][key] || 'undefined')
          })
          csvContent += row.join(delimiter) + '\r\n'
        })

        // Convert CSV content to a Blob with UTF-8 BOM
        const BOM = '\uFEFF' // UTF-8 BOM
        const blob = new Blob([BOM + csvContent], { type: 'text/csv;charset=utf-8;' })

        // Create a temporary link and trigger the download
        const link = document.createElement('a')
        const url = URL.createObjectURL(blob)
        link.href = url
        link.setAttribute('download', `${filename}.csv`)
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)

        // Revoke the object URL to free up memory
        URL.revokeObjectURL(url)
      }
    },
    createTitleText() {
      let title = ''
      if (this.selectedParameter) {
        title += `Parameter: ${this.replaceSubSupTags(this.selectedParameter.label)} \n`
      }
      if (this.selectedDirection) {
        title += `Direction: ${this.selectedDirection} \n`
      }

      return title
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

<template>
  <figure
    class="graph-line"
    :class="{
      'graph-line__collapsible': collapsible,
      'graph-line--collapsed': isCollapsed,
    }"
  >
    <ui-button-icon
      v-if="collapsible"
      class="graph-line__toggle"
      label="Toggle"
      @click="toggle"
    >
      <icon-chevron />
    </ui-button-icon>
    <figcaption class="graph-line__caption strong" @click="toggle">
      {{ title }}
    </figcaption>
    <div v-if="!isCollapsed" class="graph-line__aspect-ratio">
      <v-chart
        :options="graphData()"
        :autoresize="true"
        class="graph-line__chart"
      />
      <ui-button class="download-btn" kind="quiet" @click="download()"
        >DOWNLOAD</ui-button
      >
    </div>
  </figure>
</template>

<script>
import { mapGetters } from 'vuex'
import merge from 'lodash/merge'
import UiButtonIcon from '~/components/ui-button-icon'
import UiButton from '~/components/ui-button'
import IconChevron from '~/assets/icon-action-chevron-down.svg'
import moment from 'moment'
import ECharts from 'vue-echarts'
import { saveAs } from 'file-saver'
import 'echarts/lib/chart/line'
import 'echarts/lib/component/dataZoom'
import 'echarts/lib/component/tooltip'

const getStyle = (colors = {}) => ({
  backgroundColor: colors.background,
  color: colors.pink,
  textStyle: {
    color: colors.textColor,
  },
  xAxis: {
    axisLine: {
      lineStyle: {
        color: colors.textColor,
      },
    },
  },
  yAxis: {
    axisLine: {
      lineStyle: {
        color: colors.textColor,
      },
    },
    splitLine: {
      lineStyle: {
        color: colors.formBase,
      },
    },
  },
})

const baseOptions = {
  tooltip: {
    trigger: 'axis',
    axisPointer: {
      type: 'shadow',
    },
  },
  grid: {
    show: true,
  },
  dataZoom: [
    {
      type: 'inside',
      realtime: true,
    },
  ],
  title: {
    x: 'center',
  },
  textStyle: {
    fontFamily: 'Helvetica',
  },
  xAxis: {
    type: 'category',
    axisLine: {
      onZero: false,
      show: false,
    },
    axisLabel: {
      fontSize: 14,
      formatter: value => {
        return moment(value, 'MM-DD-YYYY HH:mm').format(`HH:mm DD-MM`)
      },
    },
  },
  yAxis: {
    type: 'value',
    axisLabel: {
      fontSize: 14,
    },
    nameLocation: 'middle',
    nameGap: 30,
    nameTextStyle: {
      fontSize: 14,
      fontFamily: 'Helvetica',
    },
  },
}

export default {
  components: { UiButtonIcon, IconChevron, 'v-chart': ECharts, UiButton },
  props: {
    category: {
      type: Array,
      default: () => [],
    },
    series: {
      type: Array,
      default: () => [],
    },
    title: {
      type: String,
      default: '',
    },
    theme: {
      type: String,
      default: '',
    },
    collapsible: {
      type: Boolean,
      default: false,
    },
    units: {
      type: String,
      default: '-',
    },
  },
  data: () => ({
    isCollapsed: false,
  }),
  computed: {
    ...mapGetters('preferences/theme', ['colors']),
  },
  methods: {
    toggle() {
      if (this.collapsible) {
        this.isCollapsed = !this.isCollapsed
      }
    },
    graphData() {
      const dataOptions = {
        xAxis: {
          data: this.category,
        },
        series: this.series.map(serie => {
          return {
            type: 'line',
            showAllSymbol: true,
            data: serie,
            // symbolSize: 5,
            itemStyle: {
              normal: {
                borderWidth: 1,
              },
            },
          }
        }),
        yAxis: {
          name: `${this.title} [${this.units}]`,
        },
      }
      const theme = getStyle(this.colors)
      const result = merge(dataOptions, baseOptions, theme)
      return result
    },
    download() {
      const fileName = `${this.title}.json`

      const data = {
        title: this.title,
        timeseries: this.series,
        units: this.units,
        dates: this.category,
      }
      // Create a blob of the data
      const fileToSave = new Blob([JSON.stringify(data)], {
        type: 'application/json',
        name: fileName,
      })

      // Save the file
      saveAs(fileToSave, fileName)
    },
  },
}
</script>

<style>
.graph-line {
  position: relative;

  --caption-height: 4rem;
}

.graph-line__aspect-ratio {
  height: 0;
  overflow: hidden;
  padding-top: 60%;
  position: relative;
}

.graph-line__chart {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 90%;
}

.graph-line__collapsible .graph-line__caption {
  cursor: pointer;
}

.graph-line__toggle {
  position: absolute;
  top: calc(var(--caption-height) / 2);
  right: 0;
  transition: transform 0.25s ease-in-out;
  transform: translateY(-50%);
}

.graph-line--collapsed .graph-line__toggle {
  transform: translateY(-50%) rotate(180deg);
}

.graph-line__caption {
  padding: var(--spacing-default);
  background-color: var(--color-background);
  height: var(--caption-height);
}

#btn-div {
  height: 10%;
  position: absolute;
}
.download-btn {
  right: 0;
  bottom: 0;
  position: absolute;
}
</style>

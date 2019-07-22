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
      <div v-echarts="{ data }" class="graph-line__chart" />
    </div>
  </figure>
</template>

<script>
import { mapGetters } from 'vuex'
import merge from 'lodash/merge'
import UiButtonIcon from '~/components/ui-button-icon'
import IconChevron from '~/assets/icon-action-chevron-down.svg'

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
  },
})

const baseOptions = {
  tooltip: {
    trigger: 'axis',
    axisPointer: {
      type: 'shadow',
    },
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
    fontFamily: 'sans-serif',
  },
  xAxis: {
    type: 'category',
    axisLine: {
      onZero: false,
    },
    axisLabel: {
      fontSize: 12,
    },
  },
  yAxis: {
    type: 'value',
    axisLabel: {
      fontSize: 12,
    },
  },
}

export default {
  components: { UiButtonIcon, IconChevron },
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
  },
  data: () => ({
    isCollapsed: false,
  }),
  computed: {
    ...mapGetters('preferences/theme', ['colors']),
    data() {
      const data = {
        xAxis: {
          data: this.category,
        },
        series: this.series.map(data => ({
          type: 'line',
          showAllSymbol: true,
          data,
          symbolSize: 5,
          itemStyle: {
            normal: {
              borderWidth: 6,
            },
          },
        })),
      }

      const theme = getStyle(this.colors)
      return merge(baseOptions, theme, data)
    },
  },
  methods: {
    toggle() {
      if (this.collapsible) {
        this.isCollapsed = !this.isCollapsed
      }
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
  padding-top: 50%;
  position: relative;
}

.graph-line__chart {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
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
</style>

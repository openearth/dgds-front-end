<template>
  <figure class="graph-line">
    <!-- <figcaption class="graph-line__caption">{{ title }}</figcaption> -->
    <div v-echarts="{ options, style: theme }" class="graph-line"></div>
  </figure>
</template>

<script>
export default {
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
  },
  computed: {
    options() {
      console.log('options graph=line', this.category, this.series)
      return {
        xAxis: {
          type: 'category',
          data: this.category,
          axisLine: {
            onZero: false,
          },
        },
        yAxis: {
          type: 'value',
        },
        series: this.series.map(data => ({
          type: 'line',
          data,
        })),
      }
    },
  },
}
</script>

<style>
.graph-line {
  width: 100%;
  height: 100%;
}
</style>

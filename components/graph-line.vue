<template>
  <figure class="graph-line">
    <figcaption class="graph-line__caption">{{ title }}</figcaption>
    <div v-echarts="{ options }" class="graph-line"></div>
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
  },
  computed: {
    options() {
      return {
        xAxis: {
          type: 'category',
          data: this.category,
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

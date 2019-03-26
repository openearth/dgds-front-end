<template>
  <section class="timeseries">
    <template v-for="graph in graphs">
      <div :id="graph" :key="graph" class="graphs">
        {{ graph }}
      </div>
    </template>
  </section>
</template>

<script>
import echarts from 'echarts'

export default {
  data() {
    return {
      graphs: ['waterlevel', 'winddata'],
    }
  },
  watch: {
    graphs: {
      handler: function(graphs) {
        this.graphs = graphs
        this.createPlots()
      },
    },
  },
  mounted() {
    this.createPlots()
  },
  methods: {
    createPlots() {
      this.graphs.forEach(plotId => {
        const myChart = echarts.init(document.getElementById(plotId))
        const option = {
          xAxis: {
            type: 'category',
            data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
          },
          yAxis: {
            type: 'value',
          },
          series: [
            {
              data: [820, 932, 901, 934, 1290, 1330, 1320],
              type: 'line',
            },
          ],
        }
        myChart.setOption(option)
      })
    },
  },
}
</script>

<style>
.timeseries {
  width: 100vw;
  height: 100vh;
  overflow-y: scroll;
}
.graphs {
  width: 360px;
  height: 300px;
  margin: auto;
}
</style>

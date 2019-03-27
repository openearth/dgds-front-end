<template>
  <section class="timeseries">
    <div v-for="graph in graphs" :id="graph.id" :key="graph.id" class="graphs">
      {{ graph.id }}
    </div>
  </section>
</template>

<script>
import echarts from 'echarts'

export default {
  data() {
    return {
      graphs: [{ id: 'test' }],
    }
  },
  watch: {
    graphs: {
      handler: function(graphs) {
        // this.graphs = graphs
        console.log('graphs', this.graphs)
        this.graphs.forEach(graph => {
          this.createPlot(graph)
        })
      },
    },
  },
  mounted() {
    this.fetchTimeseries()
  },
  methods: {
    fetchTimeseries() {
      // this.graphs = []
      fetch('http://localhost:3001/api/v1/timeseries')
        .then(response => response.json())
        .then(res => {
          // Only use the reults which contain events
          const events = res.results.filter(x => x.events)
          const newGraphs = []

          events.forEach(result => {
            // For each event store the timeserie data in graphs
            const times = result.events.map(e => e.timeStamp)
            const values = result.events.map(e => e.value)
            newGraphs.push({
              id: result.id,
              values: values,
              times: times,
            })
          })
          this.graphs = newGraphs
        })
        .catch(error => {
          console.log('Request failed', error)
          this.graphs = []
        })
    },
    createPlot(plotSettings) {
      console.log(plotSettings.id)
      console.log('test', this.$el.childNodes[`div#${plotSettings.id}`])
      const el = document.getElementById(plotSettings.id)

      console.log(plotSettings.id, el)
      const myChart = echarts.init(el)
      console.log(myChart)
      const option = {
        xAxis: {
          type: 'category',
          data: plotSettings.times,
        },
        yAxis: {
          type: 'value',
        },
        series: [
          {
            type: 'line',
            data: plotSettings.values,
          },
        ],
      }
      myChart.setOption(option)
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

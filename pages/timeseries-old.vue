<template>
  <section class="timeseries">
    <template v-for="graph in graphs">
      <div :id="graph.id" :key="graph" class="graphs">
        {{ graph.id }}
      </div>
    </template>
  </section>
</template>

<script>
import echarts from 'echarts'

export default {
  data() {
    return {
      graphs: [],
    }
  },
  watch: {
    graphs: {
      handler: function(graphs) {
        this.graphs = graphs
        this.createPlot()
      },
    },
  },
  mounted() {
    this.fetchTimeseries()
  },
  methods: {
    fetchTimeseries() {
      this.graphs = []
      fetch('http://localhost:3001/api/v1/timeseries')
        .then(response => response.json())
        .then(res => {
          res.results.forEach(result => {
            const data = result.events.map(e => Object.values(e))
            console.log('data', data)
            this.graphs.push({
              id: result.id,
              data: data,
            })
          })
        })
        .catch(error => {
          console.log('Request failed', error)
          this.graphs = []
        })
    },
    createPlot() {
      console.log(this.graphs)
      this.graphs.forEach(graph => {
        const myChart = echarts.init()
        const option = {
          series: [
            {
              data: graph.data,
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

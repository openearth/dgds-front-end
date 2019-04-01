<template>
  <section class="timeseries">
    <GraphLine
      v-for="(data, key) in datasets"
      :key="key"
      class="graphs"
      :category="data.category"
      :series="[data.serie]"
      :title="data.title"
      :theme="theme"
    />
    <div style="position: absolute; top: 0; left: 0;">
      <select @change="changeTheme">
        <option value="dark">Dark</option>
        <option value="light">Light</option>
      </select>
    </div>
  </section>
</template>

<script>
import GraphLine from '~/components/graph-line'
import moment from 'moment'

export default {
  components: { GraphLine },
  data: () => ({
    datasets: [],
    theme: 'dark',
  }),
  async asyncData() {
    const setnames = ['waterlevel', 'winddata']
    const datasets = await Promise.all(
      setnames.map(set => {
        return fetch('http://localhost:5000/dummytimeseries')
          .then(response => response.json())
          .then(res => {
            const events = res.results.filter(x => x.events)
            const category = events[0].events.map(event => {
              return moment(event.timeStamp).format('MM-DD-YYYY \n HH:mm')
            })
            return {
              title: set,
              category: category,
              serie: events[0].events.map(event => event.value),
            }
          })
      }),
    )
    console.log('datasets', datasets)
    return { datasets }
  },
  methods: {
    changeTheme(event) {
      this.theme = event.target.value
    },
  },
}
</script>

<style>
.timeseries {
  width: 100vw;
  height: 100vh;
  overflow-y: scroll;
  position: relative;
}
.graphs {
  width: 100%;
  height: 100%;
  margin: auto;
}
</style>

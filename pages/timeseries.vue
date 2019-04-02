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
        return fetch('http://localhost:3001/timeseries')
          .then(response => response.json())
          .then(res => {
            const events = res.results.filter(x => x.events)
            const category = events[0].events.map(event => {
              return moment(event.timeStamp).format('MM-DD-YYYY \n HH:mm')
            })
            return {
              id: set,
              title: set,
              category: category,
              serie: events[0].events.map(event => event.value),
            }
          })
      }),
    )
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
  width: 80vw;
  height: 80vh;
  overflow-y: scroll;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
.graphs {
  width: 100%;
  height: 50%;
  margin: auto;
}
</style>

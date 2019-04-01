<template>
  <section class="timeseries">
    <GraphLine
      class="graphs"
      :category="category"
      :series="[serie]"
      :title="title"
      :theme="theme"
    />
    <div style="position: absolute; top: 0; left: 0;">
      <select @change="changeStyle">
        <option value="dark">Dark</option>
        <option value="light">Light</option>
      </select>
    </div>
  </section>
</template>

<script>
import GraphLine from '~/components/graph-line'
export default {
  components: { GraphLine },
  data: () => ({
    category: [],
    serie: [],
    title: 'My title',
    theme: 'dark',
  }),
  async asyncData() {
    const result = await fetch('http://localhost:5000/dummytimeseries')
      .then(response => response.json())
      .then(res => {
        const events = res.results.filter(x => x.events)
        return {
          category: events[0].events.map(event => event.timeStamp),
          serie: events[0].events.map(event => event.value),
        }
      })
    return result
  },
  methods: {
    changeStyle(event) {
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

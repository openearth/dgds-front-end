<template>
  <section class="timeseries">
    <GraphLine
      class="graphs"
      :category="category"
      :series="[serie]"
      :title="title"
    />
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
  }),
  async asyncData() {
    const result = await fetch('http://localhost:3001/api/v1/timeseries')
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
}
</script>

<style>
.timeseries {
  width: 100vw;
  height: 100vh;
  overflow-y: scroll;
}
.graphs {
  width: 100%;
  height: 100%;
  margin: auto;
}
</style>

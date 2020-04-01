<template>
  <div>
    <svg viewBox="0 0 100 5">
      <defs>
        <linearGradient id="gradient" x1="0" x2="1" y1="0" y2="0">
          <stop
            v-for="(stop, i) in activeRasterLegendData.linearGradient"
            :key="i"
            :offset="stop.offset"
            :style="{
              'stop-color': stop.color,
              'stop-opacity': stop.opacity,
            }"
          />
        </linearGradient>
      </defs>
      <rect width="100" height="10" x="0" y="0" fill="url('#gradient')" />
    </svg>
    <div id="legend-span" class="unselectable">
      {{ `${activeRasterLegendData.min} ${activeRasterLegendData.max}` }}
    </div>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex'

  export default {
    computed: {
      ...mapGetters('map', ['activeRasterLegendData']),
    },
  }
</script>

<style>
  #legend-span {
    width: 100%;
    height: 10px;
    display: inline-block;
    text-align: justify;
    text-align-last: justify;
  }
</style>

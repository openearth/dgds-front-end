<template>
  <v-container class="ma-0 pa-0">
    <span class="legend" role="presentation">
      <span v-html="legend" />
    </span>
  </v-container>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  props: {
    datasetId: {
      type: String,
      required: true
    }
  },
  data () {
    return {
      dataset: {}
    }
  },
  computed: {
    ...mapGetters(['getDatasets']),
    legend () {
      try {
        // TODO: read name of legend file from STAC catalog
        return require('../assets/icons/legend/legenda.svg')
      } catch {
        return require('../assets/icons/icon-placeholder.svg')
      }
    }
  },
  mounted () {
    this.dataset = this.getDatasets[this.datasetId]
  }
}
</script>

<style>
.legend {
  display: inline-block;
  width: 320px;
  height: 130px;
}

.legend--large {
  width: 5rem;
  height: 5rem;
}

.legend span {
  display: block;
  width: 100%;
  height: 100%;
}

.legend svg {
  display: block;
  width: 110%;
  height: 100%;
  fill: currentColor;
}
</style>

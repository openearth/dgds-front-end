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
        // const subFolder = this.iconFolder ? `${this.iconFolder}/` : ''
        console.log('IAMLEGEND', require('../assets/icons/legend/legenda.svg'))
        return require('../assets/icons/legend/legenda.svg')
      } catch {
        console.log('IAMNOTLEGEND')
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
  height: 100px;
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
  width: 100%;
  width: 100%;
  height: 100%;
  fill: currentColor;
}
</style>

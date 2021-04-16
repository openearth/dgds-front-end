<template>
  <div class="data-set-controls">
    <v-card dark raised>
      <v-card-text>
        <h2> {{ themeName }} </h2>
      </v-card-text>
    </v-card>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import _ from 'lodash'

export default {
  computed: {
    ...mapGetters([
      'getActiveRasterLayer',
      'getActiveTheme',
      'getDatasets',
      'activeRasterData'
    ]),
    themeName () {
      return _.get(this.getActiveTheme, 'name') || 'All datasets'
    }
  }
}
</script>

<style scoped>
.data-set-controls {
  position: absolute;
  top: var(--spacing-default);
  right: var(--spacing-default);
  max-height: calc(100vh - var(--spacing-large) - var(--map-controls-height));
  height: 400px;
  width: 400px;
  z-index: 5;
}
</style>

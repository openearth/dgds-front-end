<template>
  <Panel class="timestamp">
    <span class="timestamp__title">{{ timestamp }}</span>
  </Panel>
</template>

<script>
import Panel from './panel'

export default {
  components: { Panel },
  props: {
    timestamp: {
      type: String,
      default: () => '',
    },
  },
}
</script>

<style>
.timestamp__title {
  display: flex;
  align-items: center;
}
</style>

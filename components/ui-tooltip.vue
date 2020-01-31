<template>
  <div class="tooltip">
    <slot />
    <span class="tooltiptext">
      <VueMarkdown :source="tooltipText" />
    </span>
  </div>
</template>

<script>
import VueMarkdown from 'vue-markdown'

export default {
  components: {
    VueMarkdown
  },
  props: {
    tooltipText: {
      type: String,
      default: ''
    }
  }
}
</script>

<style>
.tooltip {
  position: relative;
  display: inline-block;
  border-bottom: 1px dotted black;
}

.tooltip .tooltiptext {
  visibility: hidden;
  background-color: var(--color-form-base);
  color: var(--color-text-color);
  padding: 4px;
  border-radius: 4px;
  position: absolute;
  left: 0;
  max-width: 220px;
  z-index: 1;
  top: 100%;
  word-wrap: break-word;
  text-align: center;
}

.tooltip:hover .tooltiptext {
  visibility: visible;
}
</style>

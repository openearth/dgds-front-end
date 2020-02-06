<template>
  <div class="tooltip">
    <slot />
    <VueMarkdown :source="tooltipText" class="tooltiptext"/>
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
  width: calc(20rem - var(--spacing-small));
}

.tooltip .tooltiptext {
  visibility: hidden;
  background-color: var(--color-form-base);
  color: var(--color-text-color);
  padding: 4px;
  border-radius: 4px;
  position: absolute;
  left: 0;
  z-index: 1;
  top: calc(var(--spacing-default) + 0.5 * var(--spacing-small));
  word-wrap: break-word;
  text-align: left;
}
.tooltiptext {
  width: calc(20rem - 2 * var(--spacing-small) - 8px);
}

.tooltip:hover .tooltiptext {
  visibility: visible;
}
</style>

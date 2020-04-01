<template>
  <div class="tooltip">
    <slot />
    <vue-markdown :source="tooltipText" class="tooltiptext" />
  </div>
</template>

<script>
  import VueMarkdown from 'vue-markdown'

  export default {
    components: {
      VueMarkdown,
    },
    props: {
      tooltipText: {
        type: String,
        default: '',
      },
    },
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
    /* placement just half a spacing (small) under the ion (spacin default) */
    top: calc(var(--spacing-default) + 0.5 * var(--spacing-small));
    word-wrap: break-word;
    text-align: left;
  }
  .tooltiptext {
    /* set the width to the same with as being used in the panel, but with a small
  spacing and 4px of padding left for the tooltip rounding */
    width: calc(20rem - 2 * var(--spacing-small) - 8px);
  }

  .tooltip:hover .tooltiptext {
    visibility: visible;
  }
</style>

<template>
  <section class="panel">
    <header v-if="hasHeader" class="panel__header">
      <slot name="header" />
    </header>

    <div class="panel__body scrollbar">
      <slot />
    </div>

    <footer v-if="hasFooter" class="panel__footer">
      <slot name="footer" />
    </footer>
  </section>
</template>

<script>
  export default {
    props: {
      title: {
        type: String,
        default: '',
      },
    },
    computed: {
      hasHeader() {
        return !!this.$slots.header
      },
      hasFooter() {
        return !!this.$slots.footer
      },
    },
  }
</script>

<style>
  .panel {
    display: flex;
    flex-direction: column;
    overflow: auto;
    border-radius: 4px;
    background-color: var(--color-background);
    box-shadow: var(--shadow);
  }

  .panel__header {
    padding: 0 var(--spacing-small);
  }

  .panel__body {
    padding: 0 var(--spacing-small) var(--spacing-small);
    overflow-x: auto;
  }
</style>

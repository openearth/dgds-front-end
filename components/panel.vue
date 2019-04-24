<template>
  <section class="panel">
    <header class="panel__header">
      <slot name="header" />
    </header>

    <section class="panel__body">
      <slot />
    </section>

    <footer class="panel__footer">
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
}
</script>

<style>
.panel {
  background-color: var(--color-background);
  box-shadow: var(--shadow);
  border-radius: 4px;
  display: flex;
}

.panel__body {
  padding: var(--spacing-default);
  overflow-y: scroll;
  flex: 1;
}
</style>

<template>
  <aside class="about-id scrollbar">
    <header class="about-id__header">
      <h2 class="h2">About</h2>
    </header>
  </aside>
</template>

<script>
export default {}
</script>

<style>
.about-id {
  width: 50vw;
  max-width: 600px;
  height: 100vh;
  position: absolute;
  top: 0;
  left: var(--site-nav-width-collapsed);
  background-color: var(--color-background);
  box-shadow: var(--shadow);
  overflow-x: hidden;
}

.about-id__header {
  padding-left: var(--spacing-small);
  padding-top: var(--spacing-small);

  display: flex;
  justify-content: space-between;
}
</style>

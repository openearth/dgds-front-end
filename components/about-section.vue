<template>
  <aside class="about-id scrollbar">
    <header class="about-id__header">
      <h2 class="h2">
        About
      </h2>
    </header>
    <section class="about-id__section">
      <VueMarkdown
        class="about-text"
        :source="require('~/assets/docs/about-text.md').html"
      />
    </section>
  </aside>
</template>

<script>
import VueMarkdown from 'vue-markdown'

export default {
  name: 'AboutSection',
  components: {
    VueMarkdown
  },
  data () {
    return {
      aboutText: ''
    }
  }
}
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

.about-id__section {
  padding: var(--spacing-small);
}
</style>

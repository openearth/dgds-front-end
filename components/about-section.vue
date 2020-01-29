<template>
  <aside class="about-section scrollbar">
    <header class="about-section__header">
      <h2 class="h2">
        About
      </h2>
    </header>
    <section class="about-section__section">
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
.about-section {
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

.about-section__header {
  padding-left: var(--spacing-small);
  padding-top: var(--spacing-small);

  display: flex;
  justify-content: space-between;
}

.about-section__section {
  padding: var(--spacing-small);
}
</style>

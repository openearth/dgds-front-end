<template>
  <v-navigation-drawer class="pl-16" permanent absolute width="40vw">
    <v-container>
      <h2 class="h3">
        About
      </h2>
      <vue-markdown
        class="markdown"
        :watches="['source']"
        :source="aboutText"
        :anchor-attributes="{ target: '_blank' }"
      />
    </v-container>
  </v-navigation-drawer>
</template>

<script>
import VueMarkdown from 'vue-markdown'

export default {
  data () {
    return {
      aboutText: ''
    }
  },
  components: {
    VueMarkdown
  },
  mounted () {
    fetch('/docs/about-text.md')
      .then(res => {
        return res.text()
      })
      .then(response => {
        this.aboutText = response
      })
  }
}
</script>

<style lang="css" scoped></style>

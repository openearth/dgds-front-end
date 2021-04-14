<template>
  <v-navigation-drawer class="pl-16" permanent absolute width="40vw" height="100%">
    <v-container fill-height>
      <h2 class="h3 flex-shrink-1">
        About
      </h2>
      <div
        class="markdown flex-grow-1 scrollbar"
        :watches="['source']"
        v-html="aboutText"
        :anchor-attributes="{ target: '_blank' }"
      />
    </v-container>
  </v-navigation-drawer>
</template>

<script>
import aboutText from '@/assets/docs/about-text.md'

export default {
  data () {
    return {
      aboutText
    }
  }
}
</script>

<style lang="css" scoped>
</style>

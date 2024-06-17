<template>
  <v-navigation-drawer
    class="pl-16"
    permanent
    absolute
    width="40vw"
    color="background"
  >
    <v-container class="account d-flex flex-column">
      <h2 class="h2">
        About
      </h2>
      <v-btn
        icon
        class="close-button"
        @click="$emit('close-about')"
      >
        <v-icon>mdi-close</v-icon>
      </v-btn>
      <div
        class="markdown flex-grow-1 py-3 scrollbar"
        :watches="['source']"
        v-html="aboutText"
      />
    </v-container>
  </v-navigation-drawer>
</template>

<script>
import aboutText from '@/assets/docs/about-text.md'

export default {
  data() {
    return {
      aboutText
    }
  }
}
</script>

<style lang="css" scoped></style>

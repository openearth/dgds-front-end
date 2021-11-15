<template>
  <v-flex class="stories pl-15">
    <v-row>
      <v-col cols="8">
        stories
      </v-col>
      <v-col cols="4">
        news
      </v-col>
    </v-row>
    <v-img
      max-width="200px"
      contain
      class="background-logo"
      src="../assets/images/deltares_logo.png"
    />
  </v-flex>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'

export default {
  name: 'Stories',
  mounted () {
    this.loadNews()
    this.loadStories()
  },
  computed: {
    ...mapGetters(['stories', 'news'])
  },
  methods: {
    ...mapActions(['loadNews', 'loadStories'])
  }
}
</script>

<style scoped>
.stories {
  width: 100%;
  height: 100%;
  background-image: url("../assets/images/BlueEarthData_Background.png");
  background-size: cover;
  background-color: black;
}

.background-logo {
  position: absolute;
  bottom: var(--spacing-default);
  right: var(--spacing-default);
}
</style>

<template>
  <v-flex class="stories pl-15">
    <v-row>
      <v-col cols="8" class="pa-4">
        <v-container>
          <h2 class="h2">
            Stories
          </h2>
          <v-card
            color="rgba(0, 0, 0, 0)"
            rounded
            outlined
            class="stories-card"
          >
          <v-card-title>
            Theme
          </v-card-title>
          <v-list
            color="rgba(0, 0, 0, 0)"
            >
            <v-list-item
              v-for="story in stories"
              :key="story.ID"
            >
              <v-list-item-avatar>
                <v-img :src="story.icon"></v-img>
              </v-list-item-avatar>

              <v-list-item-content>
                <v-list-item-title v-text="story.title"></v-list-item-title>
              </v-list-item-content>

              <v-list-item-action>
                <v-btn icon :href="story.URL" target="_blank">
                  <v-icon color="grey lighten-1">mdi-link</v-icon>
                </v-btn>
              </v-list-item-action>
            </v-list-item>
          </v-list>
          </v-card>
        </v-container>
      </v-col>
      <v-col cols="4" class="pa-4">
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

.stories-card {
  border-color: white !important;
}
</style>

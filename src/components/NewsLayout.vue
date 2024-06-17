<template>
  <v-card
    color="rgba(0, 0, 0, 0)"
    rounded
    outlined
    class="stories-card"
  >
    <v-list color="rgba(0, 0, 0, 0)">
      <v-list-item
        v-for="(feed, index) in feeds"
        :key="index"
      >
        <v-list-item-content>
          <!-- <v-list-item-title v-text="feed.title" /> -->

          <div v-text="feed.title" />
          <v-list-item-title>{{ content }}</v-list-item-title>

          <!-- <v-list-item-subtitle class="text-subtitle-1" v-text="feed.source" /> -->

          <div
            class="text-subtitle-1"
            v-text="feed.source"
          />
          <v-list-item-subtitle>{{ content }}</v-list-item-subtitle>
        </v-list-item-content>

        <v-list-item-action>
          <!-- <v-list-item-action-text v-text="feed.date" /> -->
          <div v-text="feed.date" />
          <v-list-item-action-text>{{ content }}</v-list-item-action-text>
          <v-btn
            icon
            :href="feed.URL"
            target="_blank"
            rel="noopener"
          >
            <v-icon color="grey lighten-1">
              mdi-exit-to-app
            </v-icon>
          </v-btn>
        </v-list-item-action>
      </v-list-item>
    </v-list>
  </v-card>
</template>
<script>
export default {
  props: {
    feeds: {
      type: Array,
      default: () => []
    }
  }
}
</script>
<style>
.stories-card {
  border-color: white !important;
  margin-bottom: 10px;
}
</style>

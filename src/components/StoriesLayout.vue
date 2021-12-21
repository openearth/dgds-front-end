<template>
  <v-card
    color="rgba(0, 0, 0, 0)"
    rounded
    outlined
    class="stories-card"
      >
      <v-card-title>
        <custom-icon :name="theme" iconFolder="themes" class="ma-2"/>
        <span><strong>{{ theme }}</strong></span>
      </v-card-title>
      <v-list
        color="rgba(0, 0, 0, 0)"
        >
        <v-list-item
          v-for="story in stories"
          :key="story.ID"
        >
          <v-list-item-avatar size="130" >
            <v-img :src="story.icon"></v-img>
          </v-list-item-avatar>

          <v-list-item-content>
            <v-list-item-title v-text="story.title"></v-list-item-title>
          </v-list-item-content>

          <v-list-item-action>
            <v-btn icon :href="story.URL" target="_blank" rel="noopener">
              <v-icon color="grey lighten-1">mdi-exit-to-app</v-icon>
            </v-btn>
          </v-list-item-action>
        </v-list-item>
      </v-list>
    </v-card>
</template>
<script>
import CustomIcon from '@/components/CustomIcon'

export default {
  props: {
    stories: {
      type: Array,
      default: () => []
    },
    theme: {
      type: String,
      default: null
    }
  },
  components: {
    CustomIcon
  }
}
</script>
<style>

.stories-card {
  border-color: white !important;
  margin-bottom: 10px;
  border-width: medium !important;
}

</style>

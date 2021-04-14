<template>
  <v-card>
    <v-navigation-drawer
      v-model="drawer"
      :mini-variant.sync="mini"
      stateless
      fixed
      expand-on-hover
    >
      <v-list dense class="pa-0">
        <v-list-item class="px-2" link :to="{ name: 'home' }">
          <v-list-item-avatar>
            <custom-icon name="deltares" />
          </v-list-item-avatar>

          <v-list-item-title>Deltares</v-list-item-title>

          <v-btn icon @click.stop="mini = !mini">
            <v-icon>mdi-chevron-left</v-icon>
          </v-btn>
        </v-list-item>
        <v-divider></v-divider>
        <v-list-item-group color="primary">
          <v-list-item
            v-for="item in items"
            :key="item.title"
            link
            :to="{ name: item.name }"
          >
            <v-list-item-icon>
              <v-icon>{{ item.icon }}</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title>{{ item.title }}</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list-item-group>
      </v-list>

      <v-spacer />
      <template v-slot:append>
        <v-list dense class="pa-0">
          <v-list-item-group color="primary" class="bottom-menu">
            <v-list-item link :to="{ name: 'about' }">
              <v-list-item-icon>
                <custom-icon name="info" />
              </v-list-item-icon>
              <v-list-item-content>
                <v-list-item-title>About</v-list-item-title>
              </v-list-item-content>
            </v-list-item>
            <v-list-item link :to="{ name: 'account' }">
              <v-list-item-icon>
                <custom-icon name="account" />
              </v-list-item-icon>
              <v-list-item-content>
                <v-list-item-title>Account</v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </v-list-item-group>
        </v-list>
      </template>
    </v-navigation-drawer>
  </v-card>
</template>

<script>
import CustomIcon from '@/components/CustomIcon'

export default {
  components: {
    CustomIcon
  },
  data () {
    return {
      drawer: true,
      items: [{ title: 'Editor', name: 'editor', icon: 'mdi-circle-edit-outline' }],
      mini: true
    }
  }
}
</script>

<style>
.bottom-menu {
  position: absolute;
  bottom: 0;
}
</style>

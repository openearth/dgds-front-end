<template>
  <v-card color="background">
    <v-navigation-drawer
      v-model="drawer"
      :mini-variant.sync="mini"
      stateless
      fixed
      expand-on-hover
      color="background"
    >
      <v-list dense class="pa-0">
        <v-list-item class="px-2" @click="$router.push({ name: 'home' })" data-v-step="1">
          <v-list-item-avatar >
            <custom-icon name="deltares" />
          </v-list-item-avatar>
          <v-list-item-content>
            <v-list-item-title color="primary">Deltares</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-divider></v-divider>
        <v-list-item-group color="primary" active-class="active-theme">
          <v-list-item
            v-for="item in getThemes"
            :key="item"
            @click="toggleTheme(item)"
            :active="isActive(item)"
            :data-v-step="item === 'Flooding' ? '2' : false"
          >
            <v-list-item-icon class="mr-6">
              <custom-icon :name="item" iconFolder="themes"/>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title>{{ item }}</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list-item-group>
      </v-list>
      <template v-slot:append>
        <div>
          <v-list dense class="pa-0">
            <v-list-item @click="$emit('toggle-tour')">
              <v-list-item-icon class="mr-6">
                <v-icon>mdi-flag-outline</v-icon>
              </v-list-item-icon>
              <v-list-item-content>
                <v-list-item-title>Tour</v-list-item-title>
              </v-list-item-content>
            </v-list-item>
            <v-list-item-group active-class="active-theme">
              <v-list-item @click="$emit('toggle-about')">
                <v-list-item-icon class="mr-6">
                  <custom-icon name="info" />
                </v-list-item-icon>
                <v-list-item-content>
                  <v-list-item-title>About</v-list-item-title>
                </v-list-item-content>
              </v-list-item>
              <v-list-item @click="$emit('toggle-account')">
                <v-list-item-icon class="mr-6">
                  <custom-icon name="account" />
                </v-list-item-icon>
                <v-list-item-content>
                  <v-list-item-title data-v-step="6">Account</v-list-item-title>
                </v-list-item-content>
              </v-list-item>
            </v-list-item-group>
          </v-list>
        </div>
      </template>
    </v-navigation-drawer>
  </v-card>
</template>

<script>
import CustomIcon from '@/components/CustomIcon'
import { mapGetters, mapMutations } from 'vuex'

export default {
  components: {
    CustomIcon
  },
  computed: {
    ...mapGetters(['getThemes', 'getActiveTheme'])
  },
  data () {
    return {
      drawer: true,
      mini: true,
      activeTheme: null
    }
  },
  methods: {
    ...mapMutations(['toggleActiveTheme']),
    isActive (id) {
      return this.activeTheme === id
    },
    toggleTheme (id) {
      this.toggleActiveTheme(id)

      if (this.activeTheme === id) {
        this.activeTheme = null
      } else {
        this.activeTheme = id
      }

      this.$emit('change-theme')
    }
  }
}
</script>

<style>
.active-theme {
  color: var(--v-blue100-base) !important;
}
</style>

<template>
  <div class="ui-test-layout" style="position: relative;">
    <div style="position: absolute; bottom: 2rem; right: 3rem;">
      <select @change="setActive">
        <option value="light">Light</option>
        <option value="dark">Dark</option>
      </select>
    </div>
    <nuxt />
  </div>
</template>

<script>
import head from 'lodash/head'
import includes from 'lodash/fp/includes'
import pipe from 'lodash/fp/pipe'
import split from 'lodash/fp/split'
import join from 'lodash/fp/join'
import filter from 'lodash/fp/filter'
import update from 'lodash/fp/update'
import negate from 'lodash/fp/negate'
import concat from 'lodash/fp/concat'
import isEqual from 'lodash/fp/isEqual'
import identity from 'lodash/fp/identity'
import { mapState, mapGetters, mapActions, mapMutations } from 'vuex'
import DataSetControlMenu from '../components/data-set-control-menu'
import TimeStamp from '../components/time-stamp'
import { when } from '../lib/utils'

export default {
  computed: {
    ...mapState({
      activeTheme: state => state.preferences.theme.active,
    }),
  },
  methods: {
    ...mapMutations({ setActiveTheme: 'preferences/theme/setActive' }),
    setActive(event) {
      this.setActiveTheme(event.target.value)
    },
  },
}
</script>

<style>
.ui-test-layout {
  width: 100vw;
  min-height: 100vh;
  background-color: var(--color-background);
}
</style>

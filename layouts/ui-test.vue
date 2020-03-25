<template>
  <div class="ui-test-layout" style="position: relative;">
    <div style="position: absolute; top: 2rem; right: 3rem;">
      <select @change="setActive">
        <option value="light">
          Light
        </option>
        <option value="dark">
          Dark
        </option>
      </select>
    </div>
    <nuxt />
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex'

export default {
  computed: {
    ...mapState({
      activeTheme: state => state.preferences.theme.active
    })
  },
  methods: {
    ...mapMutations({ toggleActiveTheme: 'preferences/theme/setActive' }),
    setActive (event) {
      this.toggleActiveTheme(event.target.value)
    }
  }
}
</script>

<style>
.ui-test-layout {
  width: 100vw;
  min-height: 100vh;
  background-color: var(--color-background);
}
</style>

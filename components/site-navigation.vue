<template>
  <nav
    class="site-navigation"
    :class="{ 'site-navigation--expanded': timeseriesOpen }"
    label="site navigation"
    @keydown.esc="collapse"
  >
    <ul class="site-navigation__list">
      <li v-for="(theme, key) in getThemes" :key="key">
        <div class="site-navigation__list-item"
          >
          <UiButtonIcon
            :class="{ 'site-navigation__list-item--active': checkActive(theme.id) }"
            @click="toggleTheme(theme.id)"
          >
            <Icon
              size="large"
              :name="`theme-${theme.id}`"
              fallback-name="placeholder"
            />
          </UiButtonIcon>
          <span
            class="site-navigation__text h4"
            :class="{ 'site-navigation__list-item--active': checkActive(theme.id) }"
            @click="toggleTheme(theme.id)"
            >{{ theme.name }}</span
          >
        </div>
      </li>
    </ul>
    <div class="site-navigation__toggle-wrapper">
      <UiButtonIcon @click="toggleExpanded">
        <Icon size="large" name="collapse" fallback-name="placeholder" />
      </UiButtonIcon>
    </div>
  </nav>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex'
import UiButtonIcon from './ui-button-icon'
import Icon from './icon'

export default {
  components: { UiButtonIcon, Icon },
  data: () => ({
    expanded: false,
    activeTheme: null,
  }),
  computed: {
    ...mapGetters('map/themes', ['getThemes', 'getActiveTheme']),
    timeseriesOpen() {
      const { locationId } = this.$route.params
      if(locationId) {
        this.collapse()
      }
      return this.expanded
    }
  },
  methods: {
    ...mapMutations('map', ['toggleActiveTheme']),
    checkActive(id) {
      return this.activeTheme === id
    },
    toggleTheme(id) {
      this.toggleActiveTheme(id)
      this.$emit('change-theme')
      if (this.activeTheme === id) {
        this.activeTheme = null
      } else {
        this.activeTheme = id
      }
    },
    expand() {
      this.expanded = true
    },
    collapse() {
      this.expanded = false
    },
    toggleExpanded() {
      this.expanded = !this.expanded
    },
  },
}
</script>

<style>
.site-navigation {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 100%;
  position: relative;
  z-index: 0;
}
.site-navigation:before {
  content: '';
  display: block;
  position: absolute;
  width: 100%;
  height: 100%;
  background-color: var(--color-background);
  box-shadow: var(--shadow);
  transform: translate(calc(-100% + var(--site-nav-width-collapsed)));
  transition: transform var(--speed-fast) var(--ease);
}

.site-navigation__toggle-wrapper {
  display: flex;
  justify-content: flex-end;
  border-top: 1px solid var(--color-grey-40);
  transform: translate(calc(-100% + var(--site-nav-width-collapsed)));
  transition: transform var(--speed-fast) var(--ease);
}
.site-navigation__toggle-wrapper .ui-button-icon {
  color: var(--color-grey-40);
}
.site-navigation__toggle-wrapper .ui-button-icon svg {
  transform: translate(-50%, -50%) rotate(180deg);
  transition: transform var(--speed-fast) var(--ease);
}
.site-navigation__toggle-wrapper:hover .ui-button-icon,
.site-navigation__toggle-wrapper .ui-button-icon:focus,
.site-navigation__toggle-wrapper:active .ui-button-icon {
  color: var(--color-text);
}

.site-navigation__text {
  padding-right: var(--spacing-default);
  padding-left: calc(var(--spacing-small) * 0.5);
  color: inherit;
  transform: translate(-100%);
  transition: transform var(--speed-fast) var(--ease);
  flex: 1;
  cursor: pointer;
}

.site-navigation__list {
  margin: 0;
  padding: 0;
  margin-top: var(--spacing-default);
  list-style: none;
}

.site-navigation__list-item {
  display: flex;
  flex-wrap: nowrap;
  align-items: center;
  color: var(--color-grey-40);
  text-decoration: none;
}
.site-navigation__list-item:hover,
.site-navigation__list-item:active,
.site-navigation__list-item:focus {
  color: var(--color-text-color);
  opacity: 0.75;
}

.site-navigation__list-item--active {
  color: var(--color-blue);
}

.site-navigation__list-item--active:hover,
.site-navigation__list-item--active:active,
.site-navigation__list-item--active:focus,
 {
  color: var(--color-blue-120);
  opacity: 1;
}

.site-navigation .icon {
  background-color: var(--color-background);
  z-index: 1;
}

.site-navigation .icon,
.site-navigation .icon svg {
  color: inherit;
}

.site-navigation .icon path {
  color: inherit;
  fill: currentColor;
}

.site-navigation--expanded .site-navigation__text,
.site-navigation--expanded .site-navigation__toggle-wrapper,
.site-navigation--expanded:before {
  transform: translate(0);
}
.site-navigation--expanded
  .site-navigation__toggle-wrapper
  .ui-button-icon
  svg {
  transform: translate(-50%, -50%) rotate(0deg);
}
</style>

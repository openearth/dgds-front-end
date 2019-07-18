<template>
  <nav
    class="site-navigation"
    :class="{ 'site-navigation--expanded': expanded }"
    label="site navigation"
  >
    <ul class="site-navigation__list">
      <li>
        <nuxt-link
          class="site-navigation__list-item site-navigation__list-item--active"
          to="/"
        >
          <Icon
            size="large"
            name="theme-flooding"
            fallback-name="placeholder"
          />
          <span class="site-navigation__text h4">Flooding</span>
        </nuxt-link>
      </li>
      <li>
        <nuxt-link class="site-navigation__list-item" to="/">
          <Icon
            size="large"
            name="theme-coastal-management"
            fallback-name="placeholder"
          />
          <span class="site-navigation__text h4">Coastal Management</span>
        </nuxt-link>
      </li>
      <li>
        <nuxt-link class="site-navigation__list-item" to="/">
          <Icon
            size="large"
            name="theme-offshore"
            fallback-name="placeholder"
          />
          <span class="site-navigation__text h4">Offshore</span>
        </nuxt-link>
      </li>
    </ul>
    <div class="site-navigation__toggle-wrapper">
      <UiButtonIcon @click="toggleExpanded">
        <Icon size="large" name="expand" fallback-name="placeholder" />
      </UiButtonIcon>
    </div>
  </nav>
</template>

<script>
import UiButtonIcon from './ui-button-icon'
import Icon from './icon'

export default {
  components: { UiButtonIcon, Icon },
  data: () => ({
    expanded: false,
  }),
  methods: {
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
  background-color: var(--color-background);
  box-shadow: var(--shadow);
  padding-top: var(--spacing-default);
}

.site-navigation__toggle-wrapper {
  display: flex;
  justify-content: flex-end;
  border-top: 1px solid var(--color-grey-40);
}
.site-navigation__toggle-wrapper .ui-button-icon {
  color: var(--color-grey-40);
  transition: transform var(--speed-normal) var(--ease);
}

.site-navigation__list:hover + .site-navigation__toggle-wrapper .ui-button-icon,
.site-navigation--expanded .site-navigation__toggle-wrapper .ui-button-icon {
  transform: rotate(180deg);
}

.site-navigation__text {
  padding-right: var(--spacing-default);
  padding-left: calc(var(--spacing-small) * 0.5);
  color: inherit;
  display: none;
}

.site-navigation__list:hover .site-navigation__text,
.site-navigation--expanded .site-navigation__text {
  display: inline-block;
}

.site-navigation__list {
  margin: 0;
  padding: 0;
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
.site-navigation__list-item--active:focus {
  color: var(--color-blue-120);
  opacity: 1;
}

.site-navigation .icon,
.site-navigation .icon svg {
  color: inherit;
}

.site-navigation .icon path {
  color: inherit;
  fill: currentColor;
}
</style>

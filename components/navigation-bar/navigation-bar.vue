<template>
  <nav
    class="navigation-bar"
    :class="{ 'navigation-bar--expanded': sidebarExpanded }"
    @transitionend="onTransitionEnd"
  >
    <div class="navigation-bar__logo">
      <img :src="logo" width="24" />
    </div>

    <ul class="navigation-bar__list">
      <li v-for="(theme, key) in getThemes" :key="key">
        <div class="navigation-bar__list-item">
          <UiButtonIcon
            kind="quiet"
            :class="{ 'ui-button-icon--active': isActive(theme.id) }"
            @click="toggleTheme(theme.id)"
          >
            <Icon :name="`theme-${theme.id}`" />
            <span class="ui-button-icon__label bodytext-m">{{ theme.name }}</span>
          </UiButtonIcon>
        </div>
      </li>
    </ul>

    <ul class="navigation-bar__list">
      <li>
        <UiButtonIcon @click="toggleAbout">
          <Icon name="info" />
          <span class="ui-button-icon__label bodytext-m">About</span>
        </UiButtonIcon>
      </li>
      <li>
        <UiButtonIcon @click="toggleAccount">
          <Icon name="account" />
          <span class="ui-button-icon__label bodytext-m">Account</span>
        </UiButtonIcon>
      </li>
    </ul>

    <div class="navigation-bar__toggle">
      <UiButtonIcon @click="toggleNavigation">
        <Icon name="collapse" />
      </UiButtonIcon>
    </div>
  </nav>
</template>

<script>
import { mapGetters, mapMutations, mapState } from 'vuex'
import UiButtonIcon from '../ui-button-icon'
import Icon from '../icon'

export default {
  components: { UiButtonIcon, Icon },
  data: () => ({
    activeTheme: null
  }),
  computed: {
    ...mapGetters('map/themes', ['getThemes', 'getActiveTheme']),
    ...mapState('preferences', ['sidebarExpanded']),
    logo () {
      return require('~/assets/images/deltares_avatar.png')
    }
  },
  methods: {
    ...mapMutations('map', ['toggleActiveTheme']),
    isActive (id) {
      return this.activeTheme === id
    },
    onTransitionEnd () {
      this.$store.commit('preferences/setSidebarAnimating', { animating: false })
    },
    toggleTheme (id) {
      this.toggleActiveTheme(id)

      if (this.activeTheme === id) {
        this.activeTheme = null
      } else {
        this.activeTheme = id
      }

      this.$emit('change-theme')
    },
    toggleAbout () {
      this.$emit('toggle-about')
    },
    toggleAccount () {
      this.$emit('toggle-account')
    },
    toggleNavigation () {
      this.$store.commit('preferences/setSidebarAnimating', { animating: true })
      this.$store.commit('preferences/setSidebarExpanded', { expanded: !this.sidebarExpanded })
    }
  }
}
</script>

<style>
  .navigation-bar {
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    display: flex;
    flex-direction: column;
    height: 100%;
    width: var(--nav-bar-width);
    background-color: var(--color-background);
    box-shadow: 4px 0 24px 0 rgba(0, 0, 0, .1);
    z-index: 3;
  }

  .default-layout--sidebar-animating .navigation-bar {
    transition: width .35s ease;
  }

  .navigation-bar--expanded {
    width: var(--nav-bar-expanded-width);
  }

  .ui-button-icon__label {
    position: absolute;
    min-width: 150px;
    text-align: left;
    opacity: 0;
    left: 5rem;
    transform: translateX(-10px);
    transition: opacity .1s ease, transform .2s ease;
    pointer-events: none;
  }

  .navigation-bar--expanded .ui-button-icon__label {
    opacity: 1;
    transform: translateX(0);
    transition: opacity .35s ease, transform .35s ease;
    pointer-events: all;
  }

  .navigation-bar .ui-button-icon {
    border-radius: 0;
    width: 100%;
    height: auto;
    display: flex;
    justify-content: flex-start;
    align-content: center;
    padding: .75rem var(--spacing-default);
  }

  .navigation-bar__list:first-of-type .ui-button-icon .icon {
    width: 30px;
    height: 30px;
  }

  .navigation-bar__list:last-of-type .ui-button-icon .icon {
    width: 26px;
    height: 26px;
  }

  .ui-button-icon--active {
    background-color: var(--color-quiet-focus);
  }

  .ui-button-icon--active path {
    fill: var(--color-blue);
  }

  .navigation-bar__logo {
    padding: .75rem var(--spacing-default);
  }

  .navigation-bar__logo img {
    padding: .125rem;
    width: 30px;
  }

  .navigation-bar__list {
    margin: 0;
    padding: 0;
    list-style: none;
  }

  .navigation-bar__list:last-of-type {
    margin-top: auto;
  }

  .navigation-bar__toggle .icon {
    transform: rotate(180deg);
    transition: transform .35s ease;
  }

  .navigation-bar--expanded .navigation-bar__toggle .icon {
    transform: rotate(0deg);
  }
</style>

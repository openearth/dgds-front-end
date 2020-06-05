<template>
  <nav
    :class="{ 'navigation-bar--expanded': sidebarExpanded }"
    class="navigation-bar"
    @transitionend="onTransitionEnd"
  >
    <ui-button-icon
      data-v-step="1"
      class="navigation-bar__logo"
      kind="quiet"
      @click="resetSettings"
    >
      <icon name="deltares" size="large" />
      <span class="ui-button-icon__label bodytext-m">Deltares</span>
    </ui-button-icon>

    <ul class="navigation-bar__list">
      <li v-for="(theme, key) in getThemes" :key="key">
        <div class="navigation-bar__list-item">
          <ui-button-icon
            :data-v-step="theme.name === 'Flooding' ? '2' : false"
            :class="{ 'ui-button-icon--active': isActive(theme.id) }"
            @click="toggleTheme(theme.id)"
          >
            <icon :name="`theme-${theme.id}`" />
            <span class="ui-button-icon__label bodytext-m">{{ theme.name }}</span>
          </ui-button-icon>
        </div>
      </li>
    </ul>

    <ul class="navigation-bar__list">
      <li>
        <ui-button-icon @click="toggleAbout">
          <icon name="info" />
          <span class="ui-button-icon__label bodytext-m">About</span>
        </ui-button-icon>
      </li>
      <li>
        <ui-button-icon @click="toggleAccount" data-v-step="6">
          <icon name="account" />
          <span class="ui-button-icon__label bodytext-m">Account</span>
        </ui-button-icon>
      </li>
    </ul>

    <div class="navigation-bar__toggle">
      <ui-button-icon @click="toggleNavigation">
        <icon name="collapse" />
      </ui-button-icon>
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
      activeTheme: null,
    }),
    computed: {
      ...mapGetters('map/themes', ['getThemes', 'getActiveTheme']),
      ...mapState('preferences', ['sidebarExpanded']),
      ...mapState('map', ['defaultRasterLayerId']),
      logo() {
        return require('~/assets/images/deltares_avatar.png')
      },
    },
    methods: {
      ...mapMutations('map', ['resetMap', 'setActiveRasterLayer', 'toggleActiveTheme']),
      ...mapMutations('preferences', ['resetPreferences']),
      isActive(id) {
        return this.activeTheme === id
      },
      onTransitionEnd() {
        this.$store.commit('preferences/setSidebarAnimating', { animating: false })
      },
      resetSettings() {
        this.resetMap()
        this.resetPreferences()
        this.setActiveRasterLayer(this.defaultRasterLayerId)

        this.activeTheme = null

        this.$router.push({ path: '/' })
      },
      toggleTheme(id) {
        this.toggleActiveTheme(id)

        if (this.activeTheme === id) {
          this.activeTheme = null
        } else {
          this.activeTheme = id
        }

        this.$emit('change-theme')
      },
      toggleAbout() {
        this.$emit('toggle-about')
      },
      toggleAccount() {
        this.$emit('toggle-account')
      },
      toggleNavigation() {
        this.$store.commit('preferences/setSidebarAnimating', { animating: true })
        this.$store.commit('preferences/setSidebarExpanded', { expanded: !this.sidebarExpanded })
      },
    },
  }
</script>

<style>
  .navigation-bar {
    display: flex;
    position: absolute;
    z-index: 3;
    top: 0;
    bottom: 0;
    left: 0;
    flex-direction: column;
    width: var(--nav-bar-width);
    height: 100%;
    background-color: var(--color-background);
    box-shadow: 4px 0 24px 0 rgba(0, 0, 0, 0.1);
  }

  .default-layout--sidebar-animating .navigation-bar {
    transition: width 0.35s ease;
  }

  .navigation-bar--expanded {
    width: var(--nav-bar-expanded-width);
  }

  .ui-button-icon__label {
    position: absolute;
    left: 5rem;
    min-width: 160px;
    transform: translateX(-10px);
    transition: opacity 0.1s ease, transform 0.2s ease;
    opacity: 0;
    text-align: left;
    pointer-events: none;
  }

  .navigation-bar--expanded .ui-button-icon__label {
    transform: translateX(0);
    transition: opacity 0.35s ease, transform 0.35s ease;
    opacity: 1;
    pointer-events: all;
  }

  .navigation-bar .ui-button-icon {
    display: flex;
    align-content: center;
    justify-content: flex-start;
    width: 100%;
    height: auto;
    padding: 0.75rem var(--spacing-default);
    border-radius: 0;
  }

  .navigation-bar__list .ui-button-icon:hover .ui-button-icon__label {
    opacity: 1;
    transform: translateX(15px);
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

  .ui-button-icon--active .ui-button-icon__label {
    color: var(--color-blue);
  }

  .ui-button-icon--active svg {
    fill: var(--color-blue);
  }

  .navigation-bar__logo {
    padding: 0.75rem var(--spacing-default);
    height: 59px;
    display: flex;
    align-items: center;
  }

  .navigation-bar__logo img {
    width: 32px;
    padding: 0.125rem;
  }

  .navigation-bar__logo .icon {
    width: 30px;
    height: 30px;
  }

  .navigation-bar__list {
    margin: 0;
    padding: 0;
    list-style: none;
  }

  .navigation-bar__list:last-of-type {
    margin-top: auto;
  }

  .navigation-bar__toggle {
    border-top: 1px solid var(--color-form-base);
  }

  .navigation-bar__toggle .ui-button-icon {
    padding: var(--spacing-small) var(--spacing-default);
  }

  .navigation-bar__toggle .icon {
    transform: rotate(180deg);
    transition: transform 0.35s ease;
  }

  .navigation-bar--expanded .navigation-bar__toggle .icon {
    transform: rotate(0deg);
  }
</style>

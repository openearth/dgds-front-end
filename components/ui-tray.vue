<template>
  <div class="ui-tray">
    <div class="ui-tray__close">
      <ui-button-icon @click="onClickClose">
        <Icon name="action-cross" />
      </ui-button-icon>
    </div>
    <header v-if="hasHeader" class="ui-tray__header">
      <slot name="header" />
    </header>
    <div v-if="hasBody" class="ui-tray__body">
      <slot name="body" />
    </div>
    <footer v-if="hasFooter" class="ui-tray__footer">
      <slot name="footer" />
    </footer>
  </div>
</template>

<script>
import UiButtonIcon from './ui-button-icon'
import Icon from './icon'

export default {
  components: {
    Icon,
    UiButtonIcon
  },
  computed: {
    hasHeader () {
      return !!this.$slots.header
    },
    hasBody () {
      return !!this.$slots.body
    },
    hasFooter () {
      return !!this.$slots.footer
    }
  },
  methods: {
    onClickClose () {
      this.$emit('on-close')
    }
  }
}
</script>

<style>
  .ui-tray {
    display: flex;
    position: fixed;
    top: 0;
    flex-direction: column;
    width: 500px;
    height: 100%;
    padding: 0 var(--spacing-default);
    background-color: var(--color-background);
    box-shadow: var(--shadow);
  }

  .ui-tray__close {
    position: absolute;
    top: .5rem;
    right: .5rem;
  }

  .ui-tray__close .ui-button-icon {
    width: 2.5rem;
    height: 2.5rem;
  }

  .ui-tray__header {
    flex: 0 0 auto;
  }

  .ui-tray__body {
    flex: 1 1 100%;
    margin-bottom: var(--spacing-default);
    overflow-x: auto;
  }

  .ui-tray__footer {
    flex: 0 0 auto;
    margin-bottom: var(--spacing-default);
  }
</style>

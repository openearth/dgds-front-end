<template>
  <span class="icon" :class="{ 'icon--large': size === 'large' }" role="presentation">
    <i v-if="mdi" class="material-icons mdi-icon" :class="{ 'mdi-icon--large': size === 'large' }">{{ name }}</i>
    <span v-else v-html="icon" />
  </span>
</template>

<script>
export default {
  props: {
    name: {
      type: String,
      default: ''
    },
    size: {
      type: String,
      default: null
    },
    mdi: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    icon () {
      try {
        return require(`../assets/icons/icon-${this.name}.svg`)
      } catch {
        return require('../assets/icons/icon-placeholder.svg')
      }
    }
  }
}
</script>

<style>
  .icon {
    display: inline-block;
    width: 24px;
    height: 24px;
  }

  .icon--large {
    width: 3rem;
    height: 3rem;
  }

  .icon span {
    display: block;
    width: 100%;
    height: 100%;
  }

  .icon svg {
    display: block;
    width: 100%;
    width: 100%;
    height: 100%;
  }

  .icon--large svg {
    transform: scale(1.25);
  }

  .mdi-icon {
    width: 24px;
    height: 24px;
    margin: auto;
    font-size: 24px;
  }

  .mdi-icon--large {
    width: 36px;
    height: 36px;
    font-size: 36px;
  }
</style>

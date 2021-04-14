<template>
  <span
    class="icon"
    :class="{ 'icon--large': size === 'large' }"
    role="presentation"
  >
    <span v-html="icon" />
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
    }
  },
  computed: {
    icon () {
      try {
        console.log(this.name)
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
  width: 2rem;
  height: 2rem;
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
  fill: currentColor;
}
</style>

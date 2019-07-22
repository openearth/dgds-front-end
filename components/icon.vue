<template>
  <span class="icon" :class="{ 'icon--large': size === 'large' }">
    <component :is="icon" />
  </span>
</template>

<script>
export default {
  props: {
    name: {
      type: String,
      default: '',
    },
    fallbackName: {
      type: String,
      default: 'empty',
    },
    size: {
      type: String,
      default: null,
    },
  },
  computed: {
    icon() {
      return () =>
        // prettier-ignore
        // eslint-disable-next-line
        import(`~/assets/icon-${this.name}.svg`)
          .catch(() =>
            import(`~/assets/icon-${this.fallbackName}.svg`)
          )
    },
  },
}
</script>

<style>
.icon--large {
  display: block;
  width: 3rem;
  height: 3rem;
  position: relative;
}

.icon--large svg {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%) scale(1.25);
}
</style>

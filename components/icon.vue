<template>
  <span>
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

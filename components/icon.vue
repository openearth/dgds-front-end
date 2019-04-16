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
  },
  computed: {
    icon() {
      return () => import(`~/assets/icon-${this.name || 'empty'}.svg`)
    },
  },
}
</script>

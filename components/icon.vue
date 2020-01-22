<template>
  <span class="icon" :class="{ 'icon--large': size === 'large' }">
    <img :src="icon">
  </span>
</template>

<script>

const availableIcons = [
  'action-chevron-down',
  'action-cross',
  'collapse',
  'dataset-cc',
  'dataset-dd',
  'dataset-gb',
  'dataset-mo_50',
  'dataset-mt',
  'dataset-pp',
  'dataset-sh',
  'dataset-sm',
  'dataset-tt',
  'dataset-wd',
  'dataset-wl',
  'dataset-wl0',
  'dataset-wv',
  'empty',
  'placeholder',
  'theme-cm',
  'theme-fl',
  'theme-os'
]

export default {
  props: {
    name: {
      type: String,
      default: ''
    },
    fallbackName: {
      type: String,
      default: 'empty'
    },
    size: {
      type: String,
      default: null
    }
  },
  computed: {
    icon () {
      let url = `~/assets/icon-${this.name}.svg`

      if (!availableIcons.includes(this.name)) {
        url = '~/assets/icon-empty.svg'
      }
      return url
    }
  }
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

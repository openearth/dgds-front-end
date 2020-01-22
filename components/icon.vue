<template>
  <span class="icon" :class="{ 'icon--large': size === 'large' }">
    <img :src="icon">
  </span>
</template>

<script>

import _ from 'lodash'

// Extend this list when you need a new icon.
// Imports should not be based on an expression.
const availableIcons = {
  'action-chevron-down': '/icons/icon-action-chevron-down.svg',
  'action-cross': '/icons/icon-action-cross.svg',
  collapse: '/icons/icon-collapse.svg',
  'dataset-cc': '/icons/icon-dataset-cc.svg',
  'dataset-dd': '/icons/icon-dataset-dd.svg',
  'dataset-gb': '/icons/icon-dataset-gb.svg',
  'dataset-mo_50': '/icons/icon-dataset-mo_50.svg',
  'dataset-mt': '/icons/icon-dataset-mt.svg',
  'dataset-pp': '/icons/icon-dataset-pp.svg',
  'dataset-sh': '/icons/icon-dataset-sh.svg',
  'dataset-sm': '/icons/icon-dataset-sm.svg',
  'dataset-tt': '/icons/icon-dataset-tt.svg',
  'dataset-wd': '/icons/icon-dataset-wd.svg',
  'dataset-wl': '/icons/icon-dataset-wl.svg',
  'dataset-wl0': '/icons/icon-dataset-wl0.svg',
  'dataset-wv': '/icons/icon-dataset-wv.svg',
  empty: '/icons/icon-empty.svg',
  placeholder: '/icons/icon-placeholder.svg',
  'theme-cm': '/icons/icon-theme-cm.svg',
  'theme-fl': '/icons/icon-theme-fl.svg',
  'theme-os': '/icons/icon-theme-os.svg'
}

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
      const icon = _.get(availableIcons, this.name, availableIcons.empty)
      return icon
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

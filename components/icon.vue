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
  'action-chevron-down': import('~/assets/icon-action-chevron-down.svg'),
  'action-cross': import('~/assets/icon-action-cross.svg'),
  collapse: import('~/assets/icon-collapse.svg'),
  'dataset-cc': import('~/assets/icon-dataset-cc.svg'),
  'dataset-dd': import('~/assets/icon-dataset-dd.svg'),
  'dataset-gb': import('~/assets/icon-dataset-gb.svg'),
  'dataset-mo_50': import('~/assets/icon-dataset-mo_50.svg'),
  'dataset-mt': import('~/assets/icon-dataset-mt.svg'),
  'dataset-pp': import('~/assets/icon-dataset-pp.svg'),
  'dataset-sh': import('~/assets/icon-dataset-sh.svg'),
  'dataset-sm': import('~/assets/icon-dataset-sm.svg'),
  'dataset-tt': import('~/assets/icon-dataset-tt.svg'),
  'dataset-wd': import('~/assets/icon-dataset-wd.svg'),
  'dataset-wl': import('~/assets/icon-dataset-wl.svg'),
  'dataset-wl0': import('~/assets/icon-dataset-wl0.svg'),
  'dataset-wv': import('~/assets/icon-dataset-wv.svg'),
  empty: import('~/assets/icon-empty.svg'),
  placeholder: import('~/assets/icon-placeholder.svg'),
  'theme-cm': import('~/assets/icon-theme-cm.svg'),
  'theme-fl': import('~/assets/icon-theme-fl.svg'),
  'theme-os': import('~/assets/icon-theme-os.svg')
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

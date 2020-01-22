<template>
  <span class="icon" :class="{ 'icon--large': size === 'large' }">
    <component :is="icon" />
  </span>
</template>

<script>

import _ from 'lodash'

// Extend this list when you need a new icon.
// Imports should not be based on an expression.
const availableIcons = {
  'action-chevron-down': import('~/assets/icons/icon-action-chevron-down.svg'),
  'action-cross': import('~/assets/icons/icon-action-cross.svg'),
  collapse: import('~/assets/icons/icon-collapse.svg'),
  'dataset-cc': import('~/assets/icons/icon-dataset-cc.svg'),
  'dataset-dd': import('~/assets/icons/icon-dataset-dd.svg'),
  'dataset-gb': import('~/assets/icons/icon-dataset-gb.svg'),
  'dataset-mo_50': import('~/assets/icons/icon-dataset-mo_50.svg'),
  'dataset-mt': import('~/assets/icons/icon-dataset-mt.svg'),
  'dataset-pp': import('~/assets/icons/icon-dataset-pp.svg'),
  'dataset-sh': import('~/assets/icons/icon-dataset-sh.svg'),
  'dataset-sm': import('~/assets/icons/icon-dataset-sm.svg'),
  'dataset-tt': import('~/assets/icons/icon-dataset-tt.svg'),
  'dataset-wd': import('~/assets/icons/icon-dataset-wd.svg'),
  'dataset-wl': import('~/assets/icons/icon-dataset-wl.svg'),
  'dataset-wl0': import('~/assets/icons/icon-dataset-wl0.svg'),
  'dataset-wv': import('~/assets/icons/icon-dataset-wv.svg'),
  empty: import('~/assets/icons/icon-empty.svg'),
  placeholder: import('~/assets/icons/icon-placeholder.svg'),
  'theme-cm': import('~/assets/icons/icon-theme-cm.svg'),
  'theme-fl': import('~/assets/icons/icon-theme-fl.svg'),
  'theme-os': import('~/assets/icons/icon-theme-os.svg')
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

      // this is a hack to produce inline svg...
      // It should be possible without, but this does not work
      // https://calebporzio.com/using-inline-svgs-in-vue-compoments/
      return () => icon
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

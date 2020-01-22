<template>
  <span class="icon" :class="{ 'icon--large': size === 'large' }">
    <component :is="icon" />
  </span>
</template>

<script>

import _ from 'lodash'

// Use node-js to create components for all icons
// Search for all  icons in the icons folder
const requires = require.context('~/assets/icons', true, /^(.*\.(svg$))[^.]*$/im)
// Lookup the name
const nameRe = /icon-(.*)\.svg/
// store  them in a dictionary, make available
export const icons = {}

// fill the icons
requires.keys().forEach(function (key) {
  const name = nameRe.exec(key)[1] || 'empty'
  icons[name] = requires(key)
})

console.log('icons', icons)

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
      const icon = _.get(icons, this.name, icons.empty)
      // return the module
      return icon.default
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

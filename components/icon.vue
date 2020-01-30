<template>
  <span class="icon" :class="{ 'icon--large': size === 'large' }">
    <i class="material-icons mdi-icon" :class="{ 'mdi-icon--large': size === 'large' }" v-if="mdi">{{ name }}</i>
    <component :is="icon" v-else />
  </span>
</template>

<script>

import Vue from 'vue'
import _ from 'lodash'

// Use node-js to create components for all icons
// Search for all  icons in the icons folder
const requires = require.context('../assets/icons', true, /^(.*\.(svg$))[^.]*$/im)
// Lookup the name
const nameRe = /icon-(.*)\.svg/
// store  them in a dictionary, make available
export const icons = {}

// fill the icons
requires.keys().forEach(function (key) {
  const name = nameRe.exec(key)[1] || 'empty'
  try {
    icons[name] = requires(key)
  } catch (e) {
    icons[name] = Vue.component('icon-' + name, {})
  }
})

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
    },
    mdi: {
      type: Boolean,
      default: false
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
@import 'material-design-icons/iconfont/material-icons.css';

.icon {
  display: flex;
}

.icon svg {
  margin: auto;
}

.icon--large {
  margin: auto;
  display: flex;
  width: 3rem;
  height: 3rem;
}

.icon--large svg {
  margin: auto;
  transform: scale(1.25);
}

.mdi-icon {
  margin: auto;
  font-size: 24px;
  width: 24px;
  height: 24px;
}

.mdi-icon--large {
  margin: auto;
  font-size: 36px;
  width: 36px;
  height: 36px;
}
</style>

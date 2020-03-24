<template>
  <span class="icon" :class="{ 'icon--large': size === 'large' }" role="presentation">
    <i v-if="mdi" class="material-icons mdi-icon" :class="{ 'mdi-icon--large': size === 'large' }">{{ name }}</i>
    <span v-else v-html="icon" />
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
    },
    mdi: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    icon () {
      return require(`../assets/icons/icon-${this.name}.svg`)
    }
  }
}
</script>

<style>
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

<template>
  <button class="button-icon" aria-label="text" v-on="$listeners">
    <slot />
  </button>
</template>

<script>
export default {
  props: {
    text: {
      type: String,
      default: '',
    },
  },
}
</script>

<style>
.button-icon {
  background-color: transparent;
  border: none;
  width: 3rem;
  height: 3rem;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0;
  cursor: pointer;
}

.button-icon > svg {
  pointer-events: none;
}

.button-icon path {
  fill: var(--color-text-color);
}
</style>

<template>
  <button class="ui-button-icon" aria-label="text" v-on="$listeners">
    <slot />
  </button>
</template>

<script>
export default {
  props: {
    text: {
      type: String,
      default: ''
    }
  }
}
</script>

<style>
.ui-button-icon {
  background-color: var(--color-quiet);
  border: transparent;
  border-radius: var(--border-radius);
  width: 3rem;
  height: 3rem;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0;
  cursor: pointer;
  outline: none;
  transition: background-color var(--speed-fast) var(--ease);
}

.ui-button-icon > svg {
  pointer-events: none;
  color: inherit;
}

.ui-button-icon path {
  fill: currentColor;
  color: inherit;
}

.ui-button-icon:hover {
  background-color: var(--color-quiet-hover);
}

.ui-button-icon:focus {
  background-color: var(--color-quiet-focus);
}

.ui-button-icon:active {
  background-color: var(--color-quiet-pressed);
}
</style>

<template>
  <button type="button" class="ui-button-icon" :disabled="disabled" :aria-label="text" v-on="$listeners">
    <slot />
  </button>
</template>

<script>
export default {
  props: {
    text: {
      type: String,
      default: ''
    },
    disabled: {
      type: Boolean,
      default: false
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

.ui-button-icon svg {
  pointer-events: none;
  stroke: inherit;
  color: inherit;
}

.ui-button-icon path {
  stroke: inherit;
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

.ui-button-icon:disabled {
  background-color: var(--color-background);
  cursor: wait;
}

.ui-button-icon__label {
  color: var(--color-text-color);
}
</style>

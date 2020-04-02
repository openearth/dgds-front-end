<template>
  <button
    type="button"
    class="ui-button"
    :class="{
      'ui-button--primary': kind === 'primary',
      'ui-button--secondary': kind === 'secondary',
      'ui-button--quiet': kind === 'quiet',
    }"
    v-bind="$attrs"
    v-on="$listeners"
  >
    <slot />
  </button>
</template>

<script>
  export default {
    props: {
      kind: {
        type: String,
        default: 'primary',
      },
    },
  }
</script>

<style scoped>
  .ui-button {
    padding: 1rem;
    border: transparent;
    border-radius: var(--border-radius);
    outline: none;
    color: var(--color-button-color);
    transition: background-color var(--speed-fast) var(--ease);
    cursor: pointer;
  }

  .ui-button--primary {
    background-color: var(--color-primary);
    color: var(--color-button-colorcontrast);
  }

  .ui-button--primary:hover {
    background-color: var(--color-primary-hover);
  }

  .ui-button--primary:focus {
    background-color: var(--color-primary-focus);
  }

  .ui-button--primary:active {
    background-color: var(--color-primary-pressed);
  }

  .ui-button--secondary {
    background-color: var(--color-secondary);
  }

  .ui-button--secondary:hover {
    background-color: var(--color-secondary-hover);
  }

  .ui-button--secondary:focus {
    background-color: var(--color-secondary-focus);
  }

  .ui-button--secondary:active {
    background-color: var(--color-secondary-pressed);
  }

  .ui-button--quiet {
    background-color: var(--color-quiet);
    color: var(--color-button-color);
  }

  .ui-button--quiet:hover {
    background-color: var(--color-quiet-hover);
  }

  .ui-button--quiet:focus {
    background-color: var(--color-quiet-focus);
  }

  .ui-button--quiet:active {
    background-color: var(--color-quiet-pressed);
  }

  .ui-button[disabled],
  .ui-button[disabled].--ui-button--primary,
  .ui-button[disabled].--ui-button--primary:hover,
  .ui-button[disabled].--ui-button--primary:focus,
  .ui-button[disabled].--ui-button--primary:active,
  .ui-button[disabled].--ui-button--secondry,
  .ui-button[disabled].--ui-button--secondry:hover,
  .ui-button[disabled].--ui-button--secondry:focus,
  .ui-button[disabled].--ui-button--secondry:active,
  .ui-button[disabled].--ui-button--quiet,
  .ui-button[disabled].--ui-button--quiet:hover,
  .ui-button[disabled].--ui-button--quiet:focus,
  .ui-button[disabled].--ui-button--quiet:active {
    opacity: 0.3;
    background-color: var(--color-primary);
    color: var(--color-text-inverted);
    cursor: initial;
  }
</style>

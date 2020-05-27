<template>
  <div
    class="ui-text-input"
    :class="{
      'ui-text-input--required': required,
      'ui-text-input--disabled': disabled,
    }"
  >
    <div class="ui-text-input__input">
      <label :for="id" class="ui-text-input__control" role="presentation">
        <span class="ui-text-input__label body">
          {{ label }}<span v-if="required" class="visually-hidden">(required)</span>
        </span>
        <input
          :id="id"
          :name="name || id"
          :value="value"
          v-bind="$attrs"
          :disabled="disabled"
          :required="required"
          @input="onInput"
        />
      </label>
    </div>
  </div>
</template>

<script>
  export default {
    inheritAttrs: false,
    props: {
      id: {
        type: String,
        required: true,
      },
      label: {
        type: String,
        required: true,
      },
      name: {
        type: String,
        default: () => '',
      },
      value: {
        type: String,
        default: () => '',
      },
      disabled: Boolean,
      required: Boolean,
    },
    methods: {
      onInput(e) {
        this.$emit('input', e.target.value)
      },
    },
  }
</script>

<style>
  .ui-text-input,
  .ui-text-input__input {
    display: flex;
    flex-direction: column;
    width: 100%;
  }

  .ui-text-input .ui-text-input__label {
    display: inline-block;
    margin-bottom: 10px;
    transition: color 0.25s ease;
    color: var(--color-text-color);
  }

  .ui-text-input--disabled .ui-text-input__label {
    color: var(--color-form-base);
  }

  .ui-text-input--required .ui-text-input__label::after {
    content: ' *';
  }

  .ui-text-input input {
    width: 100%;
    margin: 0;
    padding: 10px;
    transition: box-shadow 0.25s ease, color 0.25s ease;
    border: none;
    border-radius: 4px;
    outline-offset: 1px;
    background-color: transparent;
    box-shadow: inset 0 0 0 1px var(--color-form-base);
    color: var(--color-text-color);
    font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    appearance: none;
  }

  .ui-text-input input::placeholder {
    color: var(--color-form-base);
  }

  .ui-text-input input:hover,
  .ui-text-input input:focus {
    color: var(--color-text-color);
  }

  .ui-text-input input:hover {
    box-shadow: inset 0 0 0 1px var(--color-primary-hover);
  }

  .ui-text-input input:focus {
    box-shadow: inset 0 0 0 2px var(--color-primary-focus);
  }

  .ui-text-input input:disabled {
    opacity: 0.3;
    box-shadow: inset 0 0 0 1px var(--color-form-base);
    cursor: default;
  }

  .ui-text-input input:disabled::placeholder {
    color: var(--color-form-base);
  }
</style>

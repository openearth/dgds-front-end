<template>
  <div
    class="ui-select"
    :class="{
      'ui-select--focused': isFocused,
      'ui-select--disabled': disabled,
    }"
  >
    <label :for="id" class="ui-select__label">{{ label }}</label>
    <select
      :id="id"
      ref="select"
      v-model="model"
      class="ui-select__input"
      :name="name || id"
      :disabled="disabled"
      v-bind="$attrs"
      @focus="onFocus"
      @blur="onBlur"
    >
      <option v-if="placeholder" value="" disabled>
        {{ placeholder }}
      </option>
      <option v-for="option in options" :key="option.value" :value="option.value">
        {{ option.name }}
      </option>
    </select>
    <icon name="action-chevron-down" />
  </div>
</template>

<script>
  import Icon from '../components/icon'

  export default {
    components: { Icon },
    model: {
      prop: 'value',
      event: 'change',
    },
    props: {
      id: {
        type: String,
        required: true,
      },
      placeholder: {
        type: String,
        default: () => '',
      },
      name: {
        type: String,
        default: () => '',
      },
      label: {
        type: String,
        required: true,
      },
      value: {
        type: [String, Number],
        default: () => '',
      },
      options: {
        type: Array,
        required: true,
      },
      disabled: {
        type: Boolean,
      },
    },
    data() {
      return {
        isFocused: false,
      }
    },
    computed: {
      model: {
        get() {
          return this.value !== undefined || this.value !== null ? this.value : ''
        },
        set(value) {
          this.$emit('change', value)
        },
      },
    },
    methods: {
      onFocus() {
        this.isFocused = true
      },
      onBlur() {
        this.isFocused = false
      },
    },
  }
</script>

<style>
  .ui-select {
    display: flex;
    position: relative;
    flex-direction: column;
    width: 100%;
  }

  .ui-select--disabled {
    opacity: 0.3;
    cursor: default;
  }

  .ui-select .icon {
    position: absolute;
    right: var(--spacing-small);
    bottom: 10px;
    pointer-events: none;
  }

  .ui-select .icon svg {
    transition: fill 0.25s ease;
    fill: var(--color-text-color);
  }

  .ui-select .ui-select__label {
    display: inline-block;
    margin-bottom: var(--spacing-small);
    transition: color 0.25s ease;
    color: var(--color-text-color);
  }

  .ui-select__input {
    width: 100%;
    margin: 0;
    padding: var(--spacing-small) 3rem var(--spacing-small) var(--spacing-small);
    transition: background-color 0.25s ease, box-shadow 0.25s ease, color 0.25s ease;
    border: none;
    border-radius: 4px;
    outline-offset: 1px;
    background-color: transparent;
    box-shadow: inset 0 0 0 2px var(--color-form-base);
    color: var(--color-text-color);
    font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    appearance: none;
  }

  .ui-select--disabled .ui-select__input {
    background-color: var(--color-form-base);
  }

  .ui-select__input::-ms-expand {
    display: none;
  }

  .ui-select__input:focus:enabled {
    color: var(--color-text-inverted);
  }

  .ui-select__input:hover:enabled {
    background-color: var(--color-quiet-hover);
    box-shadow: inset 0 0 0 2px var(--color-quiet-hover);
  }

  .ui-select__input:focus:enabled {
    background-color: var(--color-primary-hover);
    box-shadow: inset 0 0 0 2px var(--color-primary-hover);
  }

  .ui-select__input:focus:enabled ~ .icon svg {
    fill: var(--color-text-inverted);
  }
</style>

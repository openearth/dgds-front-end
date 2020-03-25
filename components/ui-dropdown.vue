<template>
  <select
    :id="id"
    ref="select"
    v-model="model"
    class="ui-dropdown"
    :name="name || id"
    v-bind="$attrs"
    scrollbar
  >
    <option v-if="placeholder" value="" disabled>
      {{ placeholder }}
    </option>
    <option v-for="option in options" :key="option.value" :value="option.value">
      {{ option.name }}
    </option>
  </select>
</template>

<script>
export default {
  props: {
    id: {
      type: String,
      required: true
    },
    placeholder: {
      type: String,
      default: () => 'Choose... '
    },
    name: {
      type: String,
      default: () => ''
    },
    value: {
      type: [String, Number],
      default: () => ''
    },
    options: {
      type: Array,
      required: true
    }
  },
  data () {
    return {
      isFocused: false
    }
  },
  computed: {
    model: {
      get () {
        return this.value !== undefined || this.value !== null ? this.value : ''
      },
      set (value) {
        this.$emit('update:value', value)
      }
    }
  }
}
</script>
<style >
 .ui-dropdown {
    width: 180px;
    height: 38px;
    display: flex;
    border-radius: var(--border-radius);
    border: solid 1px var(--color-background);
    background-color: var(--color-form-base);
    cursor: pointer;
    padding-left: 13px;
}

.ui-dropdown__label {
  margin: auto;
  text-align: left;
  flex-grow: 1;

}

.ui-dropdown:hover {
  border-color: var(--color-primary-hover);
}

.ui-dropdown:focus {
  border-color: var(--color-primary-pressed);
}
</style>

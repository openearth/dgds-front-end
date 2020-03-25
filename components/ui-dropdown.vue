<template>
    <select class="ui-dropdown" v-model="selected" scrollbar>
      <option v-for="item in items" :key="item"  :value="item">
        {{item}}
      </option>
    </select>
    <!-- <Icon :class="[showDropdown ? 'ui-dropdown__icon-active' : 'ui-dropdown__icon']" :mdi="true" name="expand_more" /> -->
    <!-- <ul :class="[showDropdown ? 'ui-dropdown__items-active' : 'ui-dropdown__items']">
      <li v-for="item in items" :key="item" class="ui-dropdown__item" @click="setSelected(item)">
        <span class="ui-dropdown__label"> {{ item }} </span>
      </li>
    </ul> -->
</template>

<script>
// import Icon from './icon'

export default {
  // components: {
  //   Icon
  // },
  props: {
    items: {
      type: Array,
      default: () => ['Choose item...']
    },
    selectedItem: {
      type: String,
      default: () => 'Choose item...'
    }
  },
  // data () {
  //   return {
  //     showDropdown: false
  //   }
  // },
  computed: {
    selected: {
      get () {
        return this.selectedItem
      },
      set (val) {
        this.$emit('update:selectedItem', val)
      }
    }
  },
  methods: {
    setSelected (val) {
      this.selected = val
      this.showDropdown = false
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

.ui-dropdown__icon-active {
  transform: rotate(180deg);
  transition: transform var(--speed-fast) var(--ease);
}

.ui-dropdown__icon {
  transform: rotate(0deg);
  transition: transform var(--speed-fast) var(--ease);
}

.ui-dropdown__items-active {
  list-style-type: none;
  width: 180px;
  height: auto;
  max-height: calc(5 * 38px);
  transition: height var(--speed-fast) var(--ease);
  border-radius: var(--border-radius);
  border: solid 1px var(--color-background);
  background-color: var(--color-form-base);
  cursor: pointer;
  margin-top: var(--spacing-small);
  padding: 0;
  overflow-x:hidden;
  overflow-y: auto;
}

.ui-dropdown__items {
  list-style-type: none;
  width: 180px;
  height: 0px;
  transition: height var(--speed-fast) var(--ease);
  overflow-x:hidden;
}

.ui-dropdown__item {
  margin: auto 13px auto 13px;
  background-color: var(--color-form-base);
  height: 38px;
  flex-grow: 1;
  display:flex;
  border-bottom: solid 1px var(--color-background);
}

.ui-dropdown__item:last-child {
  border-bottom: none;
}

.ui-dropdown__item:hover {
  background-color: var(--color-background);
  margin: 0;
  padding-left: 13px;
}
</style>

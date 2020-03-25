<template>
  <section class="section">
    <section class="section">
      <h2 class="h2">
        Button
      </h2>
      <ui-button>Primary button</ui-button>
      <ui-button kind="secondary">
        Secondary button
      </ui-button>
      <ui-button kind="quiet">
        Quiet button
      </ui-button>
      <ui-button disabled>
        Quiet button
      </ui-button>
    </section>
    <section class="section">
      <h2 class="h2">
        Buttons icon
      </h2>
      <ui-button-icon>
        <icon name="action-cross" />
      </ui-button-icon>
    </section>
    <section class="section">
      <h2 class="h2">
        Input elements
      </h2>
      <h2 class="h4">
        Toggle
      </h2>
      <ui-toggle>foo</ui-toggle>
      <ui-toggle disabled>
        foo
      </ui-toggle>
      <ui-toggle disabled checked="true">
        foo
      </ui-toggle>
      <h2 class="h4">
        Radio
      </h2>
      <ui-radio name="group">
        item 1
      </ui-radio>
      <ui-radio name="group">
        item 2
      </ui-radio>
      <ui-radio name="group">
        item 3
      </ui-radio>
      <ui-radio name="group" disabled>
        item 4 disabled
      </ui-radio>
      <ui-radio name="other-group" :checked="true" disabled>
        item 4 disabled
      </ui-radio>
      <h2 class="h4">
        Checkbox
      </h2>
      <ui-checkbox name="group">
        item 1
      </ui-checkbox>
      <ui-checkbox name="group">
        item 2
      </ui-checkbox>
      <ui-checkbox name="group">
        item 3
      </ui-checkbox>
      <ui-checkbox name="group" disabled>
        item 4 disabled
      </ui-checkbox>
      <ui-checkbox name="other-group" :checked="true" disabled>
        item 4 disabled
      </ui-checkbox>
    </section>
    <section class="section">
      <h2 class="h2">
        Typography
      </h2>
      <h1>The quick brown fox jumps over the lazy dog.</h1>
      <h2>The quick brown fox jumps over the lazy dog.</h2>
      <h3>The quick brown fox jumps over the lazy dog.</h3>
      <h4>The quick brown fox jumps over the lazy dog.</h4>
      <p>The <strong>quick</strong> <em>brown</em> fox <a href="/ui-test">jumps</a> over the lazy dog.</p>
    </section>
    <section>
      <h2 class="h2">
        Lists
      </h2>
      <ul>
        <li>item</li>
        <li>item</li>
        <li>item</li>
      </ul>
      <ol>
        <li>item</li>
        <li>item</li>
        <li>item</li>
      </ol>
    </section>

    <section class="section">
      <h2 class="h2">
        Dropdown
      </h2>
      <div style="display: flex; flex-direction: columnn">
        <ui-dropdown id="dropdown1" :options="dropdownItems" :value.sync="selectedItem" />
      </div>
      <span>
        Selected: {{ selectedItem }}
      </span>
      <div style="display: flex; flex-direction: column">
        <ui-dropdown id="dropdown2" :options="dropdownItemsLong" :value.sync="selectedItem" />
      </div>
      <span>
        Selected: {{ selectedItem }}
        Test scrolling of dropdown menu
      </span>
      <div style="display: flex; flex-direction: columnn">
        <ui-dropdown id="dropdown3" :options="dropdownItems" :value.sync="selectedItem" disabled />
      </div>
      <span>
        Selected: {{ selectedItem }}
        Test disabled
      </span>
    </section>
  </section>
</template>

<script>
import UiButton from '../components/ui-button'
import UiToggle from '../components/ui-toggle'
import UiRadio from '../components/ui-radio'
import UiCheckbox from '../components/ui-checkbox'
import UiButtonIcon from '../components/ui-button-icon'
import Icon from '~/components/icon'
import UiDropdown from '~/components/ui-dropdown'

export default {
  layout: 'ui-test',
  components: {
    UiButton,
    UiButtonIcon,
    UiToggle,
    UiRadio,
    UiCheckbox,
    Icon,
    UiDropdown
  },
  data () {
    return {
      dropdownItems: [{
        name: 'Item 1',
        value: 'val1'
      }, {
        name: 'Item 2',
        value: 'val2'
      }, {
        name: 'Item 3',
        value: 'val3'
      }],
      dropdownItemsLong: [{
        name: 'Item 1',
        value: 'val'
      }, {
        name: 'Item 2',
        value: 'val2'
      }, {
        name: 'Item 3',
        value: 'val3'
      }, {
        name: 'Item 4',
        value: 'val4'
      }, {
        name: 'Item 5',
        value: 'val5'
      }, {
        name: 'Item 6',
        value: 'val6'
      }],
      selectedItem: 'val1',
      wrongSelectedItem: 'item 4'
    }
  }
}
</script>

<style scoped>
.ui-test {
  height: 100vh;
  overflow-y: auto;
}
.section {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: 1rem;
}
</style>

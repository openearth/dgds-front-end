<template>
  <section class="section ui-test">
    <h1 class="h1">
      UI test
    </h1>
    <hr>
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
      <div style="margin-top: 0.5rem; display: flex;">
        <ui-button style="flex: 1;">
          Wide button
        </ui-button>
      </div>
    </section>
    <section class="section">
      <h2 class="h2">
        Buttons icon
      </h2>
      <ui-button-icon>
        <icon name="chevron" />
      </ui-button-icon>
    </section>
    <section class="section">
      <h2 class="h2">
        Toggle
      </h2>
      <ui-toggle>foo</ui-toggle>
      <ui-toggle disabled>
        foo
      </ui-toggle>
      <ui-toggle disabled checked="true">
        foo
      </ui-toggle>
    </section>
    <section class="section">
      <h2 class="h2">
        Radio
      </h2>
      <div style="display: flex; flex-direction: column;">
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
        <ui-radio
          name="other-group"
          checked="checked"
          disabled
        >
          item 4 disabled
        </ui-radio>
      </div>
    </section>
    <section class="section">
      <h2 class="h2">
        Checkbox
      </h2>
      <div style="display: flex; flex-direction: column;">
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
        <ui-checkbox name="other-group" checked="checked" disabled>
          item 4 disabled
        </ui-checkbox>
      </div>
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
  padding: 1rem;
}
</style>

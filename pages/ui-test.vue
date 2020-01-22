<template>
  <section class="section">
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
  </section>
</template>

<script>
import UiButton from '../components/ui-button'
import UiToggle from '../components/ui-toggle'
import UiRadio from '../components/ui-radio'
import UiCheckbox from '../components/ui-checkbox'
import UiButtonIcon from '../components/ui-button-icon'
import Icon from '~/components/icon'

export default {
  layout: 'ui-test',
  components: {
    UiButton,
    UiButtonIcon,
    UiToggle,
    UiRadio,
    UiCheckbox,
    Icon
  }
}
</script>

<style scoped>
.section {
  padding: 1rem;
}
</style>

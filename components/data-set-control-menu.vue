<template>
  <Panel class="data-set-control-menu">
    <span class="data-set-control-menu__title h4">Theme Title</span>
    <ul class="data-set-control-menu__list">
      <li class="data-set-control-menu__list-item">
        <label class="data-set-control-menu__label">
          Water level
          <Toggle :checked="true" />
        </label>
      </li>
      <li class="data-set-control-menu__list-item">
        <label class="data-set-control-menu__label">
          Wind
          <Toggle />
        </label>
      </li>
    </ul>
  </Panel>
</template>

<script>
import Panel from './panel'
import Toggle from './toggle'

export default {
  components: { Panel, Toggle },
}
</script>

<style>
.data-set-control-menu__title {
  height: var(--spacing-double);
  display: flex;
  align-items: center;
}

.data-set-control-menu__list {
  list-style: none;
  padding: 0;
}

.data-set-control-menu__list-item {
  height: var(--spacing-double);
  display: flex;
  align-items: center;
}

.data-set-control-menu__label {
  display: flex;
  justify-content: space-between;
  flex: 1;
}
</style>

<template>
  <Panel class="data-set-control-menu">
    <span class="data-set-control-menu__title h4">Theme Title</span>
    <ul class="data-set-control-menu__list">
      <li class="data-set-control-menu__list-item">
        <label class="data-set-control-menu__label">
          <Icon class="data-set-control-menu__icon" name="waterlevel" />
          Water level
          <Toggle :checked="true" class="data-set-control-menu__control" />
        </label>
      </li>
      <li class="data-set-control-menu__list-item">
        <label class="data-set-control-menu__label">
          <Icon class="data-set-control-menu__icon" name="wind" />
          Wind
          <Toggle class="data-set-control-menu__control" />
        </label>
      </li>
    </ul>
  </Panel>
</template>

<script>
import Panel from './panel'
import Toggle from './toggle'
import Icon from './icon'

export default {
  components: { Panel, Toggle, Icon },
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
  justify-content: flex-start;
  align-items: center;
  flex: 1;
}

.data-set-control-menu__icon {
  width: var(--spacing-default);
  height: var(--spacing-default);
  margin-right: var(--spacing-half);
}

.data-set-control-menu__control {
  margin-left: auto;
}
</style>

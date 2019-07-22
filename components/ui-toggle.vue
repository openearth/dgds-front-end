<template>
  <span class="ui-toggle">
    <input
      class="ui-toggle__checkbox"
      type="checkbox"
      v-bind="$attrs"
      v-on="$listeners"
    />
    <span class="ui-toggle__visual" />
  </span>
</template>

<style>
.ui-toggle {
  position: relative;
  z-index: 0;
  height: var(--spacing-default);
  width: var(--spacing-large);
  display: inline-block;
}

.ui-toggle__checkbox {
  position: absolute;
  width: 100%;
  height: 100%;
  opacity: 0;
  z-index: 1;
  cursor: pointer;
}

.ui-toggle__visual {
  width: 100%;
  height: 100%;
  display: block;
  border-radius: 100px;
  overflow: hidden;
  position: relative;
  cursor: pointer;
  z-index: -1;
}

.ui-toggle__visual:before {
  content: '';
  display: block;
  width: 100%;
  height: 100%;
  background-color: var(--color-form-base);
  transition: background-color var(--speed-fast) var(--ease);
}

.ui-toggle__checkbox:checked + .ui-toggle__visual:before {
  background-color: var(--color-form-active);
}

.ui-toggle__visual:after {
  content: '';
  display: block;
  width: calc(var(--spacing-default) * 0.7);
  height: calc(var(--spacing-default) * 0.7);
  background-color: var(--color-white-100);
  position: absolute;
  top: calc(var(--spacing-default) * 0.15);
  left: calc(var(--spacing-default) * 0.15);
  border-radius: var(--spacing-large);
  transition: transform var(--speed-fast) var(--ease);
}

.ui-toggle__checkbox:checked + .ui-toggle__visual:after {
  transform: translateX(130%);
}

.ui-toggle__checkbox:hover + .ui-toggle__visual:before {
  background-color: var(--color-primary-hover);
}
.ui-toggle__checkbox:focus + .ui-toggle__visual:before {
  background-color: var(--color-primary-focus);
}
.ui-toggle__checkbox:active + .ui-toggle__visual:before {
  background-color: var(--color-primary-pressed);
}

.ui-toggle__checkbox[disabled] {
  cursor: default;
}
.ui-toggle__checkbox[disabled] + .ui-toggle__visual:before,
.ui-toggle__checkbox[disabled]:hover + .ui-toggle__visual:before,
.ui-toggle__checkbox[disabled]:focus + .ui-toggle__visual:before,
.ui-toggle__checkbox[disabled]:active + .ui-toggle__visual:before {
  opacity: 0.3;
  background-color: var(--color-form-base);
}
.ui-toggle__checkbox[disabled][checked] + .ui-toggle__visual:before,
.ui-toggle__checkbox[disabled][checked]:hover + .ui-toggle__visual:before,
.ui-toggle__checkbox[disabled][checked]:focus + .ui-toggle__visual:before,
.ui-toggle__checkbox[disabled][checked]:active + .ui-toggle__visual:before {
  opacity: 0.3;
  background-color: var(--color-form-active);
}
</style>

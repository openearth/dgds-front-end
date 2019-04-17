<template>
  <span class="toggle">
    <input
      class="toggle__checkbox"
      type="checkbox"
      v-bind="$attrs"
      v-on="$listeners"
    />
    <span class="toggle__visual" />
  </span>
</template>

<style>
.toggle {
  position: relative;
  z-index: 0;
  height: var(--spacing-default);
  width: var(--spacing-double);
  display: inline-block;
}

.toggle__checkbox {
  position: absolute;
  width: 100%;
  height: 100%;
  opacity: 0;
  z-index: 1;
  cursor: pointer;
}

.toggle__visual {
  width: 100%;
  height: 100%;
  display: block;
  border-radius: 100px;
  overflow: hidden;
  position: relative;
  cursor: pointer;
  z-index: -1;
}

.toggle__visual:before {
  content: '';
  display: block;
  width: 100%;
  height: 100%;
  background-color: var(--color-form-base);
  transition: background-color var(--speed-fast) var(--ease);
}

.toggle__checkbox:checked + .toggle__visual:before {
  background-color: var(--color-form-active);
}

.toggle__visual:after {
  content: '';
  display: block;
  width: calc(var(--spacing-default) * 0.7);
  height: calc(var(--spacing-default) * 0.7);
  background-color: var(--color-white-100);
  position: absolute;
  top: calc(var(--spacing-default) * 0.15);
  left: calc(var(--spacing-default) * 0.15);
  border-radius: var(--spacing-double);
  transition: transform var(--speed-fast) var(--ease);
}

.toggle__checkbox:checked + .toggle__visual:after {
  transform: translateX(130%);
}
</style>

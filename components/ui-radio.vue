<template>
  <label class="ui-radio">
    <span class="ui-radio__button-wrapper">
      <input
        class="ui-radio__input"
        type="radio"
        v-bind="$attrs"
        v-on="$listeners"
      >
      <span class="ui-radio__visual" />
    </span>
    <slot />
  </label>
</template>

<style>
.ui-radio {
  display: inline-flex;
  align-items: center;
  cursor: pointer;
}

.ui-radio__button-wrapper {
  display: inline-block;
  width: var(--spacing-default);
  height: var(--spacing-default);
  position: relative;
  margin-right: 0.25em;
  margin-left: 0.25rem;
}

.ui-radio__input {
  display: inline-block;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  cursor: pointer;
  opacity: 0;
}

.ui-radio__visual {
  display: inline-block;
  position: absolute;
  width: 100%;
  height: 100%;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  pointer-events: none;
}

.ui-radio__visual:before {
  content: '';
  border: 2px solid var(--color-form-base);
  border-radius: 50%;
  width: 100%;
  height: 100%;
  display: inline-block;
  position: absolute;
  transition: border-color var(--speed-fast) var(--ease);
}
.ui-radio__visual:after {
  content: '';
  border: 7px solid var(--color-form-active);
  background-color: var(--color-grey-05);
  border-radius: 50%;
  width: 100%;
  height: 100%;
  display: inline-block;
  position: absolute;
  transform: scale(0);
  transition: transform var(--speed-fast) var(--ease),
    border-color var(--speed-fast) var(--ease);
}

.ui-radio__input:checked + .ui-radio__visual:after {
  transform: scale(1);
}

.ui-radio__input:hover + .ui-radio__visual:before,
.ui-radio__input:hover + .ui-radio__visual:after {
  border-color: var(--color-primary-hover);
}

.ui-radio__input:hover + .ui-radio__visual:before,
.ui-radio__input:hover + .ui-radio__visual:after {
  border-color: var(--color-primary-pressed);
}

.ui-radio__input[disabled] + .ui-radio__visual {
  opacity: 0.3;
}

.ui-radio__input[disabled] + .ui-radio__visual:before,
.ui-radio__input[disabled] + .ui-radio__visual:after {
  border-color: var(--color-form-base);
}

.ui-radio__input[disabled]:checked + .ui-radio__visual:before,
.ui-radio__input[disabled]:checked + .ui-radio__visual:after {
  border-color: var(--color-form-active);
}
</style>

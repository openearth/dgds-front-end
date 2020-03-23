<template>
  <label class="ui-checkbox">
    <span class="ui-checkbox__button-wrapper">
      <input
        class="ui-checkbox__input"
        type="checkbox"
        v-bind="$attrs"
        v-on="$listeners"
      >
      <span class="ui-checkbox__visual" />
    </span>
    <slot />
  </label>
</template>

<style>
.ui-checkbox {
  display: inline-flex;
  align-items: center;
  cursor: pointer;
}

.ui-checkbox__button-wrapper {
  display: inline-block;
  width: calc(var(--spacing-small) * 2);
  height: calc(var(--spacing-small) * 2);
  position: relative;
  margin-right: 0.25em;
}

.ui-checkbox__input {
  display: inline-block;
  position: absolute;
  width: 80%;
  height: 80%;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  cursor: pointer;
  opacity: 0;
}

.ui-checkbox__visual {
  display: inline-block;
  position: absolute;
  border: 2px solid var(--color-form-active);
  border-radius: 2px;
  width: 75%;
  height: 75%;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  pointer-events: none;
}

.ui-checkbox__visual:before {
  content: '';
  border: 10px solid var(--color-form-active);
  background-color: var(--color-grey-05);
  width: 100%;
  height: 100%;
  display: inline-block;
  position: absolute;
  transform: scale(0);
  transition: transform var(--speed-fast) var(--ease),
    border-color var(--speed-fast) var(--ease);
}

.ui-checkbox__visual:after {
  content: '';
  border: 2px solid transparent;
  border-top: none;
  border-right: none;
  border-radius: 2px;
  width: 80%;
  height: 40%;
  display: inline-block;
  position: absolute;
  transform: translate(15%, 50%) rotate(-45deg);
  transition: border-color var(--speed-fast) var(--ease);
}

.ui-checkbox__input:checked + .ui-checkbox__visual:before {
  transform: scale(1);
}
.ui-checkbox__input:checked + .ui-checkbox__visual:after {
  border-color: var(--color-white-100);
}

.ui-checkbox__input:hover + .ui-checkbox__visual,
.ui-checkbox__input:hover + .ui-checkbox__visual:before {
  border-color: var(--color-primary-hover);
}

.ui-checkbox__input:focus + .ui-checkbox__visual,
.ui-checkbox__input:focus + .ui-checkbox__visual:before {
  border-color: var(--color-primary-focus);
}

.ui-checkbox__input:active + .ui-checkbox__visual,
.ui-checkbox__input:active + .ui-checkbox__visual:before {
  border-color: var(--color-primary-pressed);
}

.ui-checkbox__input[disabled] + .ui-checkbox__visual {
  opacity: 0.3;
}

.ui-checkbox__input[disabled] + .ui-checkbox__visual,
.ui-checkbox__input[disabled] + .ui-checkbox__visual:before {
  border-color: var(--color-form-base);
}

.ui-checkbox__input[disabled]:checked + .ui-checkbox__visual,
.ui-checkbox__input[disabled]:checked + .ui-checkbox__visual:before {
  border-color: var(--color-form-active);
}
</style>
